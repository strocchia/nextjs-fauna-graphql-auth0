import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import Layout from "../components/Layout";
import FormattedNote from "../components/FormattedNote";

import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";

import { getSession, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";

const MyNotes = ({ user }) => {
  // const { user, error, isLoading } = useUser();

  const variables = {
    owner: user?.sub,
  };

  const fetcher = async (query) => graphQLClient().request(query, variables);

  const { data, error, mutate } = useSWR(
    [
      gql`
        query MyNotes($owner: String!) {
          note_by_user(owner: $owner) {
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
      user?.sub,
    ],
    fetcher
  );

  const onDelete = (id) => {
    console.log(id);
  };

  // if (!user) return <Layout>Waiting</Layout>;

  if (error) return <Layout>{error.message}</Layout>;

  if (!data) return <Layout>retrieving data...</Layout>;

  return (
    <Layout title="My Notes">
      <h2 className="text-center text-2xl mb-4">My Notes</h2>
      {user && (
        <div className="mt-4 mb-8">
          <Link href="/new-note">
            <a className="font-semibold hover:underline">Create New Note</a>
          </Link>
        </div>
      )}
      <div>
        {data?.note_by_user.data.map((d, idx) => {
          return (
            <FormattedNote key={d._id || idx} user={user} onenote={d} triggerMutate={mutate} />
          );
        })}
      </div>
    </Layout>
  );
};

export default MyNotes;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const session = getSession(req, res);

    const query = gql`
      query MyNotes($owner: String!) {
        note_by_user(owner: $owner) {
          data {
            _id
            title
            content
            owner
          }
        }
      }
    `;

    const data = await graphQLClient().request(query, { owner: session.user.sub });

    return {
      props: {
        user: session.user,
        data_ssr: data.note_by_user.data,
      },
    };
  },
});
