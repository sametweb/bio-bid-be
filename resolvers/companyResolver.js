module.exports = {
  Query: {
    companies: (parent, args, { prisma, user }, info) => {
      return prisma.companies();
    },
    company: async (parent, { id }, { prisma }, info) => {
      if (!id) throw new Error("id is required");

      const found = await prisma.$exists.company({ id });
      if (!found) throw new Error("Company with that id does not exist...");

      return prisma.company({ id });
    },
    searchCompanies: (parent, { search }, { prisma }, info) => {
      if (search.length < 3) {
        throw new Error("Please enter a search term at least 3 characters");
      }

      return prisma.companies({
        where: { name_contains: search },
      });
    },
  },
  Mutation: {
    createCompany: async (parent, args, { prisma, servMapper }, info) => {
      if (!args.regions) args.regions = [];
      if (!args.therapeutics) args.therapeutics = [];
      if (!args.services) args.services = [];

      const {
        name,
        email,
        phases,
        logoURL,
        website,
        linkedin,
        overview,
        headquarters,
        companySize,
        regions,
        therapeutics,
      } = args;

      if (!name) {
        throw new Error("You must provide a name to create a company");
      }

      const found = await prisma.$exists.company({ name });
      if (found) {
        throw new Error(
          `There is a company named '${name}' already, please enter a different name.`
        );
      }

      // Add specialties to SpecialtyItem table if they don't already exist
      args.services &&
        args.services.forEach((service) => {
          !service.specialties
            ? []
            : service.specialties.forEach(async (specialty) => {
                const data = {
                  create: { name: specialty.name },
                  update: { name: specialty.name },
                  where: { name: specialty.name },
                };

                !specialty.sub_specialties
                  ? []
                  : specialty.sub_specialties.forEach(async (sub) => {
                      const data = {
                        create: { name: sub.name },
                        update: { name: sub.name },
                        where: { name: sub.name },
                      };
                      // sub_specialties
                      await prisma.upsertSpecialtyItem(data);
                    });
                // specialties
                await prisma.upsertSpecialtyItem(data);
              });
        });

      // Create "services" object with all nested specialty/sub-specialty relations
      const services = {
        create: Array.isArray(args.services) && args.services.map(servMapper),
      };

      return await prisma.createCompany({
        name,
        email,
        phases: { set: phases },
        logoURL,
        website,
        linkedin,
        overview,
        headquarters,
        companySize,
        services,
        regions: { connect: regions },
        therapeutics: { connect: therapeutics },
      });
    },
    updateCompany: async (parent, args, { prisma, servMapper }, info) => {
      const {
        updated_name,
        updated_email,
        updated_phases,
        updated_logoURL,
        updated_website,
        updated_linkedin,
        updated_overview,
        updated_headquarters,
        updated_companySize,
        updated_regions,
        updated_therapeutics,
        id,
      } = args;

      if (!id) {
        throw new Error("You must provide id");
      }

      // Make sure updated_name is not empty
      if (!updated_name) {
        throw new Error("You must enter a company name");
      }

      // Make sure there is no other company with "updated_name"
      const found = await prisma.company({ name: updated_name });
      if (found && found.id !== id) {
        throw new Error(
          `There is a company named '${
            found.name
          }' already, please enter a different name.`
        );
      }

      // Deleting old tree of services, onDelete makes sure when service is deleted, all related fields are deleted.
      let servicesToBeDeleted = await prisma.company({ id }).services();
      if (Array.isArray(servicesToBeDeleted)) {
        await prisma.deleteManyServices({
          id_in: servicesToBeDeleted.map(({ id }) => id),
        });
      }

      args.updated_services &&
        args.updated_services.forEach((service) => {
          !service.specialties
            ? []
            : service.specialties.forEach(async (specialty) => {
                const data = {
                  create: { name: specialty.name },
                  update: { name: specialty.name },
                  where: { name: specialty.name },
                };

                !specialty.sub_specialties
                  ? []
                  : specialty.sub_specialties.forEach(async (sub) => {
                      const data = {
                        create: { name: sub.name },
                        update: { name: sub.name },
                        where: { name: sub.name },
                      };
                      // sub_specialties
                      await prisma.upsertSpecialtyItem(data);
                    });
                // specialties
                await prisma.upsertSpecialtyItem(data);
              });
        });

      // Re-connecting the services, specialties, and sub_specialties to the company
      const services = {
        create:
          Array.isArray(args.updated_services) &&
          args.updated_services.map(servMapper),
      };

      return await prisma.updateCompany({
        data: {
          name: updated_name,
          email: updated_email,
          phases: { set: updated_phases },
          logoURL: updated_logoURL,
          website: updated_website,
          linkedin: updated_linkedin,
          overview: updated_overview,
          headquarters: updated_headquarters,
          companySize: updated_companySize,
          services,
          regions: { connect: updated_regions },
          therapeutics: { connect: updated_therapeutics },
        },
        where: { id },
      });
    },
    deleteCompany: (parent, { id }, { prisma }, info) => {
      return prisma.deleteCompany({ id });
    },
  },
  Company: {
    // studies: ({ id }, args, { prisma }, info) => {
    //   return prisma.company({ id }).studies();
    // },
    services: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).services();
    },
    regions: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).regions();
    },
    therapeutics: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).therapeutics();
    },
  },
};
