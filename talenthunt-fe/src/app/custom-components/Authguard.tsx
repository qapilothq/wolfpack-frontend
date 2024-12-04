import React, { useEffect } from "react";
import { useRouter } from "next/router";
// import { redirect } from "next/dist/server/api-utils";
import { redirect } from "next/navigation";

const isAuthenticated = () => {
  return !!localStorage.getItem("logtoken");
};

const AuthGuard = (WrappedComponent: React.ComponentType) => {
  const ComponentWithAuth = (props: any) => {
    useEffect(() => {
      if (!isAuthenticated()) {
        const logToken = localStorage.getItem("logtoken");
        console.log("Log token:", logToken);
        redirect("/login");
      }
    }, []);

    return isAuthenticated() ? <WrappedComponent {...props} /> : null;
  };

  return ComponentWithAuth;
};

export default AuthGuard;
