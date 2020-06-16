const specialtyItemResolver = require("../resolvers/specialtyItemResolver");

const dummySpecialtyItem = {
  data: { specialtyItem: { id: 1, name: "specialtyItem" } },
};
const dummyspecialtyItems = {
  data: {
    specialtyItems: [
      { id: 1, name: "specialtyItem 1" },
      { id: 2, name: "specialtyItem 2 " },
    ],
  },
};

const prisma = {
  $exists: { specialtyItem: jest.fn() },
  specialtyItems: jest.fn(() => dummyspecialtyItems),
  specialtyItem: jest.fn(() => ({ companies: jest.fn() })),
  createSpecialtyItem: jest.fn(() => dummySpecialtyItem),
  updateSpecialtyItem: jest.fn(() => dummySpecialtyItem),
  deleteSpecialtyItem: jest.fn(() => dummySpecialtyItem),
};

describe("Query", () => {
  const specialtyItem = jest.spyOn(
    specialtyItemResolver.Query,
    "specialtyItem"
  );
  const specialtyItems = jest.spyOn(
    specialtyItemResolver.Query,
    "specialtyItems"
  );
  const searchSpecialtyItems = jest.spyOn(
    specialtyItemResolver.Query,
    "searchSpecialtyItems"
  );
  const params = [{}, {}, { prisma }, {}];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("specialtyItems()", () => {
    it("calls prisma.specialtyItems", () => {
      specialtyItems(...params);

      expect(prisma.specialtyItems).toHaveBeenCalledTimes(1);
    });
  });

  describe("specialtyItem()", () => {
    it("calls prisma.specialtyItem with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      specialtyItem(...params);

      expect(prisma.specialtyItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });

  describe("searchSpecialtyItems()", () => {
    const params = [{}, { search: "as" }, { prisma }, {}];

    it("throws an error if search length is less than 3 characters", async () => {
      const request = async () => await searchSpecialtyItems(...params);
      await expect(() => request()).rejects.toThrow(
        "Please enter a search term at least 3 characters"
      );
      expect(prisma.specialtyItems).not.toHaveBeenCalled();
    });

    it("calls prisma.specialtyItems with search term", () => {
      const params = [{}, { search: "asd" }, { prisma }, {}];
      searchSpecialtyItems(...params);

      expect(prisma.specialtyItems).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name_contains: "asd" } })
      );
    });
  });
});

describe("Mutation", () => {
  const createSpecialtyItem = jest.spyOn(
    specialtyItemResolver.Mutation,
    "createSpecialtyItem"
  );
  const updateSpecialtyItem = jest.spyOn(
    specialtyItemResolver.Mutation,
    "updateSpecialtyItem"
  );
  const deleteSpecialtyItem = jest.spyOn(
    specialtyItemResolver.Mutation,
    "deleteSpecialtyItem"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createSpecialtyItem()", () => {
    it("throws an error if there is a specialtyItem with same name", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.specialtyItem.mockImplementation(() => true);

      await expect(createSpecialtyItem(...params)).rejects.toThrow(
        `There is a specialty named '${
          params[1].name
        }' already, please enter a different name.`
      );
      expect(prisma.createSpecialtyItem).not.toHaveBeenCalled();
    });

    it("calls prisma.createSpecialtyItem()", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.specialtyItem.mockImplementation(() => false);

      await createSpecialtyItem(...params);

      expect(prisma.createSpecialtyItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });

  describe("updateSpecialtyItem()", () => {
    it("throws an error if there is another specialtyItem with updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.specialtyItem.mockImplementation(() => true);

      await expect(updateSpecialtyItem(...params)).rejects.toThrow(
        "There is a specialty named 'b' already, please enter a different name."
      );
      expect(prisma.updateSpecialtyItem).not.toHaveBeenCalled();
    });

    it("calls prisma.updateSpecialtyItem()", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.specialtyItem.mockImplementation(() => false);

      await updateSpecialtyItem(...params);

      expect(prisma.updateSpecialtyItem).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "b" }, where: { name: "a" } })
      );
    });

    it("calls prisma.updateSpecialtyItem() when name === updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "a" }, { prisma }, {}];
      await updateSpecialtyItem(...params);

      expect(prisma.updateSpecialtyItem).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "a" }, where: { name: "a" } })
      );
      expect(prisma.$exists.specialtyItem).not.toHaveBeenCalled();
    });
  });

  describe("deleteSpecialtyItem()", () => {
    it("calls prisma.deleteSpecialtyItem() with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      deleteSpecialtyItem(...params);

      expect(prisma.deleteSpecialtyItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
});
