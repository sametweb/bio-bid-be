// test utilties
const {constructTestServer, prismaConnection } = require('./__testutils');
const {createTestClient} = require('apollo-server-testing');
const faker = require('faker');

// graphQL
const { ADD_TEST_STUDY, DELETE_TEST_STUDY } = require('./__testMutation');
const { GET_TEST_STUDIES } = require('./__testQuery');

// setup & teardown variables
let testId;
let studyName = `${faker.random.words()}`
let companyName = `${faker.company.companyName()} ${faker.company.companySuffix()}`;
let testStudy = {
  name: studyName,
  area: "Respiratory",
  phase: 1,
  status: "Ongoing",
  companyName: companyName,
}

// setup, mutates test prisma directly, adds study
beforeAll(async () => {
  const server = constructTestServer();
  const addStudyRes = await createTestClient(server).mutate({
    mutation: ADD_TEST_STUDY,
    variables: testStudy
  });
  console.log('testId in beforeAll:', addStudyRes.data.addStudy.id);
  testId = addStudyRes.data.addStudy.id;
});

// teardown, mutates test prisma directly, removes study
afterAll(async () => {
  const deleteStudy = await prismaConnection().deleteStudy({id: testId});
  const server = constructTestServer();
  const deleteEvent = await createTestClient(server).mutate({
    mutation: DELETE_TEST_STUDY,
    variable: {id: testId}
  });
});

// tests
describe('Queries', () => {

  it('fetches studies', async () => {
    const server = constructTestServer();
    const res = await createTestClient(server).query({query: GET_TEST_STUDIES});
    const events = res.data.studies;
    expect(events).not.toHaveLength(0);
  });

});