const resolvers = {
    Query: {
        hello: () => "Hello World",
       studies: (parent, args, {prisma}, info) => {
        return prisma.studies();
       },
       companies: (parent, args, {prisma}, info) => {
           return prisma.companies();
       }
    },
    Study: {
        company: (parent, args, {prisma}, info) => {
         return prisma.study({id: parent.id}).company();
        },
    },
    Company: {
        studies: (parent, args, {prisma}, info) => {
            return prisma.studies();
        }
    }
}

module.exports = resolvers;