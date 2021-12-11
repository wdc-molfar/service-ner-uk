const { extend } = require('lodash')
const elegantSpinner = require('elegant-spinner')
const logUpdate = require('log-update')
const chalk = require('chalk')
const unzip = require('./unzip')
const download = require('./download')
const fs = require('fs').promises
const fse = require('fs-extra')
const path = require('path')
const os = require('os')

let frame = elegantSpinner();
let config =extend( require(path.resolve(__dirname, "../package.json")).ner, require('./build.config'));
console.log(`MOLFAR NER SERVICE POSTINSTALL`)
console.log(`Install MITIE NER model for ${config.models.source[config.service.lang].name} language`)

let tempDirectory = ''

fs.mkdtemp(path.join(os.tmpdir(), 'MITIE-'))

	.then( dir => {
		console.log(`Create temp directory ${dir}`)
		tempDirectory = dir
		return dir
	})

	.then( tempDir => {
		if(config.models.source[config.service.lang].url){
			console.log(`Download ${config.models.source[config.service.lang].url.join("\n")}`);
			return download(config.models.source[config.service.lang].url, tempDir, config.models.source[config.service.lang].dest)
		}
		if(config.models.source[config.service.lang].file) return new Promise( resolve => { 
			resolve(config.models.source[config.service.lang].file)
		})

	})

	.then( filePath => {
		console.log(`Create model directory ${config.models.destDir}`)
		return fse.mkdirs(config.models.destDir).then( () => filePath )
	})

	.then( filePath => {
		console.log(`Extract model into ${config.models.destDir}`);
		return unzip(filePath, config.models.destDir)
	})
	
	.then( filePath => {
		console.log(`Rename file ${path.resolve(config.models.destDir,filePath)} to ${path.resolve(config.models.destDir,"model.dat")}`);
		return fs.rename(path.resolve(config.models.destDir,filePath), path.resolve(config.models.destDir,"model.dat"))
	})

	.then( () => {
		console.log(`Remove temp ${tempDirectory}`)
		fse.remove(tempDirectory)
	})

	.then( () => {
		console.log(chalk.green(`NER Model for ${config.models.source[config.service.lang].name} language is installed into ${config.models.destDir}`))
	})

	.then(() => {
		// if( config.service.mode == "development"){
			console.log("Install MITIE package")
			let installer = require('execa')("pip", "install -r requirements.txt".split(" "))
			let stream = installer.stdout;
		    stream.pipe(process.stdout);
			return installer
		// }
	})

	.catch( e => {
		console.log(chalk.red(e.toString()))
	});
