// // utils/graphql-client.js

import { GraphQLClient } from "graphql-request";

const FAUNA_GRAPHQL_BASE_URL = "https://graphql.fauna.com/graphql";

export const graphQLClient = () => {
  const secret = process.env.NEXT_PUBLIC_FAUNA_SECRET;

  return new GraphQLClient(FAUNA_GRAPHQL_BASE_URL, {
    headers: {
      authorization: `Bearer ${secret}`,
    },
  });
};
