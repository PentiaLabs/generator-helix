var yeoman = require('yeoman-generator');
var mkdir = require('mkdirp');
var yosay = require('yosay');
var guid = require('uuid');
var powershell = require("../../modules/powershell");
var fs = require("fs");
var path = require("path");

module.exports = class extends yeoman {

    constructor(args, opts) {
        super(args, opts);
        this.argument('ProjectName', { type: String, required: false, desc: 'name of the project' });
    }

    init() {
        this.log(yosay('Lets generate that project!'));
        this.templatedata = {};
        this.templatedata.layer = "Foundation";
        this.sourceRoot(path.join(this._sourceRoot,"../../Templates"))
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
                message: 'Would you like to include serialization?',
                store   : true
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
            this.settings.LayerPrefixedProjectName = this.templatedata.layer + '.' + this.settings.ProjectName;
            this._buildTemplateData();
            done();
        }.bind(this));
    }

    _buildTemplateData() {
        this.templatedata.layerprefixedprojectname = this.settings.LayerPrefixedProjectName;
        this.templatedata.projectname = this.settings.ProjectName;
        this.templatedata.projectguid = guid.v4();
    }

    _copyProjectItems() {
        mkdir.sync(this.settings.ProjectPath);
        this.fs.copyTpl(this.templatePath('_project.csproj'), this.destinationPath(path.join(this.settings.ProjectPath, this.settings.LayerPrefixedProjectName + '.csproj')), this.templatedata);
        this.fs.copyTpl(this.templatePath('Properties/AssemblyInfo.cs'), this.destinationPath(path.join(this.settings.ProjectPath, '/Properties/AssemblyInfo.cs')), this.templatedata);
        
    }

    _copySerializationItems() {
        mkdir.sync(path.join(this.settings.sourceFolder, this.templatedata.layer, this.settings.ProjectName, 'serialization' ));
        var serializationDestinationFile = path.join(this.settings.ProjectPath, 'App_Config/Include', this.settings.LayerPrefixedProjectName, 'serialization.config');
        this.fs.copyTpl(this.templatePath('_serialization.config'), this.destinationPath(serializationDestinationFile), this.templatedata);
    }

    writing() {
          this.settings.ProjectPath = path.join(this.settings.sourceFolder, this.templatedata.layer, this.settings.ProjectName, 'code' );
          this._copyProjectItems() 

           if(this.settings.serialization)
           {
               this._copySerializationItems();
           }

           const files = fs.readdirSync( this.destinationPath())
           const SolutionFile = files.find(file => file.indexOf('.sln') > -1)
           const scriptParameters = "-SolutionFile '" + this.destinationPath(SolutionFile) + "' -Name " + this.settings.LayerPrefixedProjectName + " -Type " + this.templatedata.layer + " -ProjectPath '" + this.settings.ProjectPath + "'";

           powershell.runAsync(path.join(this._sourceRoot, "../../powershell/add-project.ps1"), scriptParameters)
        }
};

