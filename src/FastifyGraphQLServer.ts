import {
    GraphQLServer, 
    GraphQLServerOptions, 
    GraphQLServerRequest, 
    GraphQLServerResponse 
} from '@dreamit/graphql-server'
import {
    FastifyReply, 
    FastifyRequest 
} from 'fastify'
import { IncomingHttpHeaders } from 'node:http'
import { Stream } from 'node:stream'


export class FastifyGraphQLServerRequest implements GraphQLServerRequest {
    private fastifyRequest: FastifyRequest

    constructor(fastifyRequest: FastifyRequest) {
        this.fastifyRequest = fastifyRequest
        this.headers = fastifyRequest.headers
        this.addListener = fastifyRequest.raw.addListener
        this.on = fastifyRequest.raw.on
        this.once = fastifyRequest.raw.once
        this.removeListener = fastifyRequest.raw.removeListener
        this.removeAllListeners = fastifyRequest.raw.removeAllListeners
        this.off = fastifyRequest.raw.off
        this.setMaxListeners = fastifyRequest.raw.setMaxListeners
        this.getMaxListeners = fastifyRequest.raw.getMaxListeners
        this.listeners = fastifyRequest.raw.listeners
        this.rawListeners = fastifyRequest.raw.rawListeners
        this.emit = fastifyRequest.raw.emit
        this.listenerCount = fastifyRequest.raw.listenerCount
        this.prependListener = fastifyRequest.raw.prependListener
        this.prependOnceListener = fastifyRequest.raw.prependOnceListener
        this.eventNames = fastifyRequest.raw.eventNames
        this.url = fastifyRequest.url
        this.body = fastifyRequest.body
        this.method = fastifyRequest.method
    }
    pipe<T extends NodeJS.WritableStream>(destination: T, 
        options?: { end?: boolean | undefined; }): T {
        return this.fastifyRequest.raw.pipe(destination, options)
    }
    headers: IncomingHttpHeaders
    addListener: (eventName: string | symbol, 
      listener: (...arguments_: unknown[]) => void) => Stream
    on: (eventName: string | symbol, listener: (...arguments_: unknown[]) => void) => Stream
    once: (eventName: string | symbol, listener: (...arguments_: unknown[]) => void) => Stream
    removeListener: (eventName: string | symbol, 
      listener: (...arguments_: unknown[]) => void) => Stream
    removeAllListeners: (event?: string | symbol | undefined) => Stream
    off: (eventName: string | symbol, listener: (...arguments_: unknown[]) => void) => Stream
    setMaxListeners: (n: number) => Stream
    getMaxListeners: () => number
    // eslint-disable-next-line @typescript-eslint/ban-types
    listeners: (eventName: string | symbol) => Function[]
    // eslint-disable-next-line @typescript-eslint/ban-types
    rawListeners: (eventName: string | symbol) => Function[]
    emit: (eventName: string | symbol, ...arguments_: unknown[]) => boolean
    listenerCount: (eventName: string | symbol) => number
    prependListener: (eventName: string | symbol, 
      listener: (...arguments_: unknown[]) => void) => Stream
    prependOnceListener: (eventName: string | symbol, 
      listener: (...arguments_: unknown[]) => void) => Stream
    eventNames: () => (string | symbol)[]
    url: string
    body?: unknown
    method?: string | undefined
 
}

export class FastifyGraphQLServerResponse implements GraphQLServerResponse {
    private fasitfyReply: FastifyReply

    constructor(fastifyReply: FastifyReply) {
        this.statusCode = fastifyReply.statusCode
        this.fasitfyReply = fastifyReply
    }

    statusCode: number
    setHeader(name: string, value: string | number | readonly string[]): this {
        this.fasitfyReply.header(name, value)
        return this
    }
    end(chunk: unknown): this {
        this.fasitfyReply.send(chunk)
        return this
    }

}

export class FastifyGraphQLServer extends GraphQLServer {
    constructor(options: GraphQLServerOptions) {
        super(options)
    }
  
    handleFastifyRequest(request: FastifyRequest, reply: FastifyReply): Promise<void> {
        return super.handleRequest(this.fastifyToGraphQLServerRequest(request), 
            this.fastifyReplyToGraphQLServerResponse(reply))
    }

    fastifyToGraphQLServerRequest(fastifyRequest: FastifyRequest): GraphQLServerRequest {
        return new FastifyGraphQLServerRequest(fastifyRequest)
    }

    fastifyReplyToGraphQLServerResponse(fastifyReply: FastifyReply): GraphQLServerResponse {
        return new FastifyGraphQLServerResponse(fastifyReply)  
    }

}