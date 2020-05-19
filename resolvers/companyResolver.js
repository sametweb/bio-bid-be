const asyncForEach = async (array, finder, creator) => {
  for (let i = 0; i < array.length; i++) {
    const created = await finder({ name: array[i].name });
    if (!created) await creator(array[i]);
  }
};

module.exports = {
  Query: {
    companies: (parent, args, { prisma }, info) => {
      return prisma.companies();
    },
    company: (parent, { name }, { prisma }, info) => {
      return prisma.company({ name });
    },
  },
  Mutation: {
    createCompany: async (parent, args, { prisma }, info) => {
      const { name, services, specialties } = args;

      // If the service is not in DB, add it
      await asyncForEach(services, prisma.service, prisma.createService);

      return await prisma.createCompany({
        name,
        services: { connect: services },
      });
    },
    updateCompany: async (parent, args, { prisma }, info) => {
      const { updated_name, updated_services, name } = args;

      // If the service is not in DB, add it
      await asyncForEach(
        updated_services,
        prisma.service,
        prisma.createService
      );

      return await prisma.updateCompany({
        data: {
          name: updated_name || name,
          services: { connect: updated_services },
        },
        where: { name },
      });
    },
    deleteCompany: (parent, { name }, { prisma }, info) => {
      return prisma.deleteCompany({ name });
    },
  },
  Company: {
    studies: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).studies();
    },
    services: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).services();
    },
    specialties: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).specialties();
    },
  },
};
