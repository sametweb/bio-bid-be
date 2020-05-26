module.exports = {
  Query: {
    therapeutics: (parent, args, { prisma }, info) => {
      return prisma.therapeutics();
    },
    therapeutic: (parent, { name }, { prisma }, info) => {
      return prisma.therapeutic({ name });
    },
    searchTherapeutic: (parent, { name }, { prisma }, info) => {
      return prisma.therapeutics({
        where: { name_contains: name },
      });
    },
  },
  Mutation: {
    createTherapeutic: (parent, { name }, { prisma }, info) => {
      return prisma.createTherapeutic({ name });
    },
    updateTherapeutic: (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;
      return prisma.updateTherapeutic({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteTherapeutic: (parent, { name }, { prisma }, info) => {
      return prisma.deleteTherapeutic({ name });
    },
  },
  TherapeuticArea: {
    companies: ({ name }, args, { prisma }, info) => {
      return prisma.therapeutic({ name }).companies();
    },
  },
};
