const {books, authors} = require('./data.js');

const express = require('express');

const expressGraphQL = require('express-graphql').graphqlHTTP;

const { GraphQLSchema, GraphQLObjectType,
GraphQLString,
GraphQLNonNull,
GraphQLInt, 
GraphQLList} = require('graphql')
const app = express();



const AuthorType = new GraphQLObjectType({
name: 'Author',
description: 'This represents an author of a book',
fields: () => ({
id: { type: new GraphQLNonNull(GraphQLInt) },
name: { type: new GraphQLNonNull(GraphQLString) },
})
})

const BookType = new GraphQLObjectType({
    name: 'Book',
    fields: () => ({
        id: { type: new GraphQLNonNull(GraphQLInt) },
        name: { type: GraphQLString },
        authorId: { type: new GraphQLNonNull(GraphQLInt) },
        author: {
            type: AuthorType,
            resolve: (book) => {
                return authors.find(author => author.id === book.authorId)
            }

        }
    })
})



const RootQuery = new GraphQLObjectType({
    name: 'RootQueryType',
    fields: () => ({
        books : {
            type: new GraphQLList(BookType),
            resolve: () => books
        },
        authors: {
            type: new GraphQLList(AuthorType),
            resolve: () => authors
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