"use client";
import Navbar from "@/components/Navbar";
import { useUser } from "@clerk/nextjs";

const page = () => {
  const { user } = useUser();
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <main className="container mx-auto px-4 py-6 sm:py-8">
        <div className="mb-6 sm:mb-8">
          <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">
            Welcome back,
            <span className="font-bold">
              {user?.firstName ?? user?.emailAddresses[0].emailAddress}
            </span>
            👋
          </h1>
          <p className="text-gray-600 text-sm sm:text-xl">
            Here's what's happening with your boards today.
          </p>
        </div>
      </main>
    </div>
  );
};
export default page;
