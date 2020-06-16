const claimResolver = require("../resolvers/claimResolver");
const helpers = require("../helpers/oktaApi");

const prisma = {
  claim: jest.fn(),
  claims: jest.fn(),
  company: jest.fn(),
  createClaim: jest.fn(),
  updateClaim: jest.fn(),
  updateCompany: jest.fn(),
};

describe("Query", () => {
  describe("pendingClaims()", () => {
    const pendingClaims = jest.spyOn(claimResolver.Query, "pendingClaims");

    it("calls prisma.claims with where: { pending: true }", () => {
      const params = [{}, {}, { prisma }, {}];
      pendingClaims(...params);

      expect(prisma.claims).toHaveBeenCalledWith(
        expect.objectContaining({ where: { pending: true } })
      );
    });
  });
});

describe("Mutation", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("claimCompany()", () => {
    const claimCompany = jest.spyOn(claimResolver.Mutation, "claimCompany");

    it("throws error if company is managed by another user", async () => {
      const args = { user: "u", email: "e", name: "n", company: "c" };
      const params = [{}, args, { prisma }, {}];
      prisma.company.mockImplementation(() => ({
        maintainer: jest.fn(() => true),
      }));
      const request = async () => await claimCompany(...params);

      await expect(() => request()).rejects.toThrow(
        "This company is managed by another user. Please reach out to the administrator"
      );

      expect(prisma.company).toHaveBeenCalledWith(
        expect.objectContaining({ id: "c" })
      );
      expect(prisma.createClaim).not.toHaveBeenCalled();
    });

    it("throws error if user, email, name, or company missing in args", async () => {
      const userMissing = { email: "e", name: "n", company: "c" };
      const emailMissing = { user: "u", name: "n", company: "c" };
      const nameMissing = { user: "u", email: "e", company: "c" };
      const companyMissing = { user: "u", email: "e", name: "n" };

      prisma.company.mockImplementation(() => ({
        maintainer: jest.fn(() => false),
      }));

      const request = async (missing) =>
        await claimCompany(...[{}, { ...missing }, { prisma }, {}]);

      await expect(() => request(userMissing)).rejects.toThrow(
        "Please provide all the fields: user, email, name, company"
      );
      await expect(() => request(emailMissing)).rejects.toThrow(
        "Please provide all the fields: user, email, name, company"
      );
      await expect(() => request(nameMissing)).rejects.toThrow(
        "Please provide all the fields: user, email, name, company"
      );
      await expect(() => request(companyMissing)).rejects.toThrow(
        "Please provide all the fields: user, email, name, company"
      );
      expect(prisma.createClaim).not.toHaveBeenCalled();
    });

    it("calls prisma.createClaim with user,email,name,company", async () => {
      const args = { user: "u", email: "e", name: "n", company: "cid" };
      const params = [{}, args, { prisma }, {}];

      prisma.company.mockImplementation(() => ({
        maintainer: jest.fn(() => false),
      }));

      await claimCompany(...params);

      expect(prisma.company).toHaveBeenCalledWith(
        expect.objectContaining({ id: "cid" })
      );
      expect(prisma.createClaim).toHaveBeenCalledWith(
        expect.objectContaining({
          ...args,
          company: { connect: { id: "cid" } },
        })
      );
    });
  });

  describe("approveClaim()", () => {
    const approveClaim = jest.spyOn(claimResolver.Mutation, "approveClaim");
    let { oktaApi } = helpers;
    oktaApi = jest
      .fn()
      .mockImplementationOnce(() => ({ post: jest.fn(() => Promise.reject()) }))
      .mockImplementationOnce(() => ({
        post: jest.fn(() => Promise.resolve()),
      }));

    const params = [{}, { id: 1 }, { prisma, oktaApi }, {}];
    prisma.claim.mockImplementation(() => ({
      user: "user",
      company: jest.fn(() => ({ id: 1 })),
    }));
    const request = async () => await approveClaim(...params);

    it("fetches claim details and company id, throws when oktaApi rejects", async () => {
      await expect(() => request()).rejects.toThrow(
        `There was an error updating user's profile on Okta. Please make sure you provided a valid user id (sub field from Okta profile)`
      );
      expect(prisma.claim).toHaveBeenCalledTimes(2);
      expect(oktaApi).toHaveBeenCalledTimes(1);
    });

    it("calls prisma.updateClaim() and prisma.updateCompany()", async () => {
      await request();

      expect(prisma.updateClaim).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { approved: true, pending: false },
        })
      );

      expect(prisma.updateCompany).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { maintainer: "user" },
        })
      );

      expect(prisma.claim).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
    });
  });

  describe("denyClaim()", () => {
    const denyClaim = jest.spyOn(claimResolver.Mutation, "denyClaim");
    const params = [{}, { id: 1 }, { prisma }, {}];

    it("calls prisma.updateClaim()", () => {
      denyClaim(...params);

      expect(prisma.updateClaim).toHaveBeenCalledWith(
        expect.objectContaining({
          where: { id: 1 },
          data: { pending: false },
        })
      );
    });
  });
});

describe("Claim", () => {
  describe("company()", () => {
    const company = jest.spyOn(claimResolver.Claim, "company");
    const params = [{ id: 1 }, {}, { prisma }, {}];

    it("calls prisma.claim() with id and returns .company()", () => {
      prisma.claim.mockImplementation(() => ({
        company: jest.fn(() => ({ name: "Company name" })),
      }));

      company(...params);

      expect(prisma.claim).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(company(...params)).toStrictEqual({ name: "Company name" });
    });
  });
});
