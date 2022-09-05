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
books: {
    type: new GraphQLList(BookType),
    resolve: (author)=>{

        return books.filter(book => book.authorId === author.id)
    }
}

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

        },
       
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
        },
        book:{
            type: BookType,
            args:{
                id:{type:GraphQLInt}
            },
            resolve:(parent,args)=>{
                return books.find(book=> book.id === args.id)
            }
        }
    })
})


const RootMutationType = new GraphQLObjectType({
    name: 'Mutation',
    description: 'Root Mutation',
    fields: () => ({
        addBook: {
            type: BookType,
            description: 'Add a book',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) },
                authorId: { type: new GraphQLNonNull(GraphQLInt) }
            },
            resolve: (parent, args) => {
                const book = { id: books.length + 1, name: args.name, authorId: args.authorId };
                books.push(book);
                return book;
            }
        },
        addAuthor: {
            type: AuthorType,
            description:'Add an author',
            args: {
                name: { type: new GraphQLNonNull(GraphQLString) }
            },
            resolve: (parent, args) => {
                const author = { id: authors.length+1, name: args.name}
                authors.push(author);
                return author;

            }
        }
    })
})
const schema = new GraphQLSchema({
    query: RootQuery,
    mutation: RootMutationType
})




app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true
}))
app.listen(3000, () => {
    console.log('Server started on port 3000');
} );


// A graphQL schema is a collection of queries and mutations. These collections further contain fields defined by a type.
// The type can be primary or user defined. If a type contains non primary property, a resolve function should be defined to state what is returned when the property is called.