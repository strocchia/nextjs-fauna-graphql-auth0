import React from "react";
import { useUser } from "@auth0/nextjs-auth0";

import Layout from "../components/Layout";

export default function User() {
  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Loading...</div>;
  if (error) return <div>{error.message}</div>;

  return (
    <Layout>
      {user && (
        <div>
          <img width="40px" height="40px" src={user.picture} alt={user.name} />
          <h2>Name: {user.name}</h2>
          <p>E-mail: {user.email}</p>
        </div>
      )}
    </Layout>
  );
}
