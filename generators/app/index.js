var yeoman = require('yeoman-generator');
var mkdir = require('mkdirp');
var yosay = require('yosay');
var guid = require('uuid');

module.exports = class extends yeoman {

    constructor(args, opts) {
        super(args, opts);

        this.option('solutionName', { type: String, required: false, desc: 'the name of the Helix solution' });
    }

    init() {
        this.log(yosay('Welcome to the kickass Helix generator!'));
        this.templatedata = {};
    }

    _promptQuestions(questions) {

    }

    askForSolutionType() {
        var questions = [{
        type: 'list',
        name: 'type',
        message: 'What type of solution do you want to create?',
        choices: [
            {
            name: 'Empty Helix solution',
            value: 'emptyhelix'
            }, {
            name: 'Helix solution with Pentia tools',
            value: 'pentiahelix'
            }]
        }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.type = answers.type;
            done();
        }.bind(this));
    }

    askForSolutionSettings() {
        var questions = [{
                type: 'input',
                name: 'SolutionName',
                message: 'Name of your Helix solution',
                default: this.appname
            },
            {
                type: 'confirm',
                name: 'serialization',
                message: 'Would you like to enable serialization?'
            },
            {
                type: 'confirm',
                name: 'packagejson',
                message: 'Would you like me to setup your package.json for you?'
            }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.settings = answers;
            this._buildTemplateData();
            done();
        }.bind(this));
    }

    _buildTemplateData() {
        this.templatedata.solutionname = this.settings.SolutionName;
        this.templatedata.environmentguid = guid.v4();
        this.templatedata.projectguid = guid.v4();
        this.templatedata.featureguid = guid.v4();
        this.templatedata.foundationguid = guid.v4();
        this.templatedata.testguid = guid.v4();
    }


    _writeLayers() {
        var layers = [ 'Project', 'Feature', 'Foundation'];

            for(var i = 0; i < layers.length; i++) {
                var layer = layers[i];
                mkdir.sync(layer);
                var layerDocumentationPath = layer + '/' + layer + '-layer.md'
                this.fs.copy(this.templatePath(layerDocumentationPath),this.destinationPath(layerDocumentationPath));
            }
    }

    _copySolutionItems() {
        mkdir.sync("Project/Environment/Properties");
        this.fs.copy(this.templatePath('_gulpfile.js'), this.destinationPath("gulpfile.js"));
        this.fs.copy(this.templatePath('Project/Environment/web.config'), this.destinationPath("Project/Environment/web.config"));
        this.fs.copy(this.templatePath('Project/Environment/packages.config'), this.destinationPath("Project/Environment/packages.config"));
        this.fs.copy(this.templatePath('Project/Environment/Properties/AssemblyInfo.cs'), this.destinationPath("Project/Environment/Properties/AssemblyInfo.cs"));
        this.fs.copyTpl(this.templatePath('_solution.sln'), this.destinationPath(this.settings.SolutionName + ".sln"), this.templatedata);
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath("package.json"), this.templatedata);
        this.fs.copyTpl(this.templatePath('Project/Environment/Environment.csproj'), this.destinationPath("Project/Environment/Environment.csproj"), this.templatedata);
    }

    writing() {
            this._writeLayers();
            console.log(this.type);
            switch(this.type)
            {
                case 'emptyhelix':

                break;

                case 'pentiahelix':
                    this._copySolutionItems() 
                break;
            }
        }
};

