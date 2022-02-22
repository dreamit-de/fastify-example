import { JsonLogger } from '@dreamit/graphql-server'
import fastify from 'fastify'
import { 
    userSchema, 
    userSchemaResolvers 
} from './ExampleSchemas'
import { FastifyGraphQLServer } from './FastifyGraphQLServer'

const server = fastify()
const graphqlServer = new FastifyGraphQLServer(
    {
        schema: userSchema,
        rootValue: userSchemaResolvers,
        logger: new JsonLogger('fastifyServer', 'user-service')
    }
)

server.all('/graphql', async(request, reply) => {
    return graphqlServer.handleFastifyRequest(request, reply)
})
  
server.listen(7070, (error, address) => {
    if (error) {
        console.error(error)
        throw error
    }
    console.log(`Server listening at ${address}`)
})