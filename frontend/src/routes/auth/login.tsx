import { useSignIn } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useLanguage } from "@/providers/language-provider";
import { Apple, Lock, Mail } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getClerkMessage, getSafeRedirect } from "@/lib/auth";
import { GoogleIcon } from "@/components/GoogleIcon";

const loginSchema = z.object({
  email: z.email("Please enter a valid email address"),
  password: z.string().min(8, "Password must be at least 8 characters"),
});

const loginSearchSchema = z.object({
  redirect: z.string().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

const oauthRedirectPath = "/auth/sso-callback";

export const Route = createFileRoute("/auth/login")({
  validateSearch: loginSearchSchema,
  component: LoginRoute,
});

function LoginRoute() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const { redirect } = Route.useSearch();
  const safeRedirect = getSafeRedirect(redirect);
  const { isLoaded, signIn, setActive } = useSignIn();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const redirectToNextPage = () => navigate({ to: safeRedirect });

  const onSubmit = async (values: LoginFormValues) => {
    if (!isLoaded) {
      return;
    }

    try {
      const signInResult = await signIn.create({
        identifier: values.email,
        password: values.password,
      });

      if (signInResult.status !== "complete" || !signInResult.createdSessionId) {
        setError("root", {
          message: "Additional sign-in steps are required in your Clerk configuration.",
        });
        return;
      }

      await setActive({ session: signInResult.createdSessionId });
      redirectToNextPage();
    } catch (error) {
      setError("root", { message: getClerkMessage(error) });
    }
  };

  const handleOAuthLogin = async (strategy: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) return;

    try {
      await signIn.authenticateWithRedirect({
        strategy,
        redirectUrl: `${window.location.origin}${oauthRedirectPath}`,
        redirectUrlComplete: `${window.location.origin}${safeRedirect}`,
      });
    } catch (error) {
      setError("root", { message: getClerkMessage(error) });
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-2">{t("auth.welcomeBack")}</h2>
        <p className="text-muted-foreground">Enter your credentials to access your account</p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleOAuthLogin("oauth_google")}
          disabled={!isLoaded || isSubmitting}
          className="w-full border border-border py-3 rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-3"
        >
          <GoogleIcon />
          <span>{t("auth.signInWithGoogle")}</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthLogin("oauth_apple")}
          disabled={!isLoaded || isSubmitting}
          className="w-full border border-border py-3 rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-3"
        >
          <Apple className="w-5 h-5" />
          <span>{t("auth.signInWithApple")}</span>
        </button>
      </div>

      <div className="relative my-6">
        <div className="absolute inset-0 flex items-center">
          <div className="w-full border-t border-border" />
        </div>
        <div className="relative flex justify-center text-sm">
          <span className="px-4 bg-background text-muted-foreground">or continue with email</span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.email")}</label>
          <div className="relative">
            <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="email"
              {...register("email")}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {errors.email?.message && (
            <p className="mt-2 text-sm text-destructive">{errors.email.message}</p>
          )}
        </div>

        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.password")}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              {...register("password")}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {errors.password?.message && (
            <p className="mt-2 text-sm text-destructive">{errors.password.message}</p>
          )}
        </div>

        {errors.root?.message && <p className="text-sm text-destructive">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={!isLoaded || isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? "Signing in..." : t("auth.login")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/auth/register"
          search={{ redirect: safeRedirect !== "/" ? safeRedirect : undefined }}
          className="text-primary hover:underline"
        >
          Don&apos;t have an account? Register
        </Link>
      </div>
    </>
  );
}
