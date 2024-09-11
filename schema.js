export const typeDefs = `#graphql
    type Game {
        id: ID!
        title: String!
        platform: [String!]!
        reviews: [Review!]
    }

    type Review {
        id: ID!
        rating: Int!
        content: String!
        game: Game!
        author: Author!
    }

    type Author {
        id: ID!
        name: String!
        verified: Boolean!
        reviews: [Review!]
    }

    type Query {
        reviews: [Review]
        review(id: ID!): Review
        games: [Game]
        game(id: ID!): Game
        authors: [Author]
        author(id: ID!): Author
    }

    type Mutation {
        addGame(game: AddGameInput!): Game
        deleteGame(id: ID!): [Game]
        updateGame(id: ID!, edits: EditGameInput!): Game
    }

    input AddGameInput {
        title: String!,
        platform: [String!]!
    }
    
    input EditGameInput {
        title: String,
        platform: [String!]
    }
`

// int, float, string, boolean, ID <-- used by graphQL to link data
// ! <-- makes a property required

// Query type def is required for every graph schema as it specifies the entry points and
// return types of those entry points