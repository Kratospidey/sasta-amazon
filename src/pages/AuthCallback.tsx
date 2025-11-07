import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Loader2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

const AuthCallback = () => {
  const { completeLogin } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [error, setError] = useState<string | null>(null);
  const [status, setStatus] = useState<"pending" | "success" | "error">("pending");

  useEffect(() => {
    let cancelled = false;
    const run = async () => {
      try {
        await completeLogin(searchParams);
        if (cancelled) return;
        setStatus("success");
        setTimeout(() => {
          navigate("/profile", { replace: true });
        }, 800);
      } catch (err) {
        if (cancelled) return;
        setStatus("error");
        setError(err instanceof Error ? err.message : "Unable to complete sign-in.");
      }
    };
    void run();
    return () => {
      cancelled = true;
    };
  }, [completeLogin, navigate, searchParams]);

  const handleRetry = () => {
    navigate("/profile", { replace: true });
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-background px-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle>Finishing sign-in</CardTitle>
          <CardDescription>
            {status === "pending"
              ? "Verifying your Supabase session."
              : status === "success"
                ? "You're all set! Redirecting back to your profile."
                : "We couldn't complete the sign-in flow."}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 text-sm text-muted-foreground">
          {status === "pending" && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Finalising authentication&hellip;</span>
            </div>
          )}
          {status === "error" && (
            <div className="space-y-3">
              <p>{error}</p>
              <Button onClick={handleRetry} className="w-full">
                Return to profile
              </Button>
            </div>
          )}
          {status === "success" && (
            <div className="flex items-center justify-center gap-2">
              <Loader2 className="h-4 w-4 animate-spin" />
              <span>Redirecting&hellip;</span>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AuthCallback;
