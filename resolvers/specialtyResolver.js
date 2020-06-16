module.exports = {
  Query: {
    // specialties: (parent, args, { prisma }, info) => {
    //   return prisma.specialties();
    // },
  },
  Specialty: {
    name: async ({ id }, args, { prisma }, info) => {
      const { name } = await prisma.specialty({ id }).info();

      return await name;
    },
    sub_specialties: ({ id }, args, { prisma }, info) => {
      return prisma.specialty({ id }).sub_specialties();
    },
  },
};
