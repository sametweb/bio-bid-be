const {ApolloServer, gql} = require('apollo-server');

const typeDefs = gql`
   type Query {
        hello: String!
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello World"
    }
}

const server = new ApolloServer({typeDefs, resolvers});

server.listen({port: process.env.PORT || 5000}).then(({url}) =>{
    console.log(`Server is running at ${url}`);
})