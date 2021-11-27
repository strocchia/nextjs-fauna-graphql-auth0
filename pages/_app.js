import "../styles/globals.css";
import { UserProvider } from "@auth0/nextjs-auth0";

function MyApp({ Component, pageProps }) {
  return (
    <UserProvider>
      <div className="bg-yellow-50 w-full py-10 px-20 min-h-screen">
        {/* <div className="mx-auto max-w-screen-lg"> */}
        <div className="container">
          <Component {...pageProps} />
        </div>
      </div>
    </UserProvider>
  );
}

export default MyApp;
