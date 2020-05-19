module.exports = {
  Query: {
    services: (parent, args, { prisma }, info) => {
      return prisma.services();
    },
    service: (parent, { name }, { prisma }, info) => {
      return prisma.service({ name });
    },
    searchService: (parent, { search }, { prisma }, info) => {
      return prisma.services({
        where: { name_contains: search },
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
