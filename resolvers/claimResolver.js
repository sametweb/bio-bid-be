const axios = require("axios");

module.exports = {
  Query: {
    pendingClaims: (parent, args, { prisma }, info) => {
      return prisma.claims({ where: { pending: true } });
    },
  },
  Mutation: {
    claimCompany: async (parent, args, { prisma }, info) => {
      const { user, email, name, company } = args;

      const maintainerExists = await prisma
        .company({ id: company })
        .maintainer();

      if (maintainerExists) {
        throw new Error(
          "This company is managed by another user. Please reach out to the administrator"
        );
      }

      if (!user || !email || !name || !company) {
        throw new Error(
          "Please provide all the fields: user, email, name, company"
        );
      }

      return prisma.createClaim({
        user,
        email,
        name,
        company: { connect: { id: company } },
      });
    },
    approveClaim: async (parent, { id }, { prisma }, info) => {
      // Find the claim and company related
      const claim = await prisma.claim({ id });
      const company = await prisma.claim({ id }).company();

      // Get claim.user (sub) and claim.company.id
      const { user } = claim;
      const company_id = company.id;
      console.log({ user, company_id });

      // Save claim.company.id in user's profile
      try {
        const updatedUser = await axios.post(
          `https://dev-648803.okta.com/api/v1/users/${user}`,
          {
            profile: { profileUrl: company_id },
          },
          {
            headers: {
              Authorization: `SSWS ${process.env.OKTA_KEY}`,
            },
          }
        );
      } catch (error) {
        throw new Error(
          "There was an error updating user's profile on Okta. Please make sure you provided a valid user id (sub field from Okta profile)"
        );
      }

      // Change claim.approved: true, pending: false
      await prisma.updateClaim({
        where: { id },
        data: { approved: true, pending: false },
      });

      // Save claim.user to company.maintainer
      await prisma.updateCompany({
        where: { id: company_id },
        data: { maintainer: user },
      });

      return await prisma.claim({ id });
    },
    denyClaim: (parent, { id }, { prisma }, info) => {
      return prisma.updateClaim({ where: { id }, data: { pending: false } });
    },
  },
  Claim: {
    company: ({ id }, args, { prisma }, info) => {
      return prisma.claim({ id }).company();
    },
  },
};
