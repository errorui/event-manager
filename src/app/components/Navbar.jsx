"use client";
import Link from "next/link";
import { UseAuth } from "../context/useAuth";
import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Navbar() {
  const { user, signOut } = UseAuth();
  const router = useRouter();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="flex flex-col md:flex-row justify-between items-center p-5 bg-gray-800 text-white">
      <div className="text-lg font-bold mb-4 md:mb-0">
        <Link href="/">Event Manager</Link>
      </div>

      <button
        className="md:hidden p-2"
        onClick={() => setIsOpen(!isOpen)}
      >
        <svg
          className="w-6 h-6"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          xmlns="http://www.w3.org/2000/svg"
        >
          {isOpen ? (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          ) : (
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          )}
        </svg>
      </button>

      <div className={`flex-col md:flex-row md:flex ${isOpen ? 'flex' : 'hidden'} md:items-center space-y-4 md:space-y-0 md:space-x-4`}>
        {user ? (
          <>
            <Link href="/dashboard">
              <button className="text-white font-bold py-2 px-4 rounded">
                Dashboard
              </button>
            </Link>
            <Link href="/user">
              <button className="text-white font-bold py-2 px-4 rounded">
                Profile
              </button>
            </Link>
            <button
              onClick={() => {
                signOut();
                router.push('/');
              }}
              className="text-white font-bold py-2 px-4 rounded"
            >
              Sign Out
            </button>
          </>
        ) : (
          <>
            <Link href="/login">
              <button className="text-white font-bold py-2 px-4 rounded">
                Login
              </button>
            </Link>
            <Link href="/signup">
              <button className="text-white font-bold py-2 px-4 rounded">
                Signup
              </button>
            </Link>
          </>
        )}
      </div>
    </nav>
  );
}
