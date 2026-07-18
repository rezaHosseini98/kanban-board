"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { createClient, SupabaseClient } from "@supabase/supabase-js";
import { useSession } from "@clerk/nextjs";
import DashboardSkelton from "@/components/skeleton/DashboardSkelton";
import LandingPageSkelton from "@/components/skeleton/LandingPageSkelton";

type SupabaseContext = {
  supabase: SupabaseClient | null;
  isLoaded: boolean;
};

const Context = createContext<SupabaseContext>({
  supabase: null,
  isLoaded: false,
});

export default function SupabaseProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const { session, isLoaded: clerkLoaded } = useSession();

  const [supabase, setSupabase] = useState<SupabaseClient | null>(null);

  useEffect(() => {
    if (!session) return;

    const client = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
      {
        accessToken: async () => session.getToken() ?? null,
      },
    );

    setSupabase(client);
  }, [session]);

  const isLoaded = clerkLoaded;

  return (
    <Context.Provider value={{ supabase, isLoaded }}>
      {!isLoaded ? <LandingPageSkelton /> : children}
    </Context.Provider>
  );
}

export const useSupabase = () => {
  const context = useContext(Context);

  if (!context) {
    throw new Error("useSupabase must be inside provider");
  }

  return context;
};
