const {gql} = require('apollo-server');
const schema = gql`
    type Query {
        studies: [Study!]!,
        companies: [Company!]!,
        bids: [Bid!]!
    }

    type Bid {
        id: ID! 
        company: Company! 
        bid_amount: Float!
        is_approved: Boolean! 
        study: Study!
    }

    type Study {
        id: ID! 
        name: String! 
        area: String!
        phase: Int!
        status: String!
        company: Company
    }

    type Company {
        id: ID 
        name: String!
        studies: [Study!]
        bids: [Bid!]
    }

`;

module.exports = schema;