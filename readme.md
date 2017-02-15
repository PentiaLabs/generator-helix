# Helix Generator

This generator will create a Helix compliant solution and provide the ability to create & add new projects to any layer (i.e. Feature, Foundation & Project). Unicorn is used for serialization, if you don't use serialization and or TDS you have the option not to add serialization to the project. 

## Prerequisites:
NPM 3.x or newer(see installed version by running "npm -v" in PowerShell)

NODE 6.x or newer (see installed version by running "node -v" in PowerShell)

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

> yo helix:add [ProjectName]

## Contributing

We love it if you would contribute! **Please read our [contributing guide](CONTRIBUTING.md) if you're looking to help us out.**

**Help us! Keep the quality of feature requests and bug reports high**

We strive to make it possible for everyone and anybody to contribute to this project. Please help us by making issues easier to resolve by providing sufficient information. Understanding the reasons behind issues can take a lot of time if information is left out. Time that we could rather spend on fixing bugs and adding features. Please adhere to our [issues template](ISSUE_TEMPLATE.md) when creating issues. Creating a new issues will automatically prompt a template that will let you know what the minimum requirements are.

Thank you, and happy contributing!

## Troubleshooting

*When I execute the `yo` commands as described I'm met with Execution Policy errors*

To get around this issues execute the following command in a command line prompt, such as PowerShell with administrator rights:

> Set-ExecutionPolicy Unrestricted -Scope CurrentUser -Force 