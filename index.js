const {ApolloServer, gql} = require('apollo-server');

const {Prisma} = require('./prisma/generated/prisma-client');

const typeDefs = gql`
   type Query {
        hello: String!,
        getAllStudies: [Study!]!
    },

    type Company {
        id: ID! 
        name: String!
        studies: [Study!]
        bids: [Bid!]
    },

    type Bid {
        id: ID! 
        company: Company! 
        bid_amount: Float!
        is_approved: Boolean! 
        study: Study!
    },

    type Study {
        id: ID! 
        name: String! 
        area: String!
        phase: Int!
        status: String!
        company: Company! 
    }
`;

const resolvers = {
    Query: {
        hello: () => "Hello World",
       getAllStudies: async (parent, args, {prisma}, info) => {
        const studies = await prisma.studies();
        return studies;
       }
    }
}

const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({req}) => ({
      prisma: new Prisma({
        endpoint: 'https://biobid-4efc34e917.herokuapp.com',
      }),
    }),
  });

server.listen({port: process.env.PORT || 5000}).then(({url}) =>{
    console.log(`Server is running at ${url}`);
})