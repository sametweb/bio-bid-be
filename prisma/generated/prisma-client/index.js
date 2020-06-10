"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var prisma_lib_1 = require("prisma-client-lib");
var typeDefs = require("./prisma-schema").typeDefs;

var models = [
  {
    name: "Company",
    embedded: false
  },
  {
    name: "Claim",
    embedded: false
  },
  {
    name: "ServiceItem",
    embedded: false
  },
  {
    name: "Service",
    embedded: false
  },
  {
    name: "SpecialtyItem",
    embedded: false
  },
  {
    name: "Specialty",
    embedded: false
  },
  {
    name: "Region",
    embedded: false
  },
  {
    name: "Therapeutic",
    embedded: false
  },
  {
    name: "CompanySize",
    embedded: false
  },
  {
    name: "Phase",
    embedded: false
  },
  {
    name: "Bid",
    embedded: false
  },
  {
    name: "Study",
    embedded: false
  }
];
exports.Prisma = prisma_lib_1.makePrismaClientClass({
  typeDefs,
  models,
  endpoint: `http://localhost:4466`
});
exports.prisma = new exports.Prisma();
