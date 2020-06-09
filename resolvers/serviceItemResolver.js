module.exports = {
  Query: {
    serviceItems: (parent, args, { prisma }, info) => {
      return prisma.serviceItems();
    },
  },
  Mutation: {
    createServiceItem: async (parent, { name }, { prisma }, info) => {
      const found = prisma.$exists.serviceItem({ name });

      if (found) {
        throw new Error(
          `There is a service named '${name}' already, please enter a different name.`
        );
      }

      return prisma.createServiceItem({ name });
    },
    updateServiceItem: (parent, { name, updated_name }, { prisma }, info) => {
      return prisma.updateServiceItem({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteServiceItem: (parent, { name }, { prisma }, info) => {
      return prisma.deleteServiceItem({ name });
    },
  },
};
