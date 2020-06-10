const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    therapeutics: [Therapeutic!]
    therapeutic(name: String!): Therapeutic!
    searchTherapeutics(search: String!): [Therapeutic]!
  }

  extend type Mutation {
    createTherapeutic(name: String!): Therapeutic!
    updateTherapeutic(name: String!, updated_name: String!): Therapeutic!
    deleteTherapeutic(name: String!): Therapeutic!
  }

  type Therapeutic {
    id: ID
    name: String!
    companies: [Company]!
  }
`;
