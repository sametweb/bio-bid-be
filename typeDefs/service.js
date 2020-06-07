const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    services: [Service!]
    service(name: String!): Service!
    searchService(search: String!): [Service]!
  }

  extend type Mutation {
    createService(name: String!): Service!
    updateService(name: String!, updated_name: String!): Service!
    deleteService(name: String!): Service!
  }

  type Service {
    id: ID
    name: String!
    companies: [Company]!
    specialties: [Specialty]
  }
`;
