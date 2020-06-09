const companyResolver = require("../resolvers/companyResolver");

const dummyCompany = {
  data: { company: { name: "Company", companySize: "A" } },
};

const dummyCompanies = {
  data: { companies: [{ name: "Company", companySize: "A" }] },
};

// We don't need to test actual Prisma, hence this.
const prisma = {
  $exists: { company: jest.fn(() => true) },
  companies: jest.fn(() => dummyCompanies),
  company: jest.fn(() => dummyCompany),
  createCompany: jest.fn(),
};

const helpers = require("../helpers");
describe("Company queries and mutations", () => {
  describe("company() -> single company query", () => {
    const company = jest.spyOn(companyResolver.Query, "company");

    it("throws error when args.id is falsy (not provided)", async () => {
      const params = [{}, { id: 0 }, { prisma }, {}]; // falsy id: 0
      const request = async () => await company(...params);

      await expect(() => request()).rejects.toThrow("id is required");
      expect(prisma.$exists.company).not.toHaveBeenCalled();
      expect(prisma.company).not.toHaveBeenCalled();
    });

    it("returns company object when args.id is truthy (provided)", async () => {
      const params = [{}, { id: 1 }, { prisma }, {}];
      const request = async () => await company(...params);
      const companyData = await request();

      await expect(companyData).toEqual(expect.objectContaining(dummyCompany));
      expect(prisma.$exists.company).toHaveBeenCalledTimes(1);
      expect(prisma.company).toHaveBeenCalledTimes(1);
    });

    it("throws error when company not found", async () => {
      jest.spyOn(prisma.$exists, "company").mockImplementation(() => false);

      const params = [{}, { id: 1 }, { prisma }, {}];
      const request = async () => await company(...params);

      await expect(() => request()).rejects.toThrow(
        "Company with that id does not exist..."
      );
    });
  });

  describe("companies() query", () => {
    const companies = jest.spyOn(companyResolver.Query, "companies");

    it("returns an array of companies", async () => {
      const params = [{}, {}, { prisma }, {}];
      const companiesData = await companies(...params);

      await expect(companiesData).toHaveProperty("data");
    });
  });

  describe("createCompany() mutation", () => {
    const createCompany = jest.spyOn(companyResolver.Mutation, "createCompany");

    it("calls prisma.createCompany() with params", async () => {
      const params = [{}, { name: "" }, { prisma }, {}];
      await createCompany(...params);

      expect(prisma.createCompany).toHaveBeenCalledTimes(1);
      expect(prisma.createCompany).toHaveBeenCalledWith(
        expect.objectContaining({ name: "" })
      );
    });
  });
});
