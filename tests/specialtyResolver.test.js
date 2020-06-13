const specialtyResolver = require("../resolvers/specialtyResolver");

const prisma = {
  specialty: jest.fn(() => ({})),
  name: jest.fn(),
};

describe("specialtyResolver", () => {
  const name = jest.spyOn(specialtyResolver.Specialty, "name");
  const sub_specialties = jest.spyOn(
    specialtyResolver.Specialty,
    "sub_specialties"
  );

  describe("Specialty", () => {
    it("fetches service name from specialty().info()", async () => {
      const params = [{ id: 1 }, {}, { prisma }];
      prisma.specialty.mockImplementation(() => ({
        info: jest.fn(() => ({ name: "name" })),
      }));

      const nameCall = async () => await name(...params);
      const returnedName = await nameCall();

      expect(prisma.specialty).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returnedName).toBe("name");
    });

    it("fetches sub_specialties from specialty().sub_specialties()", () => {
      const params = [{ id: 1 }, {}, { prisma }, {}];
      prisma.specialty.mockImplementation(() => ({
        sub_specialties: jest.fn(() => [{}]),
      }));

      const returned = sub_specialties(...params);

      expect(prisma.specialty).toHaveBeenCalledWith(
        expect.objectContaining({ id: 1 })
      );
      expect(returned).toStrictEqual(expect.arrayContaining([{}]));
    });
  });
});
