import Head from "next/head";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Home.module.css";

import Layout from "../components/Layout";

import useSWR from "swr";
import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";

import { getSession, useUser, withPageAuthRequired } from "@auth0/nextjs-auth0";

const MyPage = ({ user }) => {
  // const { user, error, isLoading } = useUser();

  const variables = {
    owner: user?.sub,
  };

  const fetcher = async (query) => graphQLClient().request(query, variables);

  const { data, error } = useSWR(
    [
      gql`
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
    <Layout title="JSON notes">
      <p>Notes (in JSON form)</p>
      {data.note_by_user.data.map((d, idx) => {
        const { _id, title, content } = d;

        return (
          <div className="mb-8" key={d._id}>
            <pre>{JSON.stringify({ _id, title, content }, null, 2)}</pre>
            <span className="border-r-2 border-gray-400 py-1 px-2 ml-8">
              <Link href={`/note/${d._id}`}>
                <a>Edit</a>
              </Link>
            </span>
            <span className="border-l-2 border-gray-400 py-1 px-2 ml-8 cursor-pointer">
              <a onClick={() => onDelete(d._id)}>Delete</a>
            </span>
          </div>
        );
      })}
    </Layout>
  );
};

export default MyPage;

export const getServerSideProps = withPageAuthRequired({
  async getServerSideProps({ req, res }) {
    const session = await getSession(req, res);

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
