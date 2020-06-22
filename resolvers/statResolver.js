module.exports = {
  Query: {
    statistics: async (parent, args, { prisma }) => {
      const companyCount = await prisma
        .companiesConnection()
        .aggregate()
        .count();
      const pendingClaimCount = await prisma
        .claimsConnection({ where: { pending: true } })
        .aggregate()
        .count();
      const serviceCount = await prisma
        .serviceItemsConnection()
        .aggregate()
        .count();
      const specialtyCount = await prisma
        .specialtyItemsConnection()
        .aggregate()
        .count();
      console.log({
        companyCount,
        pendingClaimCount,
        serviceCount,
        specialtyCount,
      });
      return { companyCount, pendingClaimCount, serviceCount, specialtyCount };
    },
  },
};
