const companyResolver = require("../resolvers/companyResolver");

const dummyCompany = {
  data: { company: { id: 1, name: "Company", companySize: "A", services: [] } },
  services: jest.fn(),
};

const dummyCompanies = {
  data: { companies: [{ name: "Company", companySize: "A", services: [] }] },
};

// We don't need to test actual Prisma, hence this.
const prisma = {
  $exists: { company: jest.fn(() => true) },
  companies: jest.fn(() => dummyCompanies),
  company: jest.fn(() => dummyCompany),
  createCompany: jest.fn(),
  updateCompany: jest.fn(),
  deleteCompany: jest.fn(),
  deleteManyServices: jest.fn(),
  upsertSpecialtyItem: jest.fn(),
};

describe("Company queries and mutations", () => {
  afterEach(() => {
    jest.clearAllMocks();
  });
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

      expect(companiesData).toHaveProperty("data");
      expect(prisma.companies).toHaveBeenCalled();
    });
  });

  describe("searchCompanies() query", () => {
    const searchCompanies = jest.spyOn(
      companyResolver.Query,
      "searchCompanies"
    );

    it("throws error if search.length is less than 3", async () => {
      const params = [{}, { search: "as" }, { prisma }, {}];
      const searchRequest = async () => await searchCompanies(...params);

      await expect(() => searchRequest()).rejects.toThrow(
        "Please enter a search term at least 3 characters"
      );
      expect(prisma.companies).not.toHaveBeenCalled();
    });

    it("calls prisma.companies with search term", () => {
      const params = [{}, { search: "asd" }, { prisma }, {}];
      searchCompanies(...params);

      expect(prisma.companies).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name_contains: "asd" } })
      );
    });
  });

  describe("createCompany() mutation", () => {
    const createCompany = jest.spyOn(companyResolver.Mutation, "createCompany");

    it("throws if name is empty", async () => {
      const params = [{}, { name: "" }, { prisma }, {}];

      await expect(createCompany(...params)).rejects.toThrow(
        "You must provide a name to create a company"
      );
    });

    // TESTING ERRORS
    it("throws if there is a company with same name", async () => {
      jest.spyOn(prisma.$exists, "company").mockImplementation(() => true);
      const params = [{}, { name: "Company name" }, { prisma }, {}];

      await expect(createCompany(...params)).rejects.toThrow(
        `There is a company named 'Company name' already, please enter a different name.`
      );
    });

    it("calls upsertSpecialtyItem on each specialty", async () => {
      jest.spyOn(prisma.$exists, "company").mockImplementation(() => false);
      const params = [
        {},
        {
          name: "Company name",
          services: [
            {
              specialties: [
                { name: "ASD", sub_specialties: [{ name: "ASD" }] },
                { name: "ASD" },
              ],
            },
          ],
        },
        { prisma },
        {},
      ];
      await createCompany(...params);

      expect(prisma.upsertSpecialtyItem).toHaveBeenCalledTimes(3);
    });

    // TESTING SUCCESSES
    it("calls prisma.createCompany() with params", async () => {
      jest.spyOn(prisma.$exists, "company").mockImplementation(() => false);
      const params = [{}, { name: "Company name" }, { prisma }, {}];
      await createCompany(...params);

      expect(prisma.createCompany).toHaveBeenCalledTimes(1);
      expect(prisma.createCompany).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company name" })
      );
    });
  });

  describe("updateCompany() mutation", () => {
    const updateCompany = jest.spyOn(companyResolver.Mutation, "updateCompany");

    it("throws an error if id is not provided", async () => {
      const params = [{}, { updated_name: "Company" }, { prisma }, {}];

      await expect(updateCompany(...params)).rejects.toThrow(
        "You must provide id"
      );
      expect(prisma.updateCompany).not.toHaveBeenCalled();
    });

    it("throws an error if updated_name is not provided", async () => {
      const params = [{}, { id: 1 }, { prisma }, {}];

      await expect(updateCompany(...params)).rejects.toThrow(
        "You must enter a company name"
      );
    });

    it("throws an error if a company with updated_name with different id exists", async () => {
      const params = [{}, { updated_name: "Company", id: 2 }, { prisma }, {}];
      jest
        .spyOn(prisma, "company")
        .mockImplementation(() => ({ name: "Company", id: 1 }));

      await expect(updateCompany(...params)).rejects.toThrow(
        "There is a company named 'Company' already, please enter a different name."
      );
      expect(prisma.updateCompany).not.toHaveBeenCalled();
    });

    it("deletes old service/specialty tree then calls updateCompany", async () => {
      const params = [{}, { updated_name: "Company", id: 1 }, { prisma }, {}];
      jest.spyOn(prisma, "company").mockImplementation(() => ({
        services: jest.fn(() => [{ id: 1 }, { id: 2 }]),
      }));
      await updateCompany(...params);

      expect(prisma.deleteManyServices).toHaveBeenCalledTimes(1);
      expect(prisma.updateCompany).toHaveBeenCalledTimes(1);
    });
  });

  describe("deleteCompany() mutation", () => {
    const deleteCompany = jest.spyOn(companyResolver.Mutation, "deleteCompany");

    it("calls prisma.deleteCompany with id", () => {
      const params = [{}, { id: 1 }, { prisma }, {}];
      deleteCompany(...params);

      expect(prisma.deleteCompany).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
    });
  });

  describe("Company.services()", () => {
    const services = jest.spyOn(companyResolver.Company, "services");
    const params = [{ id: 1 }, {}, { prisma }, {}];

    it("calls prisma.company with id", () => {
      prisma.company.mockImplementation(() => ({
        services: jest.fn(() => [{}]),
      }));
      const returned = services(...params);

      expect(prisma.company).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returned).toStrictEqual(expect.arrayContaining([{}]));
    });
  });

  describe("Company.regions()", () => {
    const regions = jest.spyOn(companyResolver.Company, "regions");
    const params = [{ id: 1 }, {}, { prisma }, {}];

    it("calls prisma.company with id", () => {
      prisma.company.mockImplementation(() => ({
        regions: jest.fn(() => [{}]),
      }));
      const returned = regions(...params);

      expect(prisma.company).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returned).toStrictEqual(expect.arrayContaining([{}]));
    });
  });

  describe("Company.therapeutics()", () => {
    const therapeutics = jest.spyOn(companyResolver.Company, "therapeutics");
    const params = [{ id: 1 }, {}, { prisma }, {}];

    it("calls prisma.company with id", () => {
      prisma.company.mockImplementation(() => ({
        therapeutics: jest.fn(() => [{}]),
      }));
      const returned = therapeutics(...params);

      expect(prisma.company).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returned).toStrictEqual(expect.arrayContaining([{}]));
    });
  });
});
