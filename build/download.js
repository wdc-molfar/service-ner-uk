const path = require("path")
const axios = require('axios'); 
const splitter = require("split-file")
const url = require('url')
const fs = require('fs')
const _ = require("lodash")

downloadPart = ( fileUrl, path2dest) => 

	axios.get(fileUrl, {responseType: "stream"} )  
	.then(response => new Promise( (resolve, reject) => {

		let filePath = path.resolve( __dirname, path2dest, path.parse(url.parse(fileUrl).pathname).base)
		let outputStream = fs.createWriteStream(filePath)
		
		response.data.pipe(outputStream);
		
		outputStream.on("close", () => {
			resolve(filePath)
		})
		
		outputStream.on("error", error => {
			reject(error)
		})
	}))

module.exports = ( fileUrl, path2dest, destFilename  ) => {
	fileUrl = (_.isArray(fileUrl)) ? fileUrl : [fileUrl]

	return Promise.all( fileUrl.map( f => downloadPart(f,path2dest)))
				.then( parts => splitter.mergeFiles(parts, path.resolve( __dirname, path2dest, destFilename)))
				.then( () => path.resolve( __dirname, path2dest, destFilename)) 
}


 