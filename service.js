const { ServiceWrapper, AmqpManager, Middlewares } = require("@molfar/service-chassis")
const { extend } = require("lodash")
const path = require("path")


const NER = require("./src/javascript/bridge")
 
const config = {
     mode: 'text',
     encoding: 'utf8',
     pythonOptions: ['-u'],
     pythonPath: (process.env.NODE_ENV && process.env.NODE_ENV == "production") ? 'python' : 'python.exe',
     args: path.resolve(__dirname,"./MITIE-models/model.dat")	
}

 const extractor = new NER(config)

 extractor.start()



let service = new ServiceWrapper({
    consumer: null,
    publisher: null,
    config: null,

    async onConfigure(config, resolve) {
        this.config = config

        console.log(`configure ${ this.config._instance_name || this.config._instance_id}`)

        this.consumer = await AmqpManager.createConsumer(this.config.service.consume)

        await this.consumer.use([
            Middlewares.Json.parse,
            Middlewares.Schema.validator(this.config.service.consume.message),
            Middlewares.Error.Log,
            Middlewares.Error.BreakChain,
            

            async (err, msg, next) => {
                console.log("CONSUME", msg.content)
                next()
            },    

            Middlewares.Filter( msg =>  {
                if( msg.content.langDetector.language.locale != "uk") {
                    console.log("IGNORE", msg.content.langDetector.language.locale)
                    msg.ack()
                } else {
                    console.log("ACCEPT", msg.content.langDetector.language.locale)
                } 
                return msg.content.langDetector.language.locale == "uk"
            }),

            async (err, msg, next) => {
                let m = msg.content
                let res = await extractor.getNER(m.scraper.message.text)
                m = extend({}, m, {
                        ner: res.data.response.named_entities
                    }
                )
                this.publisher.send(m)
                console.log(`RECOGNIZE ${res.data.response.named_entities.length} named entities`)
                msg.ack()
            }

        ])

        this.publisher = await AmqpManager.createPublisher(this.config.service.produce)
        
        await this.publisher.use([
            Middlewares.Schema.validator(this.config.service.produce.message),
            Middlewares.Error.Log,
            Middlewares.Error.BreakChain,
            Middlewares.Json.stringify
        ])

        resolve({ status: "configured" })

    },

    onStart(data, resolve) {
        this.consumer.start()
        resolve({ status: "started" })
    },

    async onStop(data, resolve) {
        await this.consumer.close()
        await this.publisher.close()
        resolve({ status: "stoped" })
    }

})

service.start()