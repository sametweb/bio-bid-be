const OktaJwtVerifier = require("@okta/jwt-verifier");

module.exports = {
  validate: async function(token, aud) {
    const oktaJwtVerifier = new OktaJwtVerifier({
      issuer: "https://dev-648803.okta.com/oauth2/default",
    });

    try {
      const jwt = await oktaJwtVerifier.verifyAccessToken(token, aud);
      return jwt.claims;
    } catch {
      return { error: "unauthorized" };
    }
  },
};
