// pages/new-note.js

import { useCallback, useState } from "react";
import Router from "next/router";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
import { graphQLClient } from "../utils/graphql-client";
import { withPageAuthRequired } from "@auth0/nextjs-auth0";

import { useUser } from "@auth0/nextjs-auth0";

import dynamic from "next/dynamic";
import "easymde/dist/easymde.min.css";

const SimpleMdeReact = dynamic(() => import("react-simplemde-editor"), { ssr: false });

const NewNote = () => {
  const [value, setValue] = useState("");

  const [catchErrorMessage, setCatchErrorMessage] = useState("");

  const onChange = useCallback((value) => {
    setValue(value);
  }, []);

  const {
    handleSubmit,
    register,
    formState: { errors },
  } = useForm();

  const { user, isLoading } = useUser();

  const onSubmit = handleSubmit(async ({ title }) => {
    setCatchErrorMessage("");

    if (!value) {
      setCatchErrorMessage("Content cannot be empty");
      return;
    }

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
      await graphQLClient().request(mutation, { title, content: value, owner: user.sub });
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
          <SimpleMdeReact
            className="prose prose-md max-w-5xl"
            value={value}
            onChange={onChange}
            // {...register("content", { required: "Some text is required" })}
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
