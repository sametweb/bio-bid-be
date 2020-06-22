const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    statistics: Stats!
  }

  type Stats {
    companyCount: Int!
    pendingClaimCount: Int!
    serviceCount: Int!
    specialtyCount: Int!
  }
`;
