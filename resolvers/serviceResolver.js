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
  Mutation: {
    createService: (parent, { name }, { prisma }, info) => {
      return prisma.createService({ name });
    },
    updateService: (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;
      return prisma.updateService({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteService: (parent, { name }, { prisma }, info) => {
      return prisma.deleteService({ name });
    },
  },
  Service: {
    companies: ({ name }, args, { prisma }, info) => {
      return prisma.service({ name }).companies();
    },
  },
};
