const regionResolver = require("../resolvers/regionResolver");

const dummyRegion = { data: { region: { id: 1, name: "Region" } } };
const dummyRegions = {
  data: {
    regions: [{ id: 1, name: "Region 1" }, { id: 2, name: "Region 2 " }],
  },
};

const prisma = {
  $exists: { region: jest.fn() },
  regions: jest.fn(() => dummyRegions),
  region: jest.fn(() => ({ companies: jest.fn() })),
  createRegion: jest.fn(() => dummyRegion),
  updateRegion: jest.fn(() => dummyRegion),
  deleteRegion: jest.fn(() => dummyRegion),
};

describe("Query", () => {
  const region = jest.spyOn(regionResolver.Query, "region");
  const regions = jest.spyOn(regionResolver.Query, "regions");
  const searchRegions = jest.spyOn(regionResolver.Query, "searchRegions");
  const params = [{}, {}, { prisma }, {}];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("regions()", () => {
    it("calls prisma.regions", () => {
      regions(...params);

      expect(prisma.regions).toHaveBeenCalledTimes(1);
    });
  });

  describe("region()", () => {
    it("calls prisma.region with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      region(...params);

      expect(prisma.region).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });

  describe("searchRegions()", () => {
    it("throws an error if search length is less than 3 characters", async () => {
      const params = [{}, { search: "as" }, { prisma }, {}];
      const request = async () => await searchRegions(...params);

      await expect(() => request()).rejects.toThrow(
        "Please enter a search term at least 3 characters"
      );
      expect(prisma.regions).not.toHaveBeenCalled();
    });

    it("calls prisma.regions with search term", () => {
      const params = [{}, { search: "asd" }, { prisma }, {}];
      searchRegions(...params);

      expect(prisma.regions).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name_contains: "asd" } })
      );
    });
  });
});

describe("Mutation", () => {
  const createRegion = jest.spyOn(regionResolver.Mutation, "createRegion");
  const updateRegion = jest.spyOn(regionResolver.Mutation, "updateRegion");
  const deleteRegion = jest.spyOn(regionResolver.Mutation, "deleteRegion");

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createRegion()", () => {
    it("throws an error if there is a region with same name", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.region.mockImplementation(() => true);

      await expect(createRegion(...params)).rejects.toThrow(
        `There is a service named '${
          params[1].name
        }' already, please enter a different name.`
      );
      expect(prisma.createRegion).not.toHaveBeenCalled();
    });

    it("calls prisma.createRegion()", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.region.mockImplementation(() => false);

      await createRegion(...params);

      expect(prisma.createRegion).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });

  describe("updateRegion()", () => {
    it("throws an error if there is another region with updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.region.mockImplementation(() => true);

      await expect(updateRegion(...params)).rejects.toThrow(
        "There is a region named 'b' already, please enter a different name."
      );
      expect(prisma.updateRegion).not.toHaveBeenCalled();
    });

    it("calls prisma.updateRegion()", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.region.mockImplementation(() => false);

      await updateRegion(...params);

      expect(prisma.updateRegion).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "b" }, where: { name: "a" } })
      );
    });

    it("calls prisma.updateRegion() when name === updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "a" }, { prisma }, {}];
      await updateRegion(...params);

      expect(prisma.updateRegion).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "a" }, where: { name: "a" } })
      );
      expect(prisma.$exists.region).not.toHaveBeenCalled();
    });
  });

  describe("deleteRegion()", () => {
    it("calls prisma.deleteRegion() with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      deleteRegion(...params);

      expect(prisma.deleteRegion).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
});

describe("Region", () => {
  const companies = jest.spyOn(regionResolver.Region, "companies");
  it("calls prisma.region with parent.name", () => {
    const params = [{ name: "Parent" }, {}, { prisma }, {}];
    companies(...params);

    expect(prisma.region).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Parent" })
    );
  });
});
