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
      const { name, services } = args;

      // If the service is not in DB, add it
      services.forEach(async (service) => {
        try {
          const created = await prisma.service({ name: service.name });
        } catch {
          await prisma.createService(service);
          console.log(created);
        }
      });

      return await prisma.createCompany({
        name,
        services: { connect: services },
      });
    },
    updateCompany: async (parent, args, { prisma }, info) => {
      const { updated_name, updated_services, name } = args;

      // If the service is not in DB, add it
      updated_services.forEach(async (service) => {
        try {
          const created = await prisma.service({ name: service.name });
        } catch {
          await prisma.createService(service);
          console.log(created);
        }
      });

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
  },
};
