import React, { useEffect, useState } from "react";
import { redirect } from "next/navigation";

const AuthGuard = <P extends object>(
  WrappedComponent: React.ComponentType<P>
) => {
  const ComponentWithAuth = (props: P) => {
    const [isAuth, setIsAuth] = useState(false);

    useEffect(() => {
      const checkAuth = () => {
        if (typeof window !== "undefined") {
          const logToken = localStorage.getItem("logtoken");
          console.log("Log token:", logToken);
          if (!logToken) {
            redirect("/login");
          } else {
            setIsAuth(true);
          }
        }
      };

      checkAuth();
    }, []);

    return isAuth ? <WrappedComponent {...props} /> : null;
  };

  return ComponentWithAuth;
};

export default AuthGuard;
