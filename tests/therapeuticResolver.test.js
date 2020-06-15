const therapeuticResolver = require("../resolvers/therapeuticResolver");

const dummyTherapeutic = {
  data: { therapeutic: { id: 1, name: "therapeutic" } },
};
const dummyTherapeutics = {
  data: {
    therapeutics: [
      { id: 1, name: "therapeutic 1" },
      { id: 2, name: "therapeutic 2 " },
    ],
  },
};

const prisma = {
  $exists: { therapeutic: jest.fn() },
  therapeutics: jest.fn(() => dummyTherapeutics),
  therapeutic: jest.fn(() => ({ companies: jest.fn() })),
  searchTherapeutics: jest.fn(() => dummyTherapeutics),
  createTherapeutic: jest.fn(() => dummyTherapeutic),
  updateTherapeutic: jest.fn(() => dummyTherapeutic),
  deleteTherapeutic: jest.fn(() => dummyTherapeutic),
};

describe("Query", () => {
  const therapeutic = jest.spyOn(therapeuticResolver.Query, "therapeutic");
  const therapeutics = jest.spyOn(therapeuticResolver.Query, "therapeutics");
  const searchTherapeutics = jest.spyOn(
    therapeuticResolver.Query,
    "searchTherapeutics"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  const params = [{}, {}, { prisma }, {}];

  describe("therapeutics()", () => {
    it("calls prisma.therapeutics", () => {
      therapeutics(...params);

      expect(prisma.therapeutics).toHaveBeenCalledTimes(1);
    });
  });

  describe("therapeutic()", () => {
    it("calls prisma.therapeutic with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      therapeutic(...params);

      expect(prisma.therapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
  describe("searchTherapeutics()", () => {
    const params = [{}, { search: "as" }, { prisma }, {}];

    it("throws an error if search length is less than 3 characters", async () => {
      const request = async () => await searchTherapeutics(...params);
      await expect(() => request()).rejects.toThrow(
        "Please enter a search term at least 3 characters"
      );
      expect(prisma.therapeutics).not.toHaveBeenCalled();
    });

    it("calls prisma.therapeutics with search term", () => {
      const params = [{}, { search: "asd" }, { prisma }, {}];
      searchTherapeutics(...params);

      expect(prisma.therapeutics).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name_contains: "asd" } })
      );
    });
  });
});

describe("Mutation", () => {
  const createTherapeutic = jest.spyOn(
    therapeuticResolver.Mutation,
    "createTherapeutic"
  );
  const updateTherapeutic = jest.spyOn(
    therapeuticResolver.Mutation,
    "updateTherapeutic"
  );
  const deleteTherapeutic = jest.spyOn(
    therapeuticResolver.Mutation,
    "deleteTherapeutic"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createTherapeutic()", () => {
    it("throws an error if there is a therapeutic area with same name", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.therapeutic.mockImplementation(() => true);

      await expect(createTherapeutic(...params)).rejects.toThrow(
        `There is a therapeutic area named '${params[1].name}' already, please enter a different name.`
      );
      expect(prisma.createTherapeutic).not.toHaveBeenCalled();
    });

    it("calls prisma.createTherapeutic()", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.therapeutic.mockImplementation(() => false);

      await createTherapeutic(...params);

      expect(prisma.createTherapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
  describe("updateTherapeutic()", () => {
    it("throws an error if there is another therapeutic with updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.therapeutic.mockImplementation(() => true);

      await expect(updateTherapeutic(...params)).rejects.toThrow(
        "There is a therapeutic area named 'b' already, please enter a different name."
      );
      expect(prisma.$exists.therapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "b" })
      );
      expect(prisma.updateTherapeutic).not.toHaveBeenCalled();
    });

    it("calls prisma.updateTherapeutic()", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.therapeutic.mockImplementation(() => false);

      await updateTherapeutic(...params);

      expect(prisma.$exists.therapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "b" })
      );
      expect(prisma.updateTherapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "b" }, where: { name: "a" } })
      );
    });
  });

  describe("deleteTherapeutic()", () => {
    it("calls prisma.deleteTherapeutic() with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      deleteTherapeutic(...params);

      expect(prisma.deleteTherapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
});

describe("Therapeutic", () => {
  const companies = jest.spyOn(therapeuticResolver.Therapeutic, "companies");
  it("calls prisma.therapeutic with parent.name", () => {
    const params = [{ name: "Parent" }, {}, { prisma }, {}];
    companies(...params);

    expect(prisma.therapeutic).toHaveBeenCalledWith(
      expect.objectContaining({ name: "Parent" })
    );
  });
});
