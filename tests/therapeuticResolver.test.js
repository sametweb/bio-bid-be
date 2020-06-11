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
  therapeutics: jest.fn(() => dummyTherapeutics),
  therapeutic: jest.fn(() => dummyTherapeutic),
  createtherapeutic: jest.fn(() => dummyTherapeutic),
  updatetherapeutic: jest.fn(() => dummyTherapeutic),
  deletetherapeutic: jest.fn(() => dummyTherapeutic),
};

describe("Query", () => {
  const therapeutic = jest.spyOn(therapeuticResolver.Query, "therapeutic");
  const therapeutics = jest.spyOn(therapeuticResolver.Query, "therapeutics");
  const params = [{}, {}, { prisma }, {}];

  describe("therapeutics()", () => {
    it("calls prisma.therapeutics", () => {
      therapeutics(...params);

      expect(prisma.therapeutics).toHaveBeenCalled();
      expect(prisma.therapeutics).toHaveBeenCalledTimes(1);
    });
  });

  describe("therapeutic()", () => {
    it("calls prisma.therapeutic with name", () => {
      const params = [{}, { name: "Company" }, { prisma }, {}];
      therapeutic(...params);

      expect(prisma.therapeutic).toHaveBeenCalled();
      expect(prisma.therapeutic).toHaveBeenCalledTimes(1);
      expect(prisma.therapeutic).toHaveBeenCalledWith(
        expect.objectContaining({ name: "Company" })
      );
    });
  });
});
