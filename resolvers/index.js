const bidResolver = require("./bidResolver");
const companyResolver = require("./companyResolver");
const studyResolver = require("./studyResolver");
const serviceResolver = require("./serviceResolver");
const serviceItemResolver = require("./serviceItemResolver");
const regionResolver = require("./regionResolver");
const therapeuticResolver = require("./therapeuticResolver");
const specialtyResolver = require("./specialtyResolver");
const specialtyItemResolver = require("./specialtyItemResolver");
const claimResolver = require("./claimResolver");

module.exports = [
  bidResolver,
  companyResolver,
  studyResolver,
  serviceResolver,
  serviceItemResolver,
  regionResolver,
  therapeuticResolver,
  specialtyResolver,
  specialtyItemResolver,
  claimResolver,
];
