import { useEffect, ReactNode } from "react";
import { useRouter } from "next/navigation";

import { useAuth } from "@/app/hooks/useAuth";

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  const { isAuthenticated, loading } = useAuth();
  const router = useRouter();

  useEffect(() => {
    let timeoutId: NodeJS.Timeout;

    if (!loading && !isAuthenticated) {
      timeoutId = setTimeout(() => {
        router.push("/");
      }, 100);
    }

    return () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
    };
  }, [isAuthenticated, loading, router]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary" />
      </div>
    );
  }

  return <>{isAuthenticated ? children : null}</>;
};

export default ProtectedRoute;
