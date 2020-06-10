module.exports = {
  Query: {
    regions: (parent, args, { prisma }, info) => {
      return prisma.regions();
    },
    region: (parent, { name }, { prisma }, info) => {
      return prisma.region({ name });
    },
    searchRegions: (parent, { search }, { prisma }, info) => {
      if (search.length < 3) {
        throw new Error("Please enter a search term at least 3 characters");
      }

      return prisma.regions({
        where: { name_contains: search },
      });
    },
  },
  Mutation: {
    createRegion: async (parent, { name }, { prisma }, info) => {
      const found = await prisma.$exists.region({ name });

      if (found) {
        throw new Error(
          `There is a service named '${name}' already, please enter a different name.`
        );
      }

      return await prisma.createRegion({ name });
    },
    updateRegion: async (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;

      if (name !== updated_name) {
        const found = await prisma.$exists.region({ name: updated_name });

        if (found) {
          throw new Error(
            `There is a region named '${updated_name}' already, please enter a different name.`
          );
        }
      }

      return await prisma.updateRegion({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteRegion: (parent, { name }, { prisma }, info) => {
      return prisma.deleteRegion({ name });
    },
  },
  Region: {
    companies: ({ name }, args, { prisma }, info) => {
      return prisma.region({ name }).companies();
    },
  },
};
