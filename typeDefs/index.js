const { gql } = require("apollo-server");

const bidTypeDef = require("./bid");
const studyTypeDef = require("./study");
const companyTypeDef = require("./company");
const serviceTypeDef = require("./service");
const serviceItemTypeDef = require("./serviceItem");
const regionTypeDef = require("./region");
const therapeuticTypeDef = require("./therapeutic");
const specialtyTypeDef = require("./specialty");
const specialtyItemTypeDef = require("./specialtyItem");

const typeDefs = gql`
  type Query {
    _: String
  }
  type Mutation {
    _: String
  }
`;

module.exports = [
  typeDefs,
  bidTypeDef,
  studyTypeDef,
  companyTypeDef,
  serviceTypeDef,
  serviceItemTypeDef,
  regionTypeDef,
  therapeuticTypeDef,
  specialtyTypeDef,
  specialtyItemTypeDef,
];
