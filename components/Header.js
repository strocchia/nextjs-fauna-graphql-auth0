// components/header.js

import Link from "next/link";
import { useRouter } from "next/router";

import { useUser } from "@auth0/nextjs-auth0";

const Header = () => {
  const router = useRouter();

  const { user, error, isLoading } = useUser();

  if (isLoading) return <div>Header loading...</div>;

  return (
    <div>
      <header>
        <nav>
          <div className="flex flex-wrap justify-evenly">
            {user && (
              <>
                <div className="space-x-12">
                  <Link href="/">
                    <a className="mt-3 inline-block bg-red-800 hover:bg-red-900 text-white font-bold p-2 rounded">
                      Home
                    </a>
                  </Link>
                  <Link href="/my-todos">
                    <a className="mt-3 inline-block bg-red-800 hover:bg-red-900 text-white font-bold p-2 rounded">
                      My Todos
                    </a>
                  </Link>
                  <Link href="/my-page">
                    <a className="mt-3 inline-block bg-red-800 hover:bg-red-900 text-white font-bold p-2 rounded">
                      My Page
                    </a>
                  </Link>
                </div>
                <div className="ml-4">
                  <span>
                    Hello,
                    <Link href="/user">
                      <a className="mt-3 inline-block text-green-600 hover:text-green-800 font-bold p-2">
                        {user.name || user.email}
                      </a>
                    </Link>
                  </span>
                  <Link href="/api/auth/logout">
                    <a
                      className="ml-3 mt-3 border border-gray-400 hover:border-gray-800 rounded-lg
                    px-2 py-1"
                    >
                      Logout
                    </a>
                  </Link>
                </div>
              </>
            )}
            {!user && (
              <div className="space-x-12">
                <Link href="/">
                  <a className="mt-3 inline-block bg-red-800 hover:bg-red-900 text-white font-bold p-2 rounded">
                    Home
                  </a>
                </Link>
                <Link href="/api/auth/login">
                  <a className="mt-3 inline-block text-green-600 hover:text-green-800 font-bold p-2 no-underline hover:underline">
                    Login or Signup
                  </a>
                </Link>
              </div>
            )}
          </div>
        </nav>
      </header>
    </div>
  );
};

export default Header;
