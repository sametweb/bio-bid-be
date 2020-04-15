// test utilties
const {constructTestServer} = require('./__testutils');
const {createTestClient} = require('apollo-server-testing');








// tests
describe('Queries', () => {

  it('fetches studies', async () => {
    const server = constructTestServer();
    const res = await createTestClient(server).query({query: GET_TEST_STUDIES});
    const events = res.data.studies;
    expect(events).not.toHaveLength(0);
  });

});