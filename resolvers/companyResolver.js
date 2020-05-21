const { asyncForEach, oldItemRemover } = require("../helpers");

module.exports = {
  Query: {
    companies: (parent, args, { prisma }, info) => {
      return prisma.companies();
    },
    company: (parent, { name }, { prisma }, info) => {
      return prisma.company({ name });
    },
  },
  Mutation: {
    createCompany: async (parent, args, { prisma }, info) => {
      const {
        name,
        logoURL,
        website,
        linkedin,
        overview,
        headquarters,
        companySize,
        services,
        specialties,
      } = args;

      // If the service is not in DB, add it
      if (services) {
        await asyncForEach(services, prisma.service, prisma.createService);
      }
      // If the specialty is not in DB, add it
      if (specialties) {
        await asyncForEach(
          specialties,
          prisma.specialty,
          prisma.createSpecialty
        );
      }

      return await prisma.createCompany({
        name,
        logoURL,
        website,
        linkedin,
        overview,
        headquarters,
        companySize,
        services: { connect: services },
        specialties: { connect: specialties },
      });
    },
    updateCompany: async (parent, args, { prisma }, info) => {
      const {
        updated_name,
        updated_logoURL,
        updated_website,
        updated_linkedin,
        updated_overview,
        updated_headquarters,
        updated_companySize,
        updated_services,
        updated_specialties,
        name,
      } = args;

      // If front-end provides updated_services, we remove the old services, thinking
      // that the user is providing a new list to replace the old one.
      // If user provides and empty array, all current services will be removed.
      // If user does not provide updated_services array, nothing happens.
      if (updated_services) {
        await oldItemRemover(
          name, // Company Name
          "services", // What table to remove items from
          prisma.company({ name }).services, // Function for listing old items
          prisma.updateCompany // Function to update company and disconnect old records
        );
      }

      // Same process for updated_specialties
      if (updated_specialties) {
        await oldItemRemover(
          name,
          "specialties",
          prisma.company({ name }).specialties,
          prisma.updateCompany
        );
      }

      // If the service is not in DB, add it
      if (updated_services) {
        await asyncForEach(
          updated_services,
          prisma.service,
          prisma.createService
        );
      }

      if (updated_specialties) {
        await asyncForEach(
          updated_specialties,
          prisma.specialty,
          prisma.createSpecialty
        );
      }

      return await prisma.updateCompany({
        data: {
          name: updated_name,
          logoURL: updated_logoURL,
          website: updated_website,
          linkedin: updated_linkedin,
          overview: updated_overview,
          headquarters: updated_headquarters,
          companySize: updated_companySize,
          services: { connect: updated_services },
          specialties: { connect: updated_specialties },
        },
        where: { name },
      });
    },
    deleteCompany: (parent, { name }, { prisma }, info) => {
      return prisma.deleteCompany({ name });
    },
  },
  Company: {
    studies: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).studies();
    },
    services: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).services();
    },
    specialties: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).specialties();
    },
  },
};
