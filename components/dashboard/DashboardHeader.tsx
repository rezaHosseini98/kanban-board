import { UserResource } from "@clerk/types";

export default function DashboardHeader({
  user,
}: {
  user: UserResource | null | undefined;
}) {
  return (
    <div className="mb-6 sm:mb-8">
      <h1 className="text-2xl sm:text-3xl text-gray-900 mb-2">
        Welcome back,{" "}
        <span className="font-bold">
          {user?.firstName ?? user?.emailAddresses[0].emailAddress}!
        </span>
        👋
      </h1>
      <p className="text-gray-600 text-sm sm:text-xl mb-3">
        Here's what's happening with your boards today.
      </p>
    </div>
  );
}
