module.exports = {
  Query: {
    specialties: (parent, args, { prisma }, info) => {
      return prisma.specialties();
    },
    specialty: (parent, { name }, { prisma }, info) => {
      return prisma.specialty({ name });
    },
    searchSpecialty: (parent, { search }, { prisma }, info) => {
      return prisma.specialties({
        where: { name_contains: search },
      });
    },
  },
  Mutation: {
    createSpecialty: (parent, { name }, { prisma }, info) => {
      return prisma.createSpecialty({ name });
    },
    updateSpecialty: (parent, args, { prisma }, info) => {
      const { name, updated_name } = args;
      return prisma.updateSpecialty({
        data: { name: updated_name },
        where: { name },
      });
    },
    deleteSpecialty: (parent, { name }, { prisma }, info) => {
      return prisma.deleteSpecialty({ name });
    },
  },
  Specialty: {
    companies: ({ name }, args, { prisma }, info) => {
      return prisma.specialty({ name }).companies();
    },
  },
};
