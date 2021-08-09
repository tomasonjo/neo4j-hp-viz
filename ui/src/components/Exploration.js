import { React, useState } from "react";
import { gql, useLazyQuery, useApolloClient } from "@apollo/client";
import AsyncSelect from "react-select/async";
import Graph from 'vis-react';


const SEARCH_QUERY = gql`
    query search($characterSearch: String!){
        characterSearch(search: $characterSearch) {
        name
    }
   }
`;

const EXPLORATION_QUERY = gql`
    query explore($name: String) {
    characters(where: { name: $name }) {
        name
        nationality
        url
        loyalty(options:{limit:5}) {
            name
        }
        house {
            name
        }
        family(options:{limit:5}) {
            name
            nationality
            url
        }
    }
    }
`;

function Exploration() {
    const client = useApolloClient()
    const [nodeObject, setNodeObject] = useState();
    const [edgeObject, setEdgeObject] = useState();
    const [nodes, setNodes] = useState([]);
    const [edges, setEdges] = useState([])
    const [fetchCharacterData, { loading, data }] = useLazyQuery(EXPLORATION_QUERY, {
        onCompleted: data => {
            // Clear existing data
            // Clear VisJS objects
            nodeObject.clear()
            edgeObject.clear()

            // Clear State objects
            setNodes([])
            setEdges([])

            // Append data
            let characterData = data.characters[0]

            // Append starting node
            let startNode = characterData.name
            nodeObject.add({ id: startNode, label: startNode, group: 'Character' })
            // Append family node & edges
            let familyNodes = characterData.family && characterData.family
            familyNodes.map((el) => {
                nodeObject.add({ id: el.name, label: el.name, group: 'Character', title:'I have a tooltip' })
                edgeObject.add({ from: startNode, to: el.name, label: 'FAMILY_MEMBER' })
            })
            // Append house node
            let houseNode = characterData.house && characterData.house.name
            if (houseNode) {
                let houseId = 'house' + houseNode
                nodeObject.add({ id: houseId, label: houseNode, group: 'House' })
                edgeObject.add({ from: startNode, to: houseId, label: 'HOUSE' })
            }
            // Append group nodes
            let loyaltyNodes = characterData.loyalty && characterData.loyalty
            loyaltyNodes.map((el) => {
                const groupId = 'group' + el.name
                nodeObject.add({ id: groupId, label: el.name, group: 'Group' })
                edgeObject.add({ from: startNode, to: groupId, label: 'LOYAL' })
            })
        }
    });

    const graph = { nodes: [], edges: [] }

    const getEdges = (edges) => {
        setEdgeObject(edges)
    }

    const getNodes = (nodes) => {
        setNodeObject(nodes)
    }

    const fetchCharacters = async (input) => {
        if (input && input.trim().length < 3) {
            return [];
        }

        const res = await client.query({
            query: SEARCH_QUERY,
            variables: { characterSearch: input }
        })

        if (res.data && res.data.characterSearch) {
            return res.data.characterSearch.map(el => ({
                label: el.name,
                value: el.name
            }))
        }
    }

    const defaultOptions = ['Harry Potter', 'Hermione Granger', 'Ronald Weasley'].map((el) => ({label:el, value:el}))


    return (
        <div style={{ height: "80vh", width: "100%" }}>
            <h4>Search characters</h4>
            <AsyncSelect
                loadOptions={fetchCharacters}
                defaultOptions={defaultOptions}
                onChange={(opt) => fetchCharacterData({ variables: { name: opt.value } })}
                placeholder="Search a Character"
                className="select"
            />
            <Graph
                graph={graph}
                getEdges={getEdges}
                getNodes={getNodes}
            />
        </div>
    )
}

export default Exploration