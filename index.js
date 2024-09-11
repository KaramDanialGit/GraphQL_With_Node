import { ApolloServer } from '@apollo/server'
import { startStandaloneServer } from '@apollo/server/standalone'
import db from './_db.js'
import { typeDefs } from './schema.js'

const resolvers = {
    // Resolver functions for graph entry for query object
    Query: {
        games() {
            // dw about grabbing specific fields within games, apollo resolves that data 
            return db.games
        },
        // parent, args, and context are three args automatically given to us. Here we only need args
        game(_, args) {
            return db.games.find((game) => game.id === args.id)
        },
        authors() {
            return db.authors
        },
        author(_, args) {
            return db.authors.find((author) => author.id === args.id)
        },
        reviews() {
            return db.reviews
        },
        review(_, args) {
            return db.reviews.find((review) => review.id === args.id)
        }
    },

    // Reslover function for game object. So, apollo will execute the query resolver 
    // function for a game, then execute the resolver function in Game to retrieve 
    // another attribute connected to game (i.e. reviews)

    // Well, how do we access the id of the object (say game)? The parent argument!
    // The parent argument contains the value returned by the previous Query resolver

    Game: {
        reviews(parent) {
            return db.reviews.filter((review) => review.game_id === parent.id)
        }
    },
    Author: {
        reviews(parent) {
            return db.reviews.filter((review) => review.author_id === parent.id)
        }
    },
    Review: {
        author(parent) {
            return db.authors.find((author) => author.id === parent.author_id)
        },
        game(parent) {
            return db.games.find((game) => game.id === parent.game_id)
        }
    },

    // Resolver function for mutation. Notice we're using local data here but in reality we'd use MongoDB or 
    // some other database API
    Mutation: {
        deleteGame(_, args) {
            db.games = db.games.filter((game) => game.id !== args.id)

            return db.games
        },
        addGame(_, args) {
            let game = {
                ...args.game,
                id: Math.floor(Math.random() * 10000).toString()
            }
            db.games.push(game)

            return game
        },
        updateGame(_, args) {
            db.games = db.games.map((game) => {
                if (game.id === args.id) {
                    return { ...game, ...args.edits }
                }

                return game
            })

            return db.games.find((game) => game.id === args.id)
        }
    }
}

const server = new ApolloServer({
    typeDefs, // (containing graph schema)
    resolvers // (containing resolver functions)
})

const { url } = await startStandaloneServer(server, {
    listen: { port: 4000 }
})

console.log("Server ready at port", 4000)