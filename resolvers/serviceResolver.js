// services represents a sub-field under Company
// whereas serviceItems are the unique services
// that can be assigned to a service under a company

module.exports = {
  Query: {
    // services: (parent, args, { prisma }, info) => {
    //   return prisma.services();
    // },
  },
  Service: {
    name: async ({ id }, args, { prisma }) => {
      const { name } = await prisma.service({ id }).info();
      return await name;
    },
    specialties: ({ id }, args, { prisma }, info) => {
      return prisma.service({ id }).specialties();
    },
  },
};
