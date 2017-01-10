var yeoman = require('yeoman-generator');
var mkdir = require('mkdirp');
var HelixGenerator = yeoman.generators.Base.extend({

    constructor: function() {
        yeoman.generators.Base.apply(this, arguments);

        this.argument('solutionName', { type: String, required: false, desc: 'the name of the Helix solution' });
    },

    init: function() {
        this.log(yosay('Welcome to the kickass Helix generator!'));
        this.templatedata = {};
    },

    askForSolutionType: function() {
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

        this.prompt(questions, function (props) {
        this.type = props.type;
        done();
        }.bind(this));
    },

    prompting: function() {
        var done = this.async();

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
                message: 'would you like me to setup your package.json for you?'
            }];

        this.prompt(questions).then(function(answers) {
            this.props = answers;
            this.log('Solution name: ' + answers.SolutionName);
            this.log('Serialization enabled: ' + answers.serialization);
            this.log('Package.json setup by generator: ' + answers.packagejson);           
            done();
        }.bind(this));
    },

    writing: {
        config: function () {
            this.fs.copyTpl(
                this.templatePath('_package.nuspec'),
                this.destinationPath(this.props.projectname + '.nuspec'), {
                    version: this.props.version,
                    destinationRoot: this.destinationRoot(),
                    authors: this.props.authors,
                    id: this.props.id
                }
            );
            mkdir.sync('website');
            mkdir.sync('data')
        },
    },
});