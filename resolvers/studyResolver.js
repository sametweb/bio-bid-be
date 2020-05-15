module.exports = {
    Query: {
        studies: (parent, args, {prisma}, info) => {
            return prisma.studies();
        }
    },
    Mutation: {
        createStudy: (parent, args, {prisma}, info) => {
            const {name, area, phase, status, company_name} = args;
            return prisma.createStudy({name, area, phase, status, company: {connect: {name: company_name}}})
        },
        updateStudy: (parent, args, {prisma}, info) => {
            const {updatedStudy_name, area, phase, study_name} = args;
            return prisma.updateStudy({data: {name: updatedStudy_name, area, phase}, where: {name: study_name}});
        },
        deleteStudy: (parent, {study_name}, {prisma}, info) => {
            return prisma.deleteStudy({name: study_name});
        },
    },
    Study: {
        company: (parent, args, {prisma}, info) => {
            return prisma.study({id: parent.id}).company();
        }
    }
}