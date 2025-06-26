import React, { createContext, useContext, useState, useEffect } from "react";
import supabase from "@/supabaseClient";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState({
    id: "0aa57eea-d614-47a2-88e1-da9ff05606c5",
  });
  const [loading, setLoading] = useState(true);

  // useEffect(() => {
  // Check for an existing session on mount
  // const session = supabase.auth.getSession();
  // session.then(({ data: { session } }) => {
  //   setUser(session?.user ?? null);
  //   setLoading(false);
  // });
  // // Listen for auth state changes
  // const { data: listener } = supabase.auth.onAuthStateChange(
  //   (_event, session) => {
  //     setUser(session?.user ?? null);
  //   }
  // );
  // return () => {
  //   listener?.subscription.unsubscribe();
  // };
  // }, []);

  // const login = async (email, password) => {
  //   const { error, data } = await supabase.auth.signInWithPassword({
  //     email,
  //     password,
  //   });
  //   if (error) throw error;
  //   setUser(data.user);
  //   return data.user;
  // };

  // const logout = async () => {
  //   await supabase.auth.signOut();
  //   setUser(null);
  // };

  const value = {
    user,
    // loading,
    // login,
    // logout,
    isAuthenticated: !!user,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
