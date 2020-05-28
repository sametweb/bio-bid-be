const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    companies: [Company!]!
    company(id: ID): Company!
  }

  extend type Mutation {
    createCompany(
      name: String!
      logoURL: String
      website: String
      linkedin: String
      overview: String
      headquarters: String
      companySize: CompanySize
      services: [ServiceInput]
      specialties: [SpecialtyInput]
      regions: [RegionInput]
      therapeutics: [TherapeuticInput]
    ): Company!

    updateCompany(
      id: ID! # FILTER
      updated_name: String
      updated_logoURL: String
      updated_website: String
      updated_linkedin: String
      updated_overview: String
      updated_headquarters: String
      updated_companySize: CompanySize
      updated_services: [ServiceInput]
      updated_specialties: [SpecialtyInput]
      updated_regions: [RegionInput]
      updated_therapeutics: [TherapeuticInput]
    ): Company!

    deleteCompany(id: ID!): Company!
  }

  type Company {
    id: ID
    name: String!
    logoURL: String
    website: String
    linkedin: String
    overview: String
    headquarters: String
    companySize: CompanySize
    services: [Service!]
    specialties: [Specialty!]
    regions: [Region!]
    therapeutics: [Therapeutic!]
    studies: [Study!]
    bids: [Bid!]
  }

  input ServiceInput {
    name: String!
  }

  input SpecialtyInput {
    name: String!
  }

  input RegionInput {
    name: String!
  }

  input TherapeuticInput {
    name: String!
  }

  enum CompanySize {
    A # Self-employed
    B # 1-10 employees
    C # 11-50 employees
    D # 51-200 employees
    E # 201-500 employees
    F # 501-1000 employees
    G # 1001-5000 employees
    H # 5001-10,000 employees
    I # 10,001+ employees
  }
`;
