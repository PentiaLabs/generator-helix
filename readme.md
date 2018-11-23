# Helix Generator
[![npm version](https://img.shields.io/npm/v/generator-helix.svg?style=flat-square)](http://npmjs.org/generator-helix)
[![npm downloads](https://img.shields.io/npm/dm/generator-helix.svg?style=flat-square)](http://npmjs.org/generator-helix)
[![Build Status](https://img.shields.io/appveyor/ci/Saturate/generator-helix.svg?style=flat-square)](https://ci.appveyor.com/project/Saturate/generator-helix)
[![Dependency Status](https://img.shields.io/david/PentiaLabs/generator-helix.svg?style=flat-square)](https://david-dm.org/PentiaLabs/generator-helix)
[![License](https://img.shields.io/npm/l/generator-helix.svg?style=flat-square)](https://github.com/PentiaLabs/generator-helix//blob/master/LICENSE)


This generator will create a Helix compliant solution and provide the ability to create & add new projects to any layer (i.e. Feature, Foundation & Project). Unicorn is used for serialization, if you don't use serialization and or TDS you have the option not to add serialization to the project.

## Prerequisites:

- **VS 2015 or earlier**   
If you want to run the generator with only Visual Studio 2017 installed, you need the [Microsoft Build Tools 2015](https://www.microsoft.com/en-us/download/details.aspx?id=48159) as well. For more information see issue #109 and #107
- **NPM 3.x or newer** (see installed version by running `npm -v` in PowerShell)
- **NODE 6.x or newer** (see installed version by running `node -v` in PowerShell)

## Getting started

You need Yeoman (See [here](http://yeoman.io/)) . Yo and the generators used are installed using [npm]( https://www.npmjs.com/).

First thing is to install Yo using npm.

> npm install -g yo

Then you have to install the helix generator.

> npm install generator-helix -g

## How to create a solution

To create a Helix solution run the following command in an empty root folder where you want the solution to be created, and answer the questions.

> yo helix

## How to create a new project and add it to a given layer

To add a new project to an existing run the following command in the root directory, that contains the VS solution file.
You can call with the Project Name, if you do not you will be prompted to enter it.

> yo helix:add [ProjectName] [VendorPrefix]

### Modifying the add project generator

By default, the **Template** folder for the add generator is at the following path:

`C:\Users\[username]\AppData\Roaming\npm\node_modules\generator-helix\generators\add\Templates`

The **Template** folder contains all the files and folders that are copied to the project folder that is created.

It is possible to define a solution specific **Template** folder so it is possible to achieve the following:

* Add/Remove files
* Add/Remove folders 
* Modify file contents

To override the default folder, add a folder called **helix-template** to the **solution root**. 

Then all files will be copied from the solution specific **helix-template** folder instead of the default folder using the `copyTpl` function in yeoman.

You can inject all the variables that the generator defines into your files using the syntax below for example.

`<%= layerprefixedprojectname %>`

**List of Variables**
* `layerprefixedprojectname`
* `projectname`
* `projectguid`
* `layer`
* `target`
* `vendorprefix`

***Note***

The one special case is that if you have a file called `_project.csproj` in the folder, it will be copied and then renamed to the correct Project name.
This way you can create your own project file that matches your specific needs.

## Contributing

We love it if you would contribute! **Please read our [contributing guide](CONTRIBUTING.md) if you're looking to help us out.**

**Help us! Keep the quality of feature requests and bug reports high**

We strive to make it possible for everyone and anybody to contribute to this project. Please help us by making issues easier to resolve by providing sufficient information. Understanding the reasons behind issues can take a lot of time if information is left out. Time that we could rather spend on fixing bugs and adding features. Please adhere to our [issues template](ISSUE_TEMPLATE.md) when creating issues. Creating a new issues will automatically prompt a template that will let you know what the minimum requirements are.

Thank you, and happy contributing!

## Versioning

For transparency and insight into our release cycle, and for striving to maintain backward compatibility, the generator-helix project will be maintained under the Semantic Versioning guidelines as much as possible.

Releases will be numbered with the following format:

`<major>.<minor>.<patch>`

And constructed with the following guidelines:

* Breaking backward compatibility bumps the major (and resets the minor and patch)
* New additions without breaking backward compatibility bumps the minor (and resets the patch)
* Bug fixes and misc changes bumps the patch

For more information on SemVer, please visit http://semver.org/

To create a new version please follow the [Release Process](Release.md).

## Troubleshooting

*When I execute the `yo` commands as described I'm met with Execution Policy errors*

To get around this issues execute the following command in a command line prompt, such as PowerShell with administrator rights:

> Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force
