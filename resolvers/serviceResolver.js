module.exports = {
  Query: {
    services: (parent, args, { prisma }, info) => {
      return prisma.services();
    },
    service: async (parent, { name }, { prisma }, info) => {
      const service = await prisma.$exists.service({ name });
      if (!service) throw new Error("Service with that name does not exist...");
      return await prisma.service({ name });
    },
    searchService: (parent, { search }, { prisma }, info) => {
      return prisma.services({
        where: { name_contains: search.toLowerCase() },
      });
    },
  },
  Service: {
    id: async (service, args, { prisma }) => {
      const { id } = await prisma.service({ id: service.id }).info();
      return id;
    },
    name: async ({ id }, args, { prisma }) => {
      const { name } = await prisma.service({ id }).info();
      return name;
    },
    specialties: (parent, args, { prisma }, info) => {
      return prisma.service({ id: parent.id }).specialties();
    },
    companies: (parent, args, { prisma }, info) => {
      return prisma.service({ id: parent.id }).companies();
    },
  },
};
