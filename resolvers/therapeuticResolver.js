module.exports = {
  Query: {
    therapeutics: (parent, args, { prisma }, info) => {
      return prisma.therapeutics();
    },
    therapeutic: (parent, { name }, { prisma }, info) => {
      return prisma.therapeutic({ name });
    },
    searchTherapeutics: (parent, { name }, { prisma }, info) => {
      if (search.length < 3) {
        throw new Error("Please enter a search term at least 3 characters");
      }

      return prisma.therapeutics({
        where: { name_contains: name },
      });
    },
  },
  Mutation: {
    createTherapeutic: async (parent, { name }, { prisma }, info) => {
      const found = await prisma.$exists.therapeutic({ name });

      if (found) {
        throw new Error(
          `There is a therapeutic area named '${name}' already, please enter a different name.`
        );
      }

      return await prisma.createTherapeutic({ name });
    },
    updateTherapeutic: async (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;

      if (name !== updated_name) {
        const found = await prisma.$exists.therapeutic({ name: updated_name });

        if (found) {
          throw new Error(
            `There is a therapeutic area named '${updated_name}' already, please enter a different name.`
          );
        }
      }

      return await prisma.updateTherapeutic({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteTherapeutic: (parent, { name }, { prisma }, info) => {
      return prisma.deleteTherapeutic({ name });
    },
  },
  Therapeutic: {
    companies: ({ name }, args, { prisma }, info) => {
      return prisma.therapeutic({ name }).companies();
    },
  },
};
