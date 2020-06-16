const axios = require("axios");
const helpers = require("../helpers/oktaApi");

const oktaApi = jest.spyOn(helpers, "oktaApi");
const create = jest.spyOn(axios, "create");

process.env.OKTA_KEY = "OKTA_TEST_KEY";
const { OKTA_KEY } = process.env;

describe("oktaApi helper method", () => {
  it("calles axios.create", () => {
    oktaApi();
    expect(create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: "https://dev-648803.okta.com/api/v1",
        headers: {
          Authorization: `SSWS ${OKTA_KEY}`,
        },
      })
    );
  });
});
