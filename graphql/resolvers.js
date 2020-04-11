const resolvers = {
    Query: {
       studies: (parent, args, {prisma}, info) => {
        return prisma.studies();
       },
       companies: (parent, args, {prisma}, info) => {
           return prisma.companies();
       },
       bids: (parent, args, {prisma}, info) => {
            return prisma.bids();
       }
    },
    Study: {
        company: (parent, args, {prisma}, info) => {
         return prisma.study({id: parent.id}).company();
        }
    },
    Company: {
        studies: (parent, args, {prisma}, info) => {
            return prisma.studies();
        }
    },
    Bid: {
        study: (parent, args, {prisma}, info) => {
           return prisma.bid({id: parent.id}).study();
        },
        company: (parent, args, {prisma}, info) => {
            return prisma.bid({id: parent.id}).company();
        }
    },
    Mutation: {
        createCompany: (parent, args, {prisma}, info) => {
            const {company_name} = args;
            return prisma.createCompany({name: company_name});
        },
        createStudy: (parent, args, {prisma}, info) => {
            const {name, area, phase, status, company_name} = args;
            return prisma.createStudy({name, area, phase, status, company: {connect: {name: company_name}}})
        },
        createBid: (parent, args, {prisma}, info) => {
            const {bid_amount, company_name, study_name} = args;
            return prisma.createBid({bid_amount, company: {connect: {name: company_name}}, study: {connect: {name: study_name}}});
        },
        updateCompany: (parent, args, {prisma}, info) => {
            const {updated_name, company_name} = args;
            return prisma.updateCompany({data: {name: updated_name}, where: {name: company_name}});
        },
        updateBid: (parent, args, {prisma}, info) => {
            const {bid_amount, is_approved, id} = args;
            return prisma.updateBid({data: {bid_amount, is_approved}, where: {id}});
        },
        updateStudy: (parent, args, {prisma}, info) => {
            const {updatedStudy_name, area, phase, study_name} = args;
            return prisma.updateStudy({data: {name: updatedStudy_name, area, phase}, where: {name: study_name}});
        }
    }
}

module.exports = resolvers;