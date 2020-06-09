const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    specialtyItems: [SpecialtyItem!]
    specialtyItem(name: String!): SpecialtyItem!
  }

  extend type Mutation {
    createSpecialtyItem(name: String!): SpecialtyItem!
    updateSpecialtyItem(name: String!, updated_name: String!): SpecialtyItem!
    deleteSpecialtyItem(name: String!): SpecialtyItem!
  }

  type SpecialtyItem {
    id: ID!
    name: String!
  }
`;
