var yeoman = require('yeoman-generator');
var mkdir = require('mkdirp');
var yosay = require('yosay');
var guid = require('uuid');
var powershell = require("../../modules/powershell");
var fs = require("fs");
var path = require("path");
var chalk = require('chalk'); 

module.exports = class extends yeoman {

    constructor(args, opts) {
        super(args, opts);
        this.argument('ProjectName', { type: String, required: false, desc: 'Name of the project' });
    }

    init() {
        this.log(yosay('Lets generate that project!'));
        this.templatedata = {};
    }

    askForProjectSettings() {
        var questions = [{
                type: 'input',
                name: 'ProjectName',
                message: 'Name of your project',
                default: this.options.ProjectName
            },
            {
                type: 'confirm',
                name: 'serialization',
                message: 'Would you like to include Unicorn (serialization)?',
                default : true
            },
            {
                type:'input',
                name:'sourceFolder',
                message:'Source code folder name', 
                default: 'src'
            }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.settings = answers;
            this.settings.ProjectName = this.settings.ProjectName;
            done();
        }.bind(this));
    }

   askForLayer() {
        var questions = [{
        type: 'list',
        name: 'layer',
        message: 'What layer do you want to add the project too?',
        choices: [
            {
            name: 'Feature layer?',
            value: 'Feature'
            }, {
            name: 'Foundation layer?',
            value: 'Foundation'
            }, {
            name: 'Project layer?',
            value: 'Project'
            }]
        }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.layer = answers.layer;
            this.settings.LayerPrefixedProjectName = this.layer + '.' + this.settings.ProjectName;
            done();
        }.bind(this));
    }

      askTargetFrameworkVersion() {
        var questions = [{
        type: 'list',
        name: 'target',
        message: 'Choose target .net framework version?',
        choices: [
            {
            name: '.net 4.6.1',
            value: 'v4.6.1'
            }, {
            name: '.net 4.6',
            value: 'v4.6'
            }, {
            name: '.net 4.5.2',
            value: 'v4.5.2'
            }]
        }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.target = answers.target;
            this._buildTemplateData();
            done();
        }.bind(this));
    }

    _buildTemplateData() {
        this.templatedata.layerprefixedprojectname = this.settings.LayerPrefixedProjectName;
        this.templatedata.projectname = this.settings.ProjectName;
        this.templatedata.projectguid = guid.v4();
        this.templatedata.layer = this.layer;
        this.templatedata.target = this.target;
    }

    _copyProjectItems() {
        mkdir.sync(this.settings.ProjectPath);
        if(this.settings.serialization)
        {
            this.fs.copyTpl(this.templatePath('_project.unicorn.csproj'), this.destinationPath(path.join(this.settings.ProjectPath, this.settings.LayerPrefixedProjectName + '.csproj')), this.templatedata);
        }
        else
        {
            this.fs.copyTpl(this.templatePath('_project.csproj'), this.destinationPath(path.join(this.settings.ProjectPath, this.settings.LayerPrefixedProjectName + '.csproj')), this.templatedata);
        }
        this.fs.copyTpl(this.templatePath('Properties/AssemblyInfo.cs'), this.destinationPath(path.join(this.settings.ProjectPath, '/Properties/AssemblyInfo.cs')), this.templatedata);
        
        //if we have publishsettings.targets, then copy in PublishProfiles/local.pubxml
        fs.access(this.destinationPath('publishsettings.targets'), fs.constants.R_OK, (err) => {
            if(err==null)
            {
                this.fs.copyTpl(this.templatePath('Properties/PublishProfiles/local.pubxml'), this.destinationPath(path.join(this.settings.ProjectPath, 'Properties/PublishProfiles/local.pubxml')), this.templatedata);
            }
        });
   }

    _copySerializationItems() {
        mkdir.sync(path.join(this.settings.sourceFolder, this.layer, this.settings.ProjectName, 'serialization' ));
        var serializationDestinationFile = path.join(this.settings.ProjectPath, 'App_Config/Include', this.settings.LayerPrefixedProjectName, 'serialization.config');
        this.fs.copyTpl(this.templatePath('_serialization.config'), this.destinationPath(serializationDestinationFile), this.templatedata);
     }

    writing() {
          this.settings.ProjectPath = path.join(this.settings.sourceFolder, this.layer, this.settings.ProjectName, 'code' );
          this._copyProjectItems() 

           if(this.settings.serialization)
           {
               this._copySerializationItems();
           }

           const files = fs.readdirSync( this.destinationPath())
           const SolutionFile = files.find(file => file.indexOf('.sln') > -1)
           const scriptParameters = "-SolutionFile '" + this.destinationPath(SolutionFile) + "' -Name " + this.settings.LayerPrefixedProjectName + " -Type " + this.layer + " -ProjectPath '" + this.settings.ProjectPath + "'" + " -SolutionFolderName " + this.templatedata.projectname;

           powershell.runAsync(path.join(this._sourceRoot, "../../../powershell/add-project.ps1"), scriptParameters)
        }
};

