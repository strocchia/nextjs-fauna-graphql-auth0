// pages/note/[id].js

import { useState } from "react";
import Router, { useRouter } from "next/router";
import useSWR from "swr";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import Layout from "../../components/Layout";
import { graphQLClient } from "../../utils/graphql-client";
import EditNote from "../../components/EditNote";

const Edit = () => {
  const [catchErrorMessage, setCatchErrorMessage] = useState("");

  const router = useRouter();
  const { id } = router.query;

  const variables = {
    id: id,
  };

  const fetcher = async (query) => await graphQLClient().request(query, variables);

  const query = gql`
    query FindByID($id: ID!) {
      findNoteByID(id: $id) {
        title
        content
      }
    }
  `;

  const { data, error } = useSWR([query, id], fetcher);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm({
    defaultValues: {},
  });

  if (error)
    return (
      <div>
        failed to load. <br />
        {error.message}
      </div>
    );
  if (!data) return <div>Loading...</div>;

  return (
    <Layout title="Edit">
      <EditNote note={data.findNoteByID} id={id} />
      {/* <EditForm note={data.findTodoByID} id={id} token={} /> */}
    </Layout>
  );
};

// export async function getServerSideProps({ req, res }) {
//   return null;
// }

export default Edit;
