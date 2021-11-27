// pages/new-note.js

import { useState } from "react";
import Router from "next/router";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { graphQLClient } from "../utils/graphql-client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { useUser } from "@auth0/nextjs-auth0";

const NewNote = () => {
  const [catchErrorMessage, setCatchErrorMessage] = useState("");

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, isLoading } = useUser();

  const onSubmit = handleSubmit(async ({ title, content }) => {
    setCatchErrorMessage("");

    const mutation = gql`
      mutation CreateANote($title: String!, $content: String!, $owner: String!) {
        createNote(data: { title: $title, content: $content, owner: $owner }) {
          _id
          title
          content
          _ts
          owner
        }
      }
    `;

    try {
      await graphQLClient().request(mutation, { title, content, owner: user.sub });
      Router.push("/");
    } catch (error) {
      console.error(error);
      setCatchErrorMessage(error.message);
    }
  });

  if (isLoading) return <Layout>Waiting for user information to load...</Layout>;

  return (
    <Layout title="New Note">
      <h1 className="mb-8 text-2xl">Create-A-Note</h1>

      <form
        onSubmit={onSubmit}
        style={{
          backgroundColor: "#eee",
          borderRadius: "8px",
          padding: "2rem",
        }}
      >
        <div className="mb-3">
          <label>Title</label>
          <input
            className="w-1/2 p-2 m-4 border border-solid border-gray-200"
            type="text"
            placeholder="Title goes here..."
            {...register("title", { required: "Title is required" })}
          />
          {errors.title && (
            <span role="alert" style={{ color: "red", display: "block", margin: "1rem" }}>
              {errors.title.message}
            </span>
          )}
        </div>
        <div className="mb-3">
          <label>Content</label>
          <textarea
            className="w-full p-2 m-2 border border-solid border-gray-200"
            rows={"5"}
            type="text"
            placeholder="Content goes here..."
            {...register("content", { required: "Title is required" })}
          />
          {errors.content && (
            <span role="alert" style={{ color: "red", display: "block", margin: "1rem" }}>
              {errors.content.message}
            </span>
          )}
        </div>
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button
            className="bg-blue-500 text-white p-2 border-none rounded-md cursor-pointer"
            type="submit"
          >
            Create
          </button>
        </div>
      </form>
      {catchErrorMessage && (
        <p style={{ color: "#d32f2f", display: "block", margin: "1rem" }}>{catchErrorMessage}</p>
      )}
    </Layout>
  );
};

export default NewNote;

export const getServerSideProps = withPageAuthRequired();
