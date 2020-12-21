import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";

export default function Index() {
  const auth = useAuth();

  useEffect(() => {
    return !auth.user
      ? auth.redirectTo("/accounts/signin")
      : auth.redirectTo("/chat");
  }, []);

  return <></>;
}
