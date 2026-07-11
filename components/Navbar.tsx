"use client";

import { SignInButton, SignUpButton, UserButton, useUser } from "@clerk/nextjs";
import {
  ArrowLeft,
  ArrowRight,
  Filter,
  MoreHorizontal,
  Share2,
  Trello,
} from "lucide-react";
import { Button } from "./ui/button";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Badge } from "./ui/badge";
interface Props {
  boardTitle?: string;
  onEditBoard?: () => void;
  onFilterClick?: () => void;
  filterCount?: number;
}

const Navbar = ({
  boardTitle,
  onEditBoard,
  onFilterClick,
  filterCount = 0,
}: Props) => {
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
              {user?.fullName ?? user?.emailAddresses[0]?.emailAddress}
            </span>
            <UserButton />
          </div>
        </div>
      </header>
    );
  }

  if (isBoardPage) {
    return (
      <header className="bg-white border-b sticky top-0 z-50 flex items-center mx-auto px-3 sm:px-5">
        <div className="container  mx-auto px-4 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            {/* -------------Board Title/Color Edit------ */}
            <section className="flex items-center space-x-2 sm:space-x-4 min-w-0">
              <Link
                href="/dashboard"
                className="flex items-center space-x-1  text-gray-600 hover:text-gray-800 shrink-0 hover:cursor-pointer"
              >
                <ArrowLeft className="h-4 w-4 sm:h-5 sm:w-5" />
                <span className="hidden sm:inline">Back To Dashboard</span>
                <span className="sm:hidden">Back</span>
              </Link>
              <div className="h-4 sm:h-6 w-px bg-gray-300 hidden sm:block" />
              <div className="flex items-center space-x-1 sm:space-x-2 min-w-0">
                <Trello className="text-green-600 " />
                <div className="text-lg items-center space-x-1 sm:space-x-2 min-w-0">
                  <span className="text-lg font-bold text-gray-900 truncate">
                    {boardTitle}
                  </span>
                  {onEditBoard && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 w-7 shrink-0 p-0 cursor-pointer"
                      onClick={onEditBoard}
                    >
                      <MoreHorizontal />
                    </Button>
                  )}
                </div>
              </div>
            </section>
            {/* -----------Filter Tasks ----------*/}
            <section className="flex items-center space-x-2 sm:space-x-4 shrink-0">
              {onFilterClick && (
                <Button
                  variant="outline"
                  size="sm"
                  className={` text-xs sm:text-sm cursor-pointer ${filterCount > 0 ? "bg-green-400 border-green-200 text-white hover:bg-green-500 hover:text-white" : ""}`}
                  onClick={onFilterClick}
                >
                  <Filter className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2 " />
                  <span className="hidden sm:inline ">Filter</span>
                  {filterCount > 0 && (
                    <Badge
                      variant="secondary"
                      className="text-xs ml-1 sm:ml-2 bg-green-400 border-white text-white"
                    >
                      {filterCount}
                    </Badge>
                  )}
                </Button>
              )}
            </section>
          </div>
        </div>
        <div className="hidden sm:inline">
          <UserButton />
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
