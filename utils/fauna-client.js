import faunadb from "faunadb";

// used for any (auth'd or non-authenticated) requests
export const faunaClient = new faunadb.Client({
  secret: process.env.FAUNA_SECRET,
});
