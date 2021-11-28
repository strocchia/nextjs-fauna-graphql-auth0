import React from "react";
import Image from "next/image";
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
          <img className="mb-2" src={user.picture} alt={user.nickname} width={40} height={40} />
          <h2 className="text-xl mb-2">Name: {user.name}</h2>
          <p>
            E-mail: <span className="italic">{user.email}</span>
          </p>
        </div>
      )}
    </Layout>
  );
}
