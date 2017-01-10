var yeoman = require('yeoman-generator');
var mkdir = require('mkdirp');
var yosay = require('yosay');

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
        var done = this.async();

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

        this.prompt(questions).then(function(answers) {
            this.props = answers;
        }.bind(this));
    }

    _promptQuestions(questions) {
        var done = this.async();
        this.prompt(questions).then(function(answers) {
            this.props = answers;
            done();
        }.bind(this));
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

        this._promptQuestions(questions);
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

        this._promptQuestions(questions);
    }

    writing() {
            mkdir.sync('Project');
            mkdir.sync('Feature');
            mkdir.sync('Foundation')
        }
};

