const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    serviceItems: [ServiceItem!]
    serviceItem(name: String!): ServiceItem!
  }

  extend type Mutation {
    createServiceItem(name: String!): ServiceItem!
    updateServiceItem(name: String!, updated_name: String!): ServiceItem!
    deleteServiceItem(name: String!): ServiceItem!
  }

  type ServiceItem {
    id: ID!
    name: String!
  }
`;
