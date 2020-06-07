const { gql } = require("apollo-server");

module.exports = gql`
  extend type Query {
    companies: [Company!]!
    company(id: ID): Company!
  }

  extend type Mutation {
    createCompany(
      name: String!
      email: String
      phases: [Phase]
      logoURL: String
      website: String
      linkedin: String
      overview: String
      headquarters: String
      companySize: CompanySize
      services: [ServiceInput]
      regions: [RegionInput]
      therapeutics: [TherapeuticInput]
    ): Company!

    updateCompany(
      id: ID! # FILTER
      updated_name: String
      updated_email: String
      updated_phases: [Phase]
      updated_logoURL: String
      updated_website: String
      updated_linkedin: String
      updated_overview: String
      updated_headquarters: String
      updated_companySize: CompanySize
      updated_services: [ServiceInput]
      updated_regions: [RegionInput]
      updated_therapeutics: [TherapeuticInput]
    ): Company!

    deleteCompany(id: ID!): Company!
  }

  type Company {
    id: ID
    name: String!
    email: String
    phases: [Phase]
    logoURL: String
    website: String
    linkedin: String
    overview: String
    headquarters: String
    companySize: CompanySize
    services: [Service!]
    regions: [Region!]
    therapeutics: [Therapeutic!]
    studies: [Study!]
    bids: [Bid!]
    Service: [Service]
  }

  input ServiceInput {
    name: String!
    company: [CompanyInput]
    specialties: [SpecialtyInput]
  }

  input SpecialtyInput {
    name: String!
    company: [CompanyInput]
    specialties: [SpecialtyInput]
  }

  input CompanyInput {
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

  enum Phase {
    I
    II
    III
    IV
  }
`;
