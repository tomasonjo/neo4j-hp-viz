import { React, useState, useEffect } from "react";
import { gql, useQuery } from "@apollo/client";
import Graph from 'vis-react';

const NODE_QUERY = gql`
    query nodes {
  characters(where: { pagerank_GT: 0.16 }) {
    name
    pagerank
    community
  }
}
`

const REL_QUERY = gql`
        query rels{
            interactions{
            source {
            name
            }
            target {
            name
            }
        }
   }
`;

function Community() {
    const { loading: nodeLoading, data: nodeData } = useQuery(NODE_QUERY);
    const { loading: relLoading, data: relData } = useQuery(REL_QUERY);
    const [graph, setGraph] = useState({ nodes: [], edges: [] })

    useEffect(() => {

        if (!nodeLoading && !relLoading) {

            setGraph({
                nodes: nodeData.characters.map(el => ({ id: el.name, label: el.name, group: el.community, value: el.pagerank})),
                edges: relData.interactions.map(el => ({ from: el.source.name, to: el.target.name })),
                rand: Math.random().toString()
            })
        }
    }, [nodeData, relData])

    if (nodeLoading || relLoading) {
        return "loading"
    }

    const options = {
        edges: {
            arrows: {
                to:{
                    enabled:false
                }
            },
            color:{
                opacity:0.6
            }
        },
        nodes:{
            shape:'dot'
        },
        physics: {
            barnesHut: {
                springConstant: 0,
                avoidOverlap: 0.2
              }
        }
    }

    return (
        <div>
            <Graph
                key={graph.rand}
                graph={graph}
                style={{ height: "85vh" }}
                options={options}
            />
        </div>
    )
}

export default Community