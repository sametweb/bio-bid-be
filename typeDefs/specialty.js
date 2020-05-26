const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    specialties: [Specialty!]
    specialty(name: String!): Specialty!
    searchSpecialty(search: String!): [Specialty]!
  }

  extend type Mutation {
    createSpecialty(name: String!): Specialty!
    updateSpecialty(name: String!, updated_name: String!): Specialty!
    deleteSpecialty(name: String!): Specialty!
  }

  type Specialty {
    name: String!
    companies: [Company]!
  }
`;
