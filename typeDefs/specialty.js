const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    specialties: [Specialty!]
    specialty(id: ID!): Specialty!
  }

  extend type Mutation {
    createSpecialty(id: ID!): Specialty!
    updateSpecialty(id: ID!, updated_name: String!): Specialty!
    deleteSpecialty(id: ID!): Specialty!
  }

  type Specialty {
    id: ID
    name: String!
    sub_specialties: [SubSpecialty]
  }
`;
