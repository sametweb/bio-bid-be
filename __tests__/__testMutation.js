const gql = require('graphql-tag');

const ADD_TEST_STUDY = gql`
  mutation CreateStudy(
    $name: String!,
    $area: String!,
    $phase: Int!,
    $status: String!,
    $companyName: String!
  ){
    createStudy(
      data: {
        name: $name,
        area: $area,
        phase: $phase,
        status: $status,
        company: {
          create: {
            name: $companyName
          }
        }
      }) {
      id
      name
    }
  }
`

const DELETE_TEST_STUDY = gql`
  mutation DeleteStudy(
    $id: String!
  ){
    deleteStudy(where: {
      id: $id
    }) {
      id
    }
  }
`

module.exports = {
  ADD_TEST_STUDY,
  DELETE_TEST_STUDY
}