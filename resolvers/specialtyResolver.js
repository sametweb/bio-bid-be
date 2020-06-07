module.exports = {
  Query: {
    specialties: (parent, args, { prisma }, info) => {
      return prisma.specialties();
    },
    specialty: async (parent, { name }, { prisma }, info) => {
      const specialty = await prisma.$exists.specialty({ name });
      if (!specialty)
        throw new Error("Specialty with that name does not exist...");
      return await prisma.specialty({ name });
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
    sub_specialties: ({ id }, args, { prisma }, info) => {
      return prisma.specialty({ id }).sub_specialties();
    },
  },
};
