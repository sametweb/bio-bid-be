const { gql } = require("apollo-server");

const bidTypeDef = require("./bid");
const studyTypeDef = require("./study");
const companyTypeDef = require("./company");
const serviceTypeDef = require("./service");
const regionTypeDef = require("./region");
const therapeuticTypeDef = require("./therapeutic");
const specialtyTypeDef = require("./specialty");
const subSpecialtyTypeDef = require("./subSpecialty");

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
  regionTypeDef,
  therapeuticTypeDef,
  specialtyTypeDef,
  subSpecialtyTypeDef,
];
