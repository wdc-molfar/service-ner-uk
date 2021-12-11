const Bridge = require("@molfar/py-bridge")
const path = require("path")

const NER = class extends Bridge {
	constructor(config){
		super(config)
		this.use("__run",path.resolve(__dirname,"../python/ner.py"))
	}

	getNER(text) {
		return this.__run({
			method: "extract_entities",
			params:{
				text,
				tags:""
			}
		})
	}
}

module.exports = NER

// const run = async () => {

// 	const config = {
// 		mode: 'text',
// 		encoding: 'utf8',
// 		pythonOptions: ['-u'],
// 		pythonPath: (process.env.NODE_ENV && process.env.NODE_ENV == "production") ? 'python' : 'python.exe'
// 	}

// 	const extractor = new NER(config)
// 	extractor.start()

// 	const text = `На границе двум гражданам РФ, в частности артистке Марии Гусаровой (Mary Gu) из-за незаконного посещения захваченного Россией Крыма запретили въезд в Украину.`
// 	console.log(text)
// 	let res = await extractor.getNER(text)

// 	console.log(res)
// }

// run()
