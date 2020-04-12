const {gql} = require('apollo-server');

module.exports = gql`
    extend type Query {
        studies: [Study!]!
    }

    extend type Mutation {
        createStudy(name: String!, area: String!, phase: Int!, status: String!, company_name: String!): Study!,
        updateStudy(updatedStudy_name: String, area: String, phase: Int, status: String, study_name: String): Study!,
        deleteStudy(study_name: String!): Study!
    }

    type Study {
        id: ID! 
        name: String! 
        area: String!
        phase: Int!
        status: String!
        company: Company!
    }
`;