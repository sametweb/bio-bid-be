const { ApolloServer } = require("apollo-server");
const { prisma } = require("./prisma/generated/prisma-client");
const typeDefs = require("./typeDefs");
const resolvers = require("./resolvers");
const { oktaApi } = require("./helpers/oktaApi");
const { validate } = require("./helpers/validate");

require("dotenv").config();

const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: async ({ req }) => {
    const token = req.headers.authorization;
    const aud = process.env.OKTA_LINKEDIN_CLIENT_ID || "0oadk3f256MfKqlA74x6";
    const user = await validate(token, aud);
    return { prisma, oktaApi, user };
  },
});

server.listen({ port: process.env.PORT || 5000 }).then(({ url }) => {
  console.log(`Server is running at ${url}`);
});
