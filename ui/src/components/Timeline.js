import { React, useState } from "react";
import { gql, useQuery } from "@apollo/client";
import CircularProgress from "@material-ui/core/CircularProgress";
import Button from '@material-ui/core/Button';
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
  // Node and edge object store VisJS dataset objects
  // that can be later used to manipulate existing graph
  const [nodeObject, setNodeObject] = useState();
  const [edgeObject, setEdgeObject] = useState();
  
  // Fetch network data from GraphQL endpoint 
  const { loading, error, data } = useQuery(QUERY);

  // Define an empty graph object as VisJS doesn't work
  // with a starting null graph object
  const graph = {
    nodes: [],
    edges: [],
  };

  const nodes = [];

  // Handle adding nodes and relationships to the VisJS graph object
  const handleAdd = () => {
    data.interactions.forEach((x, i) => {
      // The timeout is added so that every 200ms a new relationships is added
      // This introduces an animation-like network expansion
      setTimeout(() => {
        // VisJS breaks if you add a node id that already exists
        if (!nodes.includes(x.source.name)) {
          nodeObject.add({ id: x.source.name, label: x.source.name });
          nodes.push(x.source.name);
        }

        if (!nodes.includes(x.target.name)) {
          nodeObject.add({ id: x.target.name, label: x.target.name });
          nodes.push(x.target.name);
        }
        // Add the relationship to VisJS
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

  // VisJS visualization options
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
