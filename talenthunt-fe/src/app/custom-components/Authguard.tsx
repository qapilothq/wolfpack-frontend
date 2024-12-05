import React, { useEffect } from "react";
import { redirect } from "next/navigation";
import useStore from "../stores/store";

const AuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithAuth = (props: P) => {
    const { isLoggedIn, setIsLoggedIn } = useStore(); // Use zustand store

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window !== "undefined") {
          const authtoken = localStorage.getItem("authtoken");
          if (!authtoken) {
            setIsLoggedIn(false);
            redirect("/login");
          } else {
            setIsLoggedIn(true);
          }
        }
      };

      checkAuth();
    }, [setIsLoggedIn]);

    return isLoggedIn ? <WrappedComponent {...props} /> : null; // Use zustand state
  };

  return ComponentWithAuth;
};

export default AuthGuard;
