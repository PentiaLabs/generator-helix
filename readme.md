# Helix Generator

This generator will create a Helix compliant solution and provide the ability to create & add new projects to any layer (i.e. Feature, Foundation & Project). Unicorn is used for serialization, if you don't use serialization and or TDS you have the option not to add serialization to the project. 

## Getting started

You need Yeoman (See [here](http://yeoman.io/)) . Yo and the generators used are installed using [npm]( https://www.npmjs.com/).

First thing is to install Yo usng nopm.

> npm install -g yo

Then you have to install the helix generator.

> npm install generator-helix -g

## How to create a solution

To create a Helix solution run the following command in an empty root folder where you want the solution to be created, and answer the questions.

> yo helix

## How to create a new project and add it to a given layer

To add a new project to an existing run the following command in the root directory, that contains the VS solution file.

> yo helix:add


