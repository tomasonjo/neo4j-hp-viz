# neo4j-hp-viz

Start the project with:

```
docker-compose up
```

## Seed data

Open Neo4j Browser at localhost:7474. Login using username "neo4j" and password "letmein".
Run the following two queries to seed the database.

Import characters

```
LOAD CSV WITH HEADERS FROM "file:///character_first_seen.csv" as row
MERGE (c:Character{name:row.name})
SET c.first_seen = toInteger(row.value)
```


Import interactions

```
LOAD CSV WITH HEADERS FROM "file:///rel_first_seen.csv" as row
MATCH (s:Character{name:row.source})
MATCH (t:Character{name:row.target})
MERGE (s)-[:INTERACTS]->(i:Interaction)-[:INTERACTS]->(t)
SET i.first_seen = toInteger(row.value)
```
