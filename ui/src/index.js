import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { ApolloClient, ApolloProvider, InMemoryCache } from "@apollo/client";

const AppWithApollo = () => {
  const client = new ApolloClient({
    uri: process.env.REACT_APP_GRAPHQL_URI || "http://localhost:4000/graphql",
    cache: new InMemoryCache(),
  });
  return (
    <ApolloProvider client={client}>
      <App />
    </ApolloProvider>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <AppWithApollo />
  </React.StrictMode>,
  document.getElementById("root")
);