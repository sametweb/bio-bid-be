const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    regions: [Region!]
    region(name: String!): Region!
    searchRegions(search: String!): [Region]!
  }

  extend type Mutation {
    createRegion(name: String!): Region!
    updateRegion(name: String!, updated_name: String!): Region!
    deleteRegion(name: String!): Region!
  }

  type Region {
    id: ID
    name: String!
    companies: [Company]!
  }
`;
