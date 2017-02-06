var yeoman = require('yeoman-generator');
var mkdir = require('mkdirp');
var yosay = require('yosay');
var guid = require('uuid');
var path = require('path');

module.exports = class extends yeoman {

    constructor(args, opts) {
        super(args, opts);

        this.option('solutionName', { type: String, required: false, desc: 'the name of the Helix solution' });
    }

    init() {
        this.log(yosay('Welcome to the kickass Helix generator!'));
        this.templatedata = {};
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
                type:'input',
                name:'sourceFolder',
                message:'Source code folder name', 
                default: 'src'
            }];

        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.settings = answers;
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
            done();
        }.bind(this));
    }


    askSiteUrl() {
        var questions = [{
                type: 'input',
                name: 'LocalWebsiteUrl',
                message: 'Enter the local website URL',
                default: 'http://'+ this.settings.SolutionName + ".local"
            }];
        var done = this.async();
        this.prompt(questions).then(function(answers) {
             this.localWebsiteUrl = answers.LocalWebsiteUrl;
             this._buildTemplateData();
            done();
        }.bind(this));
    }


    _buildTemplateData() {
        this.templatedata.solutionname = this.settings.SolutionName;
        this.templatedata.environmentguid = guid.v4();
        this.templatedata.environmentfolderguid = guid.v4();
        this.templatedata.projectguid = guid.v4();
        this.templatedata.featureguid = guid.v4();
        this.templatedata.foundationguid = guid.v4();
        this.templatedata.testguid = guid.v4();
        this.templatedata.sourceFolder = this.settings.sourceFolder;
        this.templatedata.target = this.target;
        this.templatedata.localwebsiteurl = this.localWebsiteUrl;
    }


    _writeLayers() {
        var layers = [ 'Project', 'Feature', 'Foundation'];
            
            for(var i = 0; i < layers.length; i++) {
                
                var destinationDirectory = path.join(this.settings.sourceFolder,layers[i]);
                mkdir.sync(destinationDirectory);

                var layer = layers[i];
                var layerDocumentationFileName = layer + '/' + layer + '-layer.md';
                var destinationFileName = path.join(this.destinationPath(destinationDirectory), layer + '-layer.md');
                this.fs.copy(this.templatePath(layerDocumentationFileName),this.destinationPath(destinationFileName));
            }
    }

    _copySolutionItems() {
        mkdir.sync(path.join(this.settings.sourceFolder,"Project/Environment/Properties"));

        this.fs.copy(this.templatePath('_gulpfile.js'), this.destinationPath("gulpfile.js"));

        var environmentDestination = path.join(this.settings.sourceFolder,"Project/Environment");

        this.fs.copy(this.templatePath('Project/Environment/web.config'), this.destinationPath(path.join(environmentDestination,'web.config')));
        this.fs.copy(this.templatePath('Project/Environment/packages.config'), this.destinationPath(path.join(environmentDestination,'packages.config')));
        this.fs.copy(this.templatePath('Project/Environment/Properties/AssemblyInfo.cs'), this.destinationPath(path.join(environmentDestination,'Properties/AssemblyInfo.cs')));
        this.fs.copyTpl(this.templatePath('_solution.sln'), this.destinationPath(this.settings.SolutionName + ".sln"), this.templatedata);
        this.fs.copyTpl(this.templatePath('_package.json'), this.destinationPath("package.json"), this.templatedata);
        this.fs.copyTpl(this.templatePath('_publishsettings.targets'), this.destinationPath("publishsettings.targets"), this.templatedata);
        this.fs.copyTpl(this.templatePath('Project/Environment/Project.Environment.csproj'), this.destinationPath(path.join(environmentDestination,'Project.Environment.csproj')), this.templatedata);
    }

    writing() {
            this._writeLayers();
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

