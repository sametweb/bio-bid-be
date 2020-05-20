const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    regionsCovered: [Region!]
    regionCovered(name: String!): Region!
    searchRegion(search: String!): [Region]!
  }

  extend type Mutation {
    createRegion(name: String!): Region!
    updateRegion(name: String!, updated_name: String!): Region!
    deleteRegion(name: String!): Region!
  }

  type Region {
    name: String!
    companies: [Company]!
  }
`;