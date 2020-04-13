process.env.NODE_ENV === 'development' && require('dotenv').config(); //only use dotenv in development environment

const {ApolloServer} = require('apollo-server');

const {prisma} = require('./prisma/generated/prisma-client');

const typeDefs = require('./typeDefs');

const resolvers = require('./resolvers');

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: {prisma} 
  });


// Start our server if we're not in a test env.
// if we're in a test env, we'll manually start it in a test
if (process.env.NODE_ENV !== 'testing') {
  server.listen({port: process.env.PORT || 5000}).then(({url}) =>{
      console.log(`Server is running at ${url}`);
  })
}

// export all the important pieces for integration/e2e tests to use
module.exports = {
  ApolloServer,
  typeDefs,
  resolvers,
  server
}