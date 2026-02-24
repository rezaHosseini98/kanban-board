"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Share2 } from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";

const Navbar = () => {
  const { isSignedIn, user } = useUser();
  const pathname = usePathname();

  // Change nav for each page

  const isDashboardPage = pathname === "/dashboard";
  const isBoardPage = pathname.startsWith("/boards/");

  if (isDashboardPage) {
    return (
      <header className="border-b bg-white-80 backdrop-blur-sm sticky top-0 z-50">
        <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Share2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
            <span className="text-xl sm:text-2xl  text-gray-900">
              <span className="font-bold">RH</span>KanBan
            </span>
          </div>
          <div className="flex items-center space-x-2 sm:space-x-4 ">
            <span className="hidden sm:block text-xs sm:text-sm text-gray-700">
              {user?.fullName ?? user?.emailAddresses[0].emailAddress}
            </span>
            <UserButton />
          </div>
        </div>
      </header>
    );
  }

  return (
    <header className="border-b bg-white-80 backdrop-blur-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 sm:py-4 flex items-center justify-between">
        <div className="flex items-center space-x-2">
          <Share2 className="h-6 w-6 sm:h-8 sm:w-8 text-green-600" />
          <span className="text-xl sm:text-2xl  text-gray-900">
            <span className="font-bold">RH</span>KanBan
          </span>
        </div>
        <div className="flex items-center space-x-2 sm:space-x-4">
          {isSignedIn ? (
            <div className="flex flex-col sm:flex-row items-end sm:items-center space-y-1 sm:space-y-0 sm:space-x-4">
              <span className="hidden sm:block text-xs sm:text-sm text-gray-700">
                Welcome,{user.firstName ?? user.emailAddresses[0].emailAddress}
              </span>
              <Link href="/dashboard">
                <Button
                  size="sm"
                  className="bg-green-600 hover:bg-green-500 cursor-pointer text-xs sm:text-sm"
                >
                  Go to Dashboard
                  <ArrowRight />
                </Button>
              </Link>
            </div>
          ) : (
            <div>
              <SignInButton>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-xs sm:text-sm cursor-pointer "
                >
                  Sign In
                </Button>
              </SignInButton>
              <SignUpButton>
                <Button className="bg-green-600 cursor-pointer hover:bg-green-500">
                  Sign Up
                </Button>
              </SignUpButton>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
export default Navbar;
