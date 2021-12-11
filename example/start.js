const path = require("path")
const fs = require("fs")

const { Container } = require("@molfar/csc")
const { yaml2js } = require("@molfar/amqp-client")


const workerPath = path.resolve(__dirname, "../service.js")
const workerConfig = yaml2js(fs.readFileSync(path.resolve(__dirname, "../service.msapi.yaml")).toString())

workerConfig.service.consume.message = workerConfig.components.schemas.MESSAGE
workerConfig.service.consume.amqp = {
	url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
}
workerConfig.service.produce.message = workerConfig.components.schemas.MESSAGE
workerConfig.service.produce.amqp = {
	url: "amqps://xoilebqg:Nx46t4t9cxQ2M0rF2rIyZPS_xbAhmJIG@hornet.rmq.cloudamqp.com/xoilebqg"
}

const delay = interval => new Promise( resolve => {
	setTimeout( () => {
		resolve()
	}, interval )	
}) 


const run = async () => {

	const container = new Container()

	container.hold(workerPath, "--worker 1--")
	
	const worker1 = await container.startInstance(container.getService(s => s.name == "--worker 1--"))
	let res = await worker1.configure(workerConfig)
	console.log(res)
	
	
	res = await worker1.start()
	console.log(res)

	
	// await delay(10000)

	// res = await worker1.stop()
	
	// container.terminateAll()
	
}

run()