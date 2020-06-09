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
  Specialty: {
    id: async (specialty, args, { prisma }, info) => {
      const { id } = await prisma.specialty({ id: specialty.id }).info();
      return id;
    },
    name: async ({ id }, args, { prisma }, info) => {
      const { name } = await prisma.specialty({ id }).info();
      return name;
    },
    sub_specialties: ({ id }, args, { prisma }, info) => {
      return prisma.specialty({ id }).sub_specialties();
    },
  },
};
