const fs = require("fs")
const path = require("path")

const { Container } = require("@molfar/csc")
const { yaml2js, resolveRefs } = require("@molfar/amqp-client")


const servicePath = path.resolve(__dirname, "./service.js")
const delay = interval => new Promise( resolve => {
	setTimeout( () => {
		resolve()
	}, interval )	
}) 

const run = async () => {
	console.log("Test run @molfar/service-ner-uk")

	let config = yaml2js(fs.readFileSync(path.resolve(__dirname, "./service.msapi.yaml")).toString())
	config = await resolveRefs(config)
	// USE TO K3S
	const rabbitmqHost     = process.env.RABBITMQ_HOST
    const rabbitmqPort     = process.env.RABBITMQ_PORT
	const rabbitmqUser     = process.env.RABBITMQ_USERNAME
	const rabbitmqPassword = process.env.RABBITMQ_PASSWORD
    if(rabbitmqHost && rabbitmqPort){
		const connectionRabbitmq = `amqp://${rabbitmqUser}:${rabbitmqPassword}@${rabbitmqHost}:${rabbitmqPort}/`
		config.service.consume.amqp = {
			url: connectionRabbitmq
		}
		config.service.produce.amqp = {
			url: connectionRabbitmq
		}
	}
	//
	
	const container = new Container()

	container.hold(servicePath, "@molfar/service-ner-uk")
	const service = await container.startInstance(container.getService(s => s.name == "@molfar/service-ner-uk"))
	let res = await service.configure(config)
	console.log("Configure", res)
	res = await service.start()
	console.log("Start", res)
	console.log("Running...")	
}
run()