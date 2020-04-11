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
            return prisma.createCompany({name: args.company_name});
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
            return prisma.updateCompany({data: {name: args.updated_name}, where: {name: args.company_name}});
        }
    }
}

module.exports = resolvers;