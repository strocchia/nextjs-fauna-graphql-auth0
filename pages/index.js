import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import Layout from "../components/Layout";

import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";

import { useUser } from "@auth0/nextjs-auth0";
import FormattedNote from "../components/FormattedNote";

export default function Home({ data_ssr }) {
  const { user, isLoading } = useUser();

  const fetcher = async (query) => await graphQLClient().request(query);

  const {
    data: notes,
    error: notes_error,
    mutate: notes_mutate,
  } = useSWR(
    gql`
      query GetNotes {
        allNotes(_size: 10) {
          data {
            _id
            title
            content
            owner
            _ts
          }
        }
      }
    `,
    fetcher
  );

  console.log(notes, data_ssr);

  return (
    <Layout>
      <h1 className="text-3xl mb-4">Next.js - FaunaDB - GraphQL CRUD App</h1>

      {user && (
        <Link href="/new-note">
          <a className="font-semibold">Create New Note</a>
        </Link>
      )}
      <div>
        {notes?.allNotes.data.map((note, idx) => (
          <FormattedNote
            key={note._id || idx}
            user={user}
            onenote={note}
            triggerMutate={notes_mutate}
          />
        ))}
      </div>
    </Layout>
  );
}

export async function getServerSideProps({ req, res }) {
  const query = gql`
    {
      allNotes(_size: 100) {
        data {
          _id
          title
          content
          owner
          _ts
        }
      }
    }
  `;

  const { allNotes } = await graphQLClient().request(query);

  return {
    props: {
      data_ssr: allNotes || null,
    },
  };
}
