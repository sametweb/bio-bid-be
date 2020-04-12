const {gql} = require('apollo-server');

module.exports = gql`
    extend type Query {
        bids: [Bid!]
    }

    extend type Mutation {
        createBid(bid_amount: Float!, company_name: String!, study_name: String!): Bid!,
        updateBid(bid_amount: Float, is_approved: Boolean, id: ID!): Bid!,
        deleteBid(id: ID!): Bid!
    }

    type Bid {
        id: ID! 
        company: Company! 
        bid_amount: Float!
        is_approved: Boolean! 
        study: Study!
    }
`;