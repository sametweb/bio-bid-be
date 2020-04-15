const gql = require('graphql-tag');

const GET_TEST_STUDIES = gql`
  query {
  studies {
    id
    name
    area
    phase
    status
    company
  }
}
`


module.exports = {
  GET_TEST_STUDIES
}