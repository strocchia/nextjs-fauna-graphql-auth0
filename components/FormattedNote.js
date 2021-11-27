import React, { useState } from "react";
import Link from "next/link";
import Router from "next/router";

import { gql } from "graphql-request";
import { graphQLClient } from "../utils/graphql-client";

import ReactMarkdown from "react-markdown";

const MarkdownContent = ({ content }) => {
  const [showNote, setShowNote] = useState(false);
  return (
    <>
      <button
        className="bg-gray-200 text-xs hover:bg-gray-300 font-bold py-1.5 px-2 rounded focus:outline-none focus:shadow-outline mb-2"
        type="submit"
        onClick={() => setShowNote(!showNote)}
      >
        {showNote ? "Hide the Note" : "Show the Note 👇"}
      </button>
      {showNote && (
        <div className="relative">
          <ReactMarkdown className="prose text-gray-800 bg-gray-200 rounded-md px-4 py-2">
            {content}
          </ReactMarkdown>
        </div>
      )}
    </>
  );
};

const FormattedNote = ({ user, onenote, triggerMutate }) => {
  const onDelete = async (idToDelete) => {
    const query = gql`
      mutation BeGone($id: ID!) {
        deleteNote(id: $id) {
          _id
          title
          content
        }
      }
    `;

    const variables = {
      id: idToDelete,
    };

    try {
      await graphQLClient().request(query, variables);
      triggerMutate();
      Router.push("/");
    } catch (error) {
      console.error(error);
      // setCatchErrorMessage(error.message);
    }
  };

  return (
    <div className="bg-gray-100 p-4 rounded-md my-2 shadow-lg">
      <div className="flex items-center justify-between mb-2">
        <h2 className="text-xl text-gray-800 font-bold">{onenote.title}</h2>
        <span className="font-bold text-xs text-red-800 px-2 py-1 rounded-lg ">
          {new Date(onenote._ts / 1000).toLocaleString()}
        </span>
      </div>
      {/* <p className="text-gray-900 mb-4">{onenote.content}</p> */}
      {/* <Code code={onenote.data.code} /> */}
      <MarkdownContent content={onenote.content} />
      {user && user.sub === onenote.owner && (
        <div className="mt-2">
          <Link href={`/note/${onenote._id}`}>
            <a className="text-blue-500 hover:text-blue-700 mr-2">Edit</a>
          </Link>
          <a
            onClick={() => onDelete(onenote._id)}
            className="text-red-500 hover:text-red-700 hover:font-semibold mr-2 cursor-pointer"
          >
            Delete
          </a>
        </div>
      )}
    </div>
  );
};

export default FormattedNote;
