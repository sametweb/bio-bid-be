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
    name: "Service",
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
  endpoint: `https://us1.prisma.sh/biobid-team/production/prod`
});
exports.prisma = new exports.Prisma();
