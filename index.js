const {ApolloServer} = require('apollo-server');

const {prisma} = require('./prisma/generated/prisma-client');

const typeDefs = require('./typeDefs');

const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {prisma} 
  });

server.listen({port: process.env.PORT || 5000}).then(({url}) =>{
    console.log(`Server is running at ${url}`);
})