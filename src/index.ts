import { 
    GraphQLServer, 
    JsonLogger 
} from '@dreamit/graphql-server'
import fastify from 'fastify'
import { 
    userSchema, 
    userSchemaResolvers 
} from './ExampleSchemas'

const server = fastify()
const graphqlServer = new GraphQLServer(
    {
        schema: userSchema,
        rootValue: userSchemaResolvers,
        logger: new JsonLogger('fastifyServer', 'user-service')
    }
)

server.all('/graphql', async(request, reply) => {
    return graphqlServer.handleRequestAndSendResponse(request, { 
        statusCode: reply.statusCode,
        setHeader: function(name, value) {
            reply.header(name, value)
            return this 
        },
        removeHeader: function(name) {
            reply.removeHeader(name)
        },
        end: function(chunk) {
            reply.send(chunk)
            return this
        },
    })
})
  
server.listen({port: 7070}, (error, address) => {
    if (error) {
        console.error(error)
        throw error
    }
    console.log(`Server listening at ${address}`)
})