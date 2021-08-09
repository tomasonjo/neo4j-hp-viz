const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
const { ApolloServer } = require("apollo-server");

const typeDefs = `
    type Character @exclude(operations: [CREATE, UPDATE, DELETE]){
        name: String
        first_seen: Int
        url: String
        aliases: String
        nationality: String
        species: String
        gender: String
        house: House @relationship(type: "BELONGS_TO", direction: OUT)
        loyalty: [Group] @relationship(type: "LOYAL_TO", direction: OUT)
        family: [Character] @relationship(type: "FAMILY_MEMBER", direction: OUT)
        pagerank: Float
        community: Int
    }

    type House @exclude(operations: [CREATE, UPDATE, DELETE]){
        name: String
    }

    type Group @exclude(operations: [CREATE, UPDATE, DELETE]){
        name: String
    }

    type Interaction @exclude(operations: [CREATE, UPDATE, DELETE]){
        source: Character @relationship(type: "INTERACTS", direction: IN)
        target: Character @relationship(type: "INTERACTS", direction: OUT)
        first_seen: Int
    }

    type Query{
        characterSearch(search: String):[Character] @cypher(statement:"""
            CALL db.index.fulltext.queryNodes('characterSearch', $search + '*') YIELD node
            RETURN node LIMIT 5
        """)
    }
`;

const driver = neo4j.driver(
    "bolt://neo4j:7687",
    neo4j.auth.basic("neo4j", "letmein")
);

const neoSchema = new Neo4jGraphQL({ typeDefs, driver });

const server = new ApolloServer({
    schema: neoSchema.schema,
    context: ({ req }) => ({ req }),
});

server.listen(4000).then(() => console.log("Online"));