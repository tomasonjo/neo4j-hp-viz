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
        loyalty(options:{limit:5}) {
            name
        }
        house {
            name
        }
        family(options:{limit:5}) {
            name
        }
    }
    }
`;

const CHARACTER_QUERY = gql`
    query explore($name: String) {
    characters(where: { name: $name }) {
        name
        nationality
        url
        species
        gender
    }
    }
`;

function Exploration() {
    const client = useApolloClient()
    const [nodeObject, setNodeObject] = useState();
    const [edgeObject, setEdgeObject] = useState();
    const [allNodes, setAllNodes] = useState([]);
    const [allEdges, setAllEdges] = useState([]);
    const [currentNode, setCurrentNode] = useState([]);
    const [fetchSingleCharacterData, { data: characterData }] = useLazyQuery(CHARACTER_QUERY)
    const [fetchCharacterData, { loading, data }] = useLazyQuery(EXPLORATION_QUERY, {
        onCompleted: data => {
            // Clear existing data
            // Clear VisJS objects
            edgeObject.clear()
            nodeObject.clear()

            // Clear state objects
            setAllNodes([])
            setAllEdges([])

            // Append data
            let characterData = data.characters[0]

            // Append starting node
            let startNode = characterData.name
            nodeObject.add({ id: startNode, label: startNode, group: 'Character' })
            setAllNodes(oldArray => [...oldArray, startNode])
            // Append family node & edges
            let familyNodes = characterData.family && characterData.family
            familyNodes.map((el) => {
                nodeObject.add({ id: el.name, label: el.name, group: 'Character' })
                setAllNodes(oldArray => [...oldArray, el.name]);

                edgeObject.add({ from: startNode, to: el.name, label: 'FAMILY_MEMBER' })
                setAllEdges(oldArray => [...oldArray, startNode + el.name])
            })
            // Append house node
            let houseNode = characterData.house && characterData.house.name
            if (houseNode) {
                let houseId = 'house' + houseNode
                nodeObject.add({ id: houseId, label: houseNode, group: 'House' })
                setAllNodes(oldArray => [...oldArray, houseId]);
                edgeObject.add({ from: startNode, to: houseId, label: 'HOUSE' })
                setAllEdges(oldArray => [...oldArray, startNode + houseId])
            }
            // Append group nodes
            let loyaltyNodes = characterData.loyalty && characterData.loyalty
            loyaltyNodes.map((el) => {
                const groupId = 'group' + el.name
                nodeObject.add({ id: groupId, label: el.name, group: 'Group' })
                setAllNodes(oldArray => [...oldArray, groupId]);

                edgeObject.add({ from: startNode, to: groupId, label: 'LOYAL' })
                setAllEdges(oldArray => [...oldArray, startNode + groupId])
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

    const getNetwork = (network) => {
        const localNetwork = network
        localNetwork.on('click', (params) => {
            const current = params.nodes[0]
            fetchSingleCharacterData({ variables: { name: current } })
            setCurrentNode(current)
        })
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

    const expandRelationships = async () => {

        const rels = await client.query({
            query: EXPLORATION_QUERY,
            variables: { name: currentNode }
        })

        if (rels.data && rels.data.characters) {
            let d = rels.data.characters

            // Append data
            let characterData = rels.data.characters[0]

            let startNode = characterData.name
            // Append family node & edges
            let familyNodes = characterData.family && characterData.family
            familyNodes.map((el) => {
                if (!allNodes.includes(el.name)) {
                    nodeObject.add({ id: el.name, label: el.name, group: 'Character' })
                    setAllNodes(oldArray => [...oldArray, el.name]);
                }
                if (!allEdges.includes(startNode + el.name)){
                    edgeObject.add({ from: startNode, to: el.name, label: 'FAMILY_MEMBER' })
                    setAllEdges(oldArray => [...oldArray, startNode + el.name])
                }
            })
            // Append house node
            let houseNode = characterData.house && characterData.house.name
            if (houseNode) {
                let houseId = 'house' + houseNode
                if (!allNodes.includes(houseId)){
                    nodeObject.add({ id: houseId, label: houseNode, group: 'House' })
                    setAllNodes(oldArray => [...oldArray, houseId]);
                }
                if (!allEdges.includes(startNode + houseId)){
                    edgeObject.add({ from: startNode, to: houseId, label: 'HOUSE' })
                    setAllEdges(oldArray => [...oldArray, startNode + houseId])
                }
            }
            // Append group nodes
            let loyaltyNodes = characterData.loyalty && characterData.loyalty
            loyaltyNodes.map((el) => {
                const groupId = 'group' + el.name
                if (!allNodes.includes(groupId)){
                    nodeObject.add({ id: groupId, label: el.name, group: 'Group' })
                    setAllNodes(oldArray => [...oldArray, groupId]);
                }
                if (!allEdges.includes(startNode + groupId)){
                    edgeObject.add({ from: startNode, to: groupId, label: 'LOYAL' })
                    setAllEdges(oldArray => [...oldArray, startNode + groupId])
                }
            })
        }


    }


    const defaultOptions = ['Harry Potter', 'Hermione Granger', 'Ronald Weasley'].map((el) => ({ label: el, value: el }))


    return (
        <div>
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
                getNetwork={getNetwork}
                style={{ height: "65vh" }}
            />
            {characterData && characterData.characters ? <div style={{ display: 'flex', flexDirection: 'column' }}>
                <li>{`name: ${characterData.characters[0].name}`}</li>
                <li>{`gender: ${characterData.characters[0].gender}`}</li>
                <li>{`nationality: ${characterData.characters[0].nationality}`}</li>
                <li>{`species: ${characterData.characters[0].species}`}</li>
                <li>{`url: ${characterData.characters[0].url}`}</li>
                <button onClick={expandRelationships}>Expand Relationships</button>
            </div> : null}
        </div>
    )
}

export default Exploration