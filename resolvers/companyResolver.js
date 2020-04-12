module.exports = {
    Query: {
        companies: (parent, args, {prisma}, info) => {
            return prisma.companies();
        }
    },
    Mutation: {
        createCompany: (parent, args, {prisma}, info) => {
            const {company_name} = args;
            return prisma.createCompany({name: company_name});
        },
        updateCompany: (parent, args, {prisma}, info) => {
            const {updated_name, company_name} = args;
            return prisma.updateCompany({data: {name: updated_name}, where: {name: company_name}});
        },
        deleteCompany: (parent, {company_name}, {prisma}, info) => {
            return prisma.deleteCompany({name: company_name});
        }
    },
    Company: {
        studies: (parent, args, {prisma}, info) => {
            return prisma.studies();
        }
    }
}