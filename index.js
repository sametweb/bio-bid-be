const {ApolloServer, gql} = require('apollo-server');

const {prisma} = require('./prisma/generated/prisma-client');

const typeDefs = gql`
   type Query {
        hello: String!,
        studies: [Study!]!
    },
    type studies {
        id: ID!
        name: String!
        area: Int!
        status: String!
        company: Company!
    },
    type Company {
        id: ID!
        name: String!
        studies: [Study!]
        bids: [Bid!]
    },
    type Study {
        id: ID!
        name: String!
        area: String!
        phase: Int!
        status: String!
        company: Company!
    },
    type Bid {
        id: ID!
        company: Company!
        bid_amount: Float!
        is_approved: Boolean!
        study: Study!
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello World",
        studies: async (parent, args, {prisma}) => {
            const studies = await prisma.studies({});
            return studies;
        }
    }
}

const server = new ApolloServer({typeDefs, resolvers, context: {prisma}});

server.listen({port: process.env.PORT || 5000}).then(({url}) =>{
    console.log(`Server is running at ${url}`);
})