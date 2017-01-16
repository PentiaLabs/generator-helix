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
            }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.settings = answers;
            this._buildTemplateData();
            done();
        }.bind(this));
    }

    _buildTemplateData() {
        this.templatedata.projectname = this.settings.ProjectName;
        this.templatedata.projectguid = guid.v4();
    }

    _copyProjectItems() {
        this.settings.ProjectPath = "Feature/" + this.settings.ProjectName + "/code"
        mkdir.sync(this.settings.ProjectPath);
        this.fs.copyTpl(this.templatePath('_project.csproj'), this.destinationPath(path.join(this.settings.ProjectPath, this.settings.ProjectName + ".csproj")), this.templatedata);
    }

    _copySerializationItems() {
        mkdir.sync("Feature/" + this.settings.ProjectName + "/serialization");
        this.fs.copyTpl(this.templatePath('_serialization.config'), this.destinationPath("Feature/" + this.settings.ProjectName + "/code/App_Config/Include/" + this.settings.ProjectName+ "/serialization.config"), this.templatedata);
    }

    writing() {
           this._copyProjectItems() 

           if(this.settings.serialization)
           {
               this._copySerializationItems();
           }

           const files = fs.readdirSync( this.destinationPath())
           const SolutionFile = files.find(file => file.indexOf(".sln") > -1)
           console.log(SolutionFile)
           const scriptParameters = "-SolutionFile '" + this.destinationPath(SolutionFile) + "' -Name " + this.settings.ProjectName + " -Type feature -ProjectPath '" + this.settings.ProjectPath + "'";
           powershell.runAsync(path.join(this._sourceRoot, "../../../powershell/add-project.ps1"), scriptParameters)
        }
};

