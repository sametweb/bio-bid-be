module.exports = {
    Query: {
        bids: (parent, args, {prisma}, info) => {
            return prisma.bids();
       }
    },
    Mutation: {
        createBid: (parent, args, {prisma}, info) => {
            const {bid_amount, company_name, study_name} = args;
            return prisma.createBid({bid_amount, company: {connect: {name: company_name}}, study: {connect: {name: study_name}}});
        },
        updateBid: (parent, args, {prisma}, info) => {
            const {bid_amount, is_approved, id} = args;
            return prisma.updateBid({data: {bid_amount, is_approved}, where: {id}});
        },
        deleteBid: (parent, {id}, {prisma}, info) => {
            return prisma.deleteBid({id});
        },
    },
    Bid: {
        study: (parent, args, {prisma}, info) => {
           return prisma.bid({id: parent.id}).study();
        },
        company: (parent, args, {prisma}, info) => {
            return prisma.bid({id: parent.id}).company();
        }
    }
}