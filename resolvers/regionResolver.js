module.exports = {
  Query: {
    regions: (parent, args, { prisma }, info) => {
      return prisma.regions();
    },
    region: (parent, { name }, { prisma }, info) => {
      return prisma.region({ name });
    },
    searchRegion: (parent, { region }, { prisma }, info) => {
      return prisma.regions({
        where: { name_contains: region },
      });
    },
  },
  Mutation: {
    createRegion: (parent, { name }, { prisma }, info) => {
      return prisma.createRegion({ name });
    },
    updateRegion: (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;
      return prisma.updateRegion({
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
