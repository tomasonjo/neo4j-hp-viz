import { React, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from "@material-ui/core/Button";
import Graph from "vis-react";

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

function Timeline() {
    const [nodeObject, setNodeObject] = useState();
    const [edgeObject, setEdgeObject] = useState();
    const { loading, error, data } = useQuery(QUERY);
    const graph = {
        nodes: [],
        edges: [],
    };

    const nodes = [];

    const handleAdd = () => {
        data.interactions.forEach((x, i) => {
            setTimeout(() => {
                if (!nodes.includes(x.source.name)) {
                    nodeObject.add({ id: x.source.name, label: x.source.name });
                    nodes.push(x.source.name);
                }

                if (!nodes.includes(x.target.name)) {
                    nodeObject.add({ id: x.target.name, label: x.target.name });
                    nodes.push(x.target.name);
                }

                edgeObject.add({ from: x.source.name, to: x.target.name });
            }, 200 * i);
        });
    };

    const getEdges = (edges) => {
        setEdgeObject(edges);
    };

    const getNodes = (nodes) => {
        setNodeObject(nodes);
    };

    if (loading) {
        return <CircularProgress />;
    }

    if (error) {
        return <div>{error}</div>;
    }

    const options = {
        edges: {
            arrows: {
                to: {
                    enabled: false,
                },
            },
        },
        nodes: {
            shape: "dot",
        },
        physics: {
            barnesHut: {
                springConstant: 0.0,
                avoidOverlap: 0.2,
            },
        },
    };

    return (
        <div>
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                <Button variant="contained" color="primary" onClick={handleAdd}>
                    Start network timeline visualization
                </Button>
            </div>
            <Graph
                graph={graph}
                options={options}
                getEdges={getEdges}
                getNodes={getNodes}
                style={{ height: "80vh" }}
            />
        </div>
    );
}

export default Timeline;
