const axios = require("axios");

module.exports = {
  oktaApi: function() {
    return axios.create({
      baseURL: "https://dev-648803.okta.com/api/v1",
      headers: {
        Authorization: `SSWS ${process.env.OKTA_KEY}`,
      },
    });
  },
};
