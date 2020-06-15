const serviceResolver = require("../resolvers/serviceResolver");

const prisma = {
  service: jest.fn(() => ({})),
  name: jest.fn(),
};

describe("serviceResolver", () => {
  const name = jest.spyOn(serviceResolver.Service, "name");
  const specialties = jest.spyOn(serviceResolver.Service, "specialties");

  describe("Service", () => {
    it("fetches service name from service().info()", async () => {
      const params = [{ id: 1 }, {}, { prisma }];
      prisma.service.mockImplementation(() => ({
        info: jest.fn(() => ({ name: "name" })),
      }));

      const nameCall = async () => await name(...params);
      const returnedName = await nameCall();

      expect(prisma.service).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returnedName).toBe("name");
    });

    it("fetches specialties from service().specialties()", () => {
      const params = [{ id: 1 }, {}, { prisma }, {}];
      prisma.service.mockImplementation(() => ({
        specialties: jest.fn(() => [{}]),
      }));

      const returned = specialties(...params);

      expect(prisma.service).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returned).toStrictEqual(expect.arrayContaining([{}]));
    });
  });
});
