module.exports = {
  Query: {
    serviceItems: (parent, args, { prisma }, info) => {
      return prisma.serviceItems();
    },
    serviceItem: (parent, { name }, { prisma }, info) => {
      return prisma.serviceItem({ name });
    },
    searchServiceItems: (parent, { search }, { prisma }, info) => {
      if (search.length < 3) {
        throw new Error("Please enter a search term at least 3 characters");
      }

      return prisma.serviceItems({ where: { name_contains: search } });
    },
  },
  Mutation: {
    createServiceItem: async (parent, { name }, { prisma }, info) => {
      const found = await prisma.$exists.serviceItem({ name });

      if (found) {
        throw new Error(
          `There is a service named '${name}' already, please enter a different name.`
        );
      }

      return await prisma.createServiceItem({ name });
    },
    updateServiceItem: async (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;

      if (name !== updated_name) {
        const found = await prisma.$exists.serviceItem({ name: updated_name });

        if (found) {
          throw new Error(
            `There is a service named '${updated_name}' already, please enter a different name.`
          );
        }
      }

      return await prisma.updateServiceItem({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteServiceItem: (parent, { name }, { prisma }, info) => {
      return prisma.deleteServiceItem({ name });
    },
  },
};
