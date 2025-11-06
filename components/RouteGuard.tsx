import { useRouter } from "expo-router";
import { useEffect } from "react";

const RouteGuard = ({ children }: { children: React.ReactNode }) => {
  const router = useRouter();

  const isAuth = false; // TODO: replace with actual auth check

  useEffect(() => {
    if (!isAuth) {
      router.replace("/auth");
    }
  }, []);

  return <>{children}</>;
};

export default RouteGuard;
