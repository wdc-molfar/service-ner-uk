const path = require("path")
const frame = require('elegant-spinner')()
const logUpdate = require('log-update')
// const config = require("../config")

module.exports = (path2zip, path2dest) => new Promise( (resolve, reject) => {
	const inly = require('inly');
	const extract = inly(path2zip, path2dest);
	let _p = 0
	let extractedFilePath 
	extract.on('file', (name) => {
		extractedFilePath = name
	    console.log(`file ${name} extracted`)
	});

	extract.on('progress', (percent) => {
		// if( config.mode == "development"){
		// 	if( (percent % 5) == 0) _p = percent
		// 	logUpdate(`${frame()} ${ _p }%`)	
		// }
	});

	extract.on('error', (error) => {
	    reject(error)
	});

	extract.on('end', () => {
	    resolve(extractedFilePath)
	});	
})

