const {gql} = require('apollo-server');

module.exports = gql`
    extend type Query {
        companies: [Company!]!
    }

    extend type Mutation {
        createCompany(company_name: String!): Company!,
        updateCompany(updated_name: String!, company_name: String!): Company!,
        deleteCompany(company_name: String!): Company!
    }

    type Company {
        id: ID 
        name: String!
        studies: [Study!]
        bids: [Bid!]
    }
`;