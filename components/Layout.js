// components/layout.js

import Head from "next/head";

import Header from "./Header";

const Layout = ({ title = "Next - Fauna - GraphQL - CRUD", children }) => (
  <>
    <Head>
      <title>{title}</title>
      <link rel="icon" href="/favicon.ico" />
    </Head>

    <main className="">
      <Header />
      <div className="py-12 mx-auto">{children}</div>
    </main>
  </>
);

export default Layout;
