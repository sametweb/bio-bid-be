const claimResolver = require("../resolvers/claimResolver");

const prisma = {
  claims: jest.fn(),
  company: jest.fn(),
  createClaim: jest.fn(),
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
});
