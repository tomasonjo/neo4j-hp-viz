import { React, useEffect, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import Graph from 'vis-react';


const QUERY = gql`
  query {
    interactions(options: { sort: [{ first_seen: ASC }] }) {
    first_seen
    source {
      name
    }
    target {
      name
    }
  }
  
  }
`;

const graph = {
    nodes: [
    ],
    edges: [
    ]
};



function App() {

    const [nodeObject, setNodeObject] = useState();
    const [edgeObject, setEdgeObject] = useState();
    const { loading, error, data } = useQuery(QUERY);

    const nodes = []

    const handleAdd = () => {
        data.interactions.forEach((x, i) => {
            setTimeout(() => {
            if (!nodes.includes(x.source.name)) {
                nodeObject.add({ id: x.source.name, label: x.source.name })
                nodes.push(x.source.name)
            }

            if (!nodes.includes(x.target.name)) {
                nodeObject.add({ id: x.target.name, label: x.target.name })
                nodes.push(x.target.name)
            }

            edgeObject.add({ from: x.source.name, to: x.target.name });

        }, 200)
    }
        )
    }

    const getEdges = (edges) => {
        setEdgeObject(edges)
    }

    const getNodes = (nodes) => {
        setNodeObject(nodes)
    }

    if (loading) {
        return "loading"
    }

    if (error) {
        return <div>error</div>
    }


    return <div style={{height:"100%", width:"100%"}}><Graph
        graph={graph}
        //options={options}
        //events={events}
        getEdges={getEdges}
        getNodes={getNodes}
    />
        <button onClick={handleAdd}>Add harry potter network</button>
    </div>
}

export default App;