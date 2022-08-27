const {books, authors} = require('./data.js');

const express = require('express');

const expressGraphQL = require('express-graphql').graphqlHTTP;

const { GraphQLSchema, GraphQLObjectType,
GraphQLString,
GraphQLNonNull,
GraphQLInt, 
GraphQLList} = require('graphql')
const app = express();



const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        authorId: { type: new GraphQLNonNull(GraphQLInt) }
    })
})

const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        books : {
            type: new GraphQLList(BookType),
            resolve: () => books
        }
    })
})

const schema = new GraphQLSchema({
    query: RootQuery
})




app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(3000, () => {
    console.log('Server started on port 3000');
} );