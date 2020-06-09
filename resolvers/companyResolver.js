module.exports = {
  Query: {
    companies: (parent, args, { prisma }, info) => {
      return prisma.companies();
    },
    company: async (parent, { id }, { prisma }, info) => {
      if (!id) throw new Error("id is required");

      const found = await prisma.$exists.company({ id });
      if (!found) throw new Error("Company with that id does not exist...");

      return prisma.company({ id });
    },
    searchCompany: (parent, { search }, { prisma }, info) => {
      return prisma.companies({
        where: { name_contains: search },
      });
    },
  },
  Mutation: {
    createCompany: async (parent, args, { prisma }, info) => {
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

      const found = await prisma.$exists.company({ name });
      if (found) {
        throw new Error(
          `There is a company named '${name}' already, please enter a different name.`
        );
      }

      // Add specialties to SpecialtyItem table if they don't already exist
      args.services &&
        args.services.forEach((service) => {
          service.specialties &&
            service.specialties.forEach(async (specialty) => {
              await prisma.upsertSpecialtyItem({
                where: { name: specialty.name },
                create: { name: specialty.name },
                update: { name: specialty.name },
              });

              specialty.sub_specialties &&
                specialty.sub_specialties.forEach(async (sub) => {
                  await prisma.upsertSpecialtyItem({
                    where: { name: sub.name },
                    create: { name: sub.name },
                    update: { name: sub.name },
                  });
                });
            });
        });

      // Create "services" object with all nested specialty/sub-specialty relations
      const services = {
        create:
          args.services &&
          args.services.map((service) => {
            return {
              info: { connect: { name: service.name } },
              specialties: {
                create:
                  service.specialties &&
                  service.specialties.map((specialty) => {
                    return {
                      info: { connect: { name: specialty.name } },
                      sub_specialties: {
                        create:
                          specialty.sub_specialties &&
                          specialty.sub_specialties.map((sub) => {
                            return { info: { connect: { name: sub.name } } };
                          }),
                      },
                    };
                  }),
              },
            };
          }),
      };

      return prisma.createCompany({
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
    updateCompany: async (parent, args, { prisma }, info) => {
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

      // Make sure there is no other company with "updated_name"
      const found = await prisma.company({ name: updated_name });
      if (found.name && found.id !== id) {
        throw new Error(
          `There is a company named '${
            found.name
          }' already, please enter a different name.`
        );
      }

      // Deleting old tree of services, onDelete makes sure when service is deleted, all related fields are deleted.
      let servicesToBeDeleted = await prisma.company({ id }).services();
      servicesToBeDeleted = servicesToBeDeleted.map(({ id }) => id);
      await prisma.deleteManyServices({
        id_in: servicesToBeDeleted,
      });

      // Re-connecting the services, specialties, and sub_specialties to the company
      const services = {
        create:
          args.updated_services.map((service) => {
            return {
              info: { connect: { name: service.name } },
              specialties: {
                create:
                  service.specialties.map((specialty) => {
                    return {
                      info: { connect: { name: specialty.name } },
                      sub_specialties: {
                        create:
                          specialty.sub_specialties.map((sub) => {
                            return { info: { connect: { name: sub.name } } };
                          }) || [],
                      },
                    };
                  }) || [],
              },
            };
          }) || [],
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
    studies: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).studies();
    },
    services: (parent, args, { prisma }, info) => {
      return prisma.company({ id: parent.id }).services();
    },
    regions: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).regions();
    },
    therapeutics: ({ id }, args, { prisma }, info) => {
      return prisma.company({ id }).therapeutics();
    },
  },
};
