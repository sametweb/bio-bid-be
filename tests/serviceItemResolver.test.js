const serviceItemResolver = require("../resolvers/serviceItemResolver");

const dummyServiceItem = {
  data: { serviceItem: { id: 1, name: "serviceItem" } },
};
const dummyserviceItems = {
  data: {
    serviceItems: [
      { id: 1, name: "serviceItem 1" },
      { id: 2, name: "serviceItem 2 " },
    ],
  },
};

const prisma = {
  $exists: { serviceItem: jest.fn() },
  serviceItems: jest.fn(() => dummyserviceItems),
  serviceItem: jest.fn(() => ({ companies: jest.fn() })),
  createServiceItem: jest.fn(() => dummyServiceItem),
  updateServiceItem: jest.fn(() => dummyServiceItem),
  deleteServiceItem: jest.fn(() => dummyServiceItem),
};

describe("Query", () => {
  const serviceItem = jest.spyOn(serviceItemResolver.Query, "serviceItem");
  const serviceItems = jest.spyOn(serviceItemResolver.Query, "serviceItems");
  const searchServiceItems = jest.spyOn(
    serviceItemResolver.Query,
    "searchServiceItems"
  );
  const params = [{}, {}, { prisma }, {}];

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("serviceItems()", () => {
    it("calls prisma.serviceItems", () => {
      serviceItems(...params);

      expect(prisma.serviceItems).toHaveBeenCalledTimes(1);
    });
  });

  describe("serviceItem()", () => {
    it("calls prisma.serviceItem with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      serviceItem(...params);

      expect(prisma.serviceItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });

  describe("searchServiceItems()", () => {
    const params = [{}, { search: "as" }, { prisma }, {}];

    it("throws an error if search length is less than 3 characters", async () => {
      const request = async () => await searchServiceItems(...params);
      await expect(() => request()).rejects.toThrow(
        "Please enter a search term at least 3 characters"
      );
      expect(prisma.serviceItems).not.toHaveBeenCalled();
    });

    it("calls prisma.serviceItems with search term", () => {
      const params = [{}, { search: "asd" }, { prisma }, {}];
      searchServiceItems(...params);

      expect(prisma.serviceItems).toHaveBeenCalledWith(
        expect.objectContaining({ where: { name_contains: "asd" } })
      );
    });
  });
});

describe("Mutation", () => {
  const createServiceItem = jest.spyOn(
    serviceItemResolver.Mutation,
    "createServiceItem"
  );
  const updateServiceItem = jest.spyOn(
    serviceItemResolver.Mutation,
    "updateServiceItem"
  );
  const deleteServiceItem = jest.spyOn(
    serviceItemResolver.Mutation,
    "deleteServiceItem"
  );

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe("createServiceItem()", () => {
    it("throws an error if there is a serviceItem with same name", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.serviceItem.mockImplementation(() => true);

      await expect(createServiceItem(...params)).rejects.toThrow(
        `There is a service named '${
          params[1].name
        }' already, please enter a different name.`
      );
      expect(prisma.createServiceItem).not.toHaveBeenCalled();
    });

    it("calls prisma.createServiceItem()", async () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      prisma.$exists.serviceItem.mockImplementation(() => false);

      await createServiceItem(...params);

      expect(prisma.createServiceItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });

  describe("updateServiceItem()", () => {
    it("throws an error if there is another serviceItem with updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.serviceItem.mockImplementation(() => true);

      await expect(updateServiceItem(...params)).rejects.toThrow(
        "There is a service named 'b' already, please enter a different name."
      );
      expect(prisma.updateServiceItem).not.toHaveBeenCalled();
    });

    it("calls prisma.updateServiceItem()", async () => {
      const params = [{}, { name: "a", updated_name: "b" }, { prisma }, {}];
      prisma.$exists.serviceItem.mockImplementation(() => false);

      await updateServiceItem(...params);

      expect(prisma.updateServiceItem).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "b" }, where: { name: "a" } })
      );
    });

    it("calls prisma.updateServiceItem() when name === updated_name", async () => {
      const params = [{}, { name: "a", updated_name: "a" }, { prisma }, {}];
      await updateServiceItem(...params);

      expect(prisma.updateServiceItem).toHaveBeenCalledWith(
        expect.objectContaining({ data: { name: "a" }, where: { name: "a" } })
      );
      expect(prisma.$exists.serviceItem).not.toHaveBeenCalled();
    });
  });

  describe("deleteServiceItem()", () => {
    it("calls prisma.deleteServiceItem() with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      deleteServiceItem(...params);

      expect(prisma.deleteServiceItem).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
});
