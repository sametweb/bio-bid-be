const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    therapeutics: [TherapeuticArea!]
    therapeutic(name: String!): TherapeuticArea!
    searchTherapeutic(search: String!): [TherapeuticArea]!
  }

  extend type Mutation {
    createTherapeutic(name: String!): TherapeuticArea!
    updateTherapeutic(name: String!, updated_name: String!): TherapeuticArea!
    deleteTherapeutic(name: String!): TherapeuticArea!
  }

  type TherapeuticArea {
    name: String!
    companies: [Company]!
  }
`;
