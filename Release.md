# Release process

To publish a new version to Yeoman & NPM, open up powershell in the root and follow the following steps.

* Create a branch
* Update `package.json` with new version 
  * i.e. `1.0.X`
* Test the generator - `npm test`
* `git add`
* `git commit -m "bump version"`
* Create Tag - `git tag -a v1.0.1 -m "what the release contains"`
* `git push`
* Push tag - `git push --tags`
* NPM publish
  * Local (`npm publish --registry http://tund/npm/PentiaNpm`) 
    * Takes info from `package.json`
  * Public (`npm publish --registry https://registry.npmjs.org/`) 
    * Takes info from `package.json`
