const { ServiceWrapper } = require("@molfar/csc")
const { AmqpManager, Middlewares } = require("@molfar/amqp-client")
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
            
            Middlewares.Filter( msg =>  {
                if( msg.content.metadata.nlp.language.locale != "ru") {
                    console.log(`${ this.config._instance_name || this.config._instance_id} ignore `, msg.content.md5, msg.content.metadata.nlp.language.locale)
                    msg.ack()
                } 
                return msg.content.metadata.nlp.language.locale == "ru"
            }),

            async (err, msg, next) => {
                let m = msg.content
                let res = await extractor.getNER(m.metadata.text)
                m.metadata.nlp = extend({}, m.metadata.nlp, 
                    {
                        ner: res.data.response.named_entities
                    }
                )
                this.publisher.send(m)
                console.log(`${ this.config._instance_name || this.config._instance_id} recognize `, m.md5, `${res.data.response.named_entities.length} entities`)
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
        console.log(`start ${ this.config._instance_name || this.config._instance_id}`)
        this.consumer.start()
        resolve({ status: "started" })
    },

    async onStop(data, resolve) {
        console.log(`stop ${ this.config._instance_name || this.config._instance_id}`)
        await this.consumer.close()
        await this.publisher.close()
        resolve({ status: "stoped" })
    }

})

service.start()