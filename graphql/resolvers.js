const resolvers = {
    Query: {
        hello: () => "Hello World",
       studies: (parent, args, {prisma}, info) => {
        return prisma.studies();
       }
    },
    Study: {
        company: (parent, args, {prisma}, info) => {
         return prisma.study({id: parent.id}).company();
        }
    }
}

module.exports = resolvers;