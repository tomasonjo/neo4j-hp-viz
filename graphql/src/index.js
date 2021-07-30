const { Neo4jGraphQL } = require("@neo4j/graphql");
const neo4j = require("neo4j-driver");
const { ApolloServer } = require("apollo-server");

const typeDefs = `
    type Character @exclude(operations: [CREATE, UPDATE, DELETE]){
        name: String
        first_seen: Int
    }

    type Interaction @exclude(operations: [CREATE, UPDATE, DELETE]){
        source: Character @relationship(type: "INTERACTS", direction: IN)
        target: Character @relationship(type: "INTERACTS", direction: OUT)
        first_seen: Int
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