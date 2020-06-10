const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    specialties: [Specialty!]
    specialty(id: ID!): Specialty!
  }

  type Specialty {
    id: ID
    name: String
    sub_specialties: [Specialty]
  }
`;
