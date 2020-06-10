module.exports = {
  Query: {
    specialtyItems: (parent, args, { prisma }, info) => {
      return prisma.specialtyItems();
    },
    specialtyItem: (parent, { name }, { prisma }, info) => {
      return prisma.specialtyItem({ name });
    },
    searchSpecialtyItems: (parent, { search }, { prisma }, info) => {
      if (search.length < 3) {
        throw new Error("Please enter a search term at least 3 characters");
      }

      return prisma.specialtyItems({ where: { name_contains: search } });
    },
  },
  Mutation: {
    createSpecialtyItem: async (parent, { name }, { prisma }, info) => {
      const found = await prisma.$exists.specialtyItem({ name });

      if (found) {
        throw new Error(
          `There is a specialty named '${name}' already, please enter a different name.`
        );
      }

      return await prisma.createSpecialtyItem({ name });
    },
    updateSpecialtyItem: async (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;

      if (name !== updated_name) {
        const found = await prisma.$exists.specialtyItem({
          name: updated_name,
        });

        if (found) {
          throw new Error(
            `There is a specialty named '${updated_name}' already, please enter a different name.`
          );
        }
      }

      return await prisma.updateSpecialtyItem({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteSpecialtyItem: (parent, { name }, { prisma }, info) => {
      return prisma.deleteSpecialtyItem({ name });
    },
  },
};
