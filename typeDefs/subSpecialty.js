const { gql } = require("apollo-server");

module.exports = gql`
  type SubSpecialty {
    id: ID
    name: String!
  }
`;
