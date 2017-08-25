const yeoman = require('yeoman-generator');
const mkdir = require('mkdirp');
const yosay = require('yosay');
const guid = require('uuid');
const powershell = require('../../modules/powershell');
const fs = require('fs');
const path = require('path');
const chalk = require('chalk');
const util = require('../app/utility');

module.exports = class extends yeoman {
	constructor(args, opts) {
		super(args, opts);
		this.argument('ProjectName', { type: String, required: false, desc: 'Name of the project' });
		this.argument('VendorPrefix', { type: String, required: false, desc: 'Vendor prefix used in the creation of project structure' });
	}

	init() {
		this.log(yosay('Lets generate that project!'));
		this.templatedata = {};
	}

	askForProjectSettings() {
		let done = this.async();
		let questions = [{
			type: 'input',
			name: 'ProjectName',
			message: 'Name of your project.' + chalk.blue(' (Excluding layer prefix, name can not be empty)'),
			default: this.options.ProjectName,
			validate: util.validateProjectName
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
			default: 'src',
			store: true
		},
		{
			type:'input',
			name:'VendorPrefix',
			message:'Enter optional vendor prefix',
			default: this.options.VendorPrefix,
			store: false
		}
		];

		this.prompt(questions).then((answers) => {
			this.settings = answers;
			done();
		});
	}

	askForLayer() {
		const done = this.async();
		const questions = [{
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
				},
			],
		}];

		this.prompt(questions).then((answers) => {
			this.layer = answers.layer;
             
  
			if (this.settings.VendorPrefix === '' || this.settings.VendorPrefix === undefined ) {
				this.settings.LayerPrefixedProjectName = `${this.layer}.${this.settings.ProjectName}`;
			} else {
				this.settings.LayerPrefixedProjectName = `${this.settings.VendorPrefix}.${this.layer}.${this.settings.ProjectName}`;
			}

			done();
		});
	}

	askForModuleGroup() {
		const done = this.async();
		const questions = [{
			type:'input',
			name: 'modulegroup',
			message: 'Enter optional Module Group '
		}];

		this.prompt(questions).then((answers) => { 
			this.modulegroup = answers.modulegroup ? answers.modulegroup : '';
			done();
		});
	}

	askTargetFrameworkVersion() {
		const done = this.async();
		const questions = [{
			type: 'list',
			name: 'target',
			message: 'Choose target .net framework version?',
			choices: util.getTargets,
			store: true
		}];

		this.prompt(questions).then((answers) => {
			this.target = answers.target;
			this._buildTemplateData();
			done();
		});
	}

	_buildTemplateData() {
		this.templatedata.layerprefixedprojectname = this.settings.LayerPrefixedProjectName;
		this.templatedata.projectname = this.settings.ProjectName;
		this.templatedata.vendorprefix = this.settings.VendorPrefix;
		this.templatedata.projectguid = guid.v4();
		this.templatedata.layer = this.layer;
		this.templatedata.lowercasedlayer = this.layer.toLowerCase();
		this.templatedata.target = this.target;
	}

	_copyProjectItems() {
		mkdir.sync(this.settings.ProjectPath);
		if(this.settings.serialization) {
			this.fs.copyTpl(
				this.templatePath('_project.unicorn.csproj'),
				this.destinationPath(
					path.join(
						this.settings.ProjectPath,
						this.settings.LayerPrefixedProjectName + '.csproj')
					),
					this.templatedata
				);
		} else {
			this.fs.copyTpl(
				this.templatePath('_project.csproj'),
				this.destinationPath(
					path.join(
						this.settings.ProjectPath,
						this.settings.LayerPrefixedProjectName + '.csproj')
					),
					this.templatedata);
		}
		this.fs.copyTpl(
			this.templatePath('Properties/AssemblyInfo.cs'),
			this.destinationPath(
				path.join(
					this.settings.ProjectPath,
					'/Properties/AssemblyInfo.cs')
				),
				this.templatedata
			);

			//if we have publishsettings.targets, then copy in PublishProfiles/local.pubxml
		fs.access(this.destinationPath('publishsettings.targets'), fs.constants.R_OK, (err) => {
			if(err === null){
				this.fs.copyTpl(
					this.templatePath('Properties/PublishProfiles/local.pubxml'),
					this.destinationPath(
						path.join(this.settings.ProjectPath, 'Properties/PublishProfiles/local.pubxml')
					),
					this.templatedata
				);
			}
		});
	}

	_copySolutionSpecificItems(){
		this.fs.copyTpl(
			this.destinationPath('helix-template/**/*'), 
			this.destinationPath(this.settings.ProjectPath),
			this.templatedata);
	}

	_renameProjectFile() {
		fs.renameSync(
			this.destinationPath(
				path.join(this.settings.ProjectPath, '_project.csproj')
			),
			this.destinationPath(
				path.join(
					this.settings.ProjectPath,
					this.settings.LayerPrefixedProjectName + '.csproj'
				)
			)
		);
	}

	_copySerializationItems() {
		mkdir.sync(path.join(this.settings.sourceFolder, this.layer, this.settings.ProjectName, 'serialization' ));
		const serializationDestinationFile = path.join(
			this.settings.ProjectPath,
			'App_Config/Include',
			this.settings.LayerPrefixedProjectName,
			'serialization.config'
		);
		this.fs.copyTpl(this.templatePath('_serialization.config'), this.destinationPath(serializationDestinationFile), this.templatedata);
	}

	writing() {
		this.settings.ProjectPath = path.join(this.settings.sourceFolder, this.layer, this.modulegroup, this.settings.ProjectName, 'code' );
		this._copyProjectItems();

		if(this.settings.serialization) {
			this._copySerializationItems();
		}

		if(fs.existsSync(this.destinationPath('helix-template'))) {
			this._copySolutionSpecificItems();
		}

		const files = fs.readdirSync(this.destinationPath());
		const SolutionFile = files.find(file => file.indexOf('.sln') > -1);
		const scriptParameters = '-SolutionFile \'' + this.destinationPath(SolutionFile) + '\' -Name ' + this.settings.LayerPrefixedProjectName + ' -Type ' + this.layer + ' -ProjectPath \'' + this.settings.ProjectPath + '\'' + ' -SolutionFolderName ' + this.templatedata.projectname;

		var pathToAddProjectScript = path.join(this._sourceRoot, '../../../powershell/add-project.ps1');
		powershell.runAsync(pathToAddProjectScript, scriptParameters);
	}

	end() {
		if(fs.existsSync(this.destinationPath('helix-template/_project.csproj'))){
			this._renameProjectFile();
		}
	}
};
