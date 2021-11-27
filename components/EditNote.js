// components/edit-note.js

import { useState, useEffect } from "react";
import Router from "next/router";
import Link from "next/link";
import { gql } from "graphql-request";
import { useForm } from "react-hook-form";
import Layout from "../components/Layout";
// import utilStyles from "../styles/utils.module.css";
import { graphQLClient } from "../utils/graphql-client";

import "easymde/dist/easymde.min.css";
import { SimpleMdeReact } from "react-simplemde-editor";

const EditNote = ({ note, id }) => {
  const [value, setValue] = useState(note.content || "");

  const [catchErrorMessage, setCatchErrorMessage] = useState("");

  const onChange = (value) => {
    setValue(value);
  };

  const {
    handleSubmit,
    register,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues: {
      ...note,
    },
  });

  const onSubmit = () =>
    handleSubmit(async (blah) => {
      setCatchErrorMessage("");

      console.log(blah);

      const query = gql`
        mutation Update($id: ID!, $title: String!, $content: String!) {
          updateNote(id: $id, data: { title: $title, content: $content }) {
            _id
            task
            completed
          }
        }
      `;

      const variables = {
        id: id,
        task: task,
        completed: completed,
      };

      try {
        await graphQLClient().request(query, variables);
        Router.push("/");
      } catch (error) {
        console.error(error);
        setCatchErrorMessage(error.message);
      }
    });

  return (
    <>
      <h1 className="mb-8 text-2xl">Edit-A-Note</h1>

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
          <SimpleMdeReact className="prose prose-md max-w-5xl" value={value} onChange={onChange} />
          {errors.content && (
            <span role="alert" style={{ color: "red", display: "block", margin: "1rem" }}>
              {errors.content.message}
            </span>
          )}
        </div>
        <div style={{ marginTop: "1rem", textAlign: "right" }}>
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-3 border-none rounded-md cursor-pointer mr-3"
            type="submit"
          >
            Update
          </button>
          <Link
            href="/"
            // type="reset"
            // className="bg-red-500 text-white p-2 border-none rounded-md cursor-pointer"
            // onClick={(e) => Router.push("/")}
          >
            {/* <a className="bg-red-500 text-white p-3 border-none rounded-md cursor-pointer"> */}
            <a className="mt-3 inline-block bg-red-500 hover:bg-red-800 text-white py-2 px-3 border-none rounded-md cursor-pointer mr-3">
              Cancel
            </a>
          </Link>
        </div>
      </form>
      {catchErrorMessage && (
        <p style={{ color: "#d32f2f", display: "block", margin: "1rem" }}>{catchErrorMessage}</p>
      )}
    </>
  );
};

export default EditNote;
