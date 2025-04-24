"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/lib/supabase";
import type { Session } from "@supabase/supabase-js";

// UserContext type with session and loading info
type UserContextType = {
  session: Session | null;
  user: Session["user"] | null;
  loading: boolean;
};

// Creating a context for managing the logged-in user
const UserContext = createContext<UserContextType | undefined>(undefined);

// Provider component that wraps the app and fetches session info from Supabase
export const UserProvider = ({ children }: { children: React.ReactNode }) => {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const init = async () => {
      const { data } = await supabase.auth.getSession();
      setSession(data.session);
      setLoading(false);
    };

    init();

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange((_event, newSession) => {
      setSession(newSession);
    });

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return (
    <UserContext.Provider
      value={{ session, user: session?.user ?? null, loading }}
    >
      {children}
    </UserContext.Provider>
  );
};

// Custom hook for using the UserContext in other components
export const useUser = () => {
  const context = useContext(UserContext);
  if (context === undefined) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
};
