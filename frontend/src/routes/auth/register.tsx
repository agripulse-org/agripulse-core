import { useMemo } from "react";
import { useSignUp } from "@clerk/clerk-react";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, createFileRoute, useNavigate } from "@tanstack/react-router";
import { useTranslation } from "react-i18next";
import { Apple, Lock, Mail, User } from "lucide-react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { getClerkMessage, getSafeRedirect } from "@/lib/auth";
import type { TFunction } from "i18next";

const buildRegisterSchema = (t: TFunction) =>
  z
    .object({
      name: z.string().trim().min(2, t("auth.validation.fullNameMin")),
      email: z.email(t("auth.validation.invalidEmail")),
      password: z.string().min(8, t("auth.validation.passwordMin")),
      confirmPassword: z.string(),
    })
    .refine((data) => data.password === data.confirmPassword, {
      path: ["confirmPassword"],
      message: t("auth.validation.passwordsNoMatch"),
    });

const registerSearchSchema = z.object({
  redirect: z.string().optional(),
});

type RegisterFormValues = z.infer<ReturnType<typeof buildRegisterSchema>>;

const oauthRedirectPath = "/auth/sso-callback";

export const Route = createFileRoute("/auth/register")({
  validateSearch: registerSearchSchema,
  component: RegisterRoute,
});

function RegisterRoute() {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const search = Route.useSearch();
  const safeRedirect = getSafeRedirect(search.redirect);

  const { isLoaded, signUp, setActive } = useSignUp();

  const registerSchema = useMemo(() => buildRegisterSchema(t), [t]);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormValues>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const redirectToNextPage = () => {
    if (safeRedirect === "/") {
      navigate({ to: "/" });
      return;
    }

    window.location.assign(safeRedirect);
  };

  const onSubmit = async (values: RegisterFormValues) => {
    if (!isLoaded) {
      return;
    }

    const [firstName, ...lastNameParts] = values.name.trim().split(/\s+/);
    const lastName = lastNameParts.join(" ");

    try {
      const signUpResult = await signUp.create({
        firstName,
        lastName: lastName || undefined,
        emailAddress: values.email,
        password: values.password,
      });

      if (signUpResult.status !== "complete" || !signUpResult.createdSessionId) {
        setError("root", {
          message: t("auth.additionalVerificationRequired"),
        });
        return;
      }

      await setActive({ session: signUpResult.createdSessionId });
      redirectToNextPage();
    } catch (error) {
      setError("root", {
        message: getClerkMessage(error),
      });
    }
  };

  const handleOAuthSignUp = async (strategy: "oauth_google" | "oauth_apple") => {
    if (!isLoaded) {
      return;
    }

    try {
      const origin = window.location.origin;

      await signUp.authenticateWithRedirect({
        strategy,
        redirectUrl: `${origin}${oauthRedirectPath}`,
        redirectUrlComplete: `${origin}${safeRedirect}`,
      });
    } catch (error) {
      setError("root", {
        message: getClerkMessage(error),
      });
    }
  };

  return (
    <>
      <div className="text-center mb-8">
        <h2 className="text-3xl mb-2">{t("auth.getStarted")}</h2>
        <p className="text-muted-foreground">{t("auth.registerSubtitle")}</p>
      </div>

      <div className="space-y-3">
        <button
          type="button"
          onClick={() => handleOAuthSignUp("oauth_google")}
          disabled={!isLoaded || isSubmitting}
          className="w-full border border-border py-3 rounded-xl hover:bg-muted transition-all flex items-center justify-center gap-3"
        >
          <svg className="w-5 h-5" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
            />
          </svg>
          <span>{t("auth.signInWithGoogle")}</span>
        </button>

        <button
          type="button"
          onClick={() => handleOAuthSignUp("oauth_apple")}
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
          <span className="px-4 bg-background text-muted-foreground">
            {t("auth.orContinueWithEmail")}
          </span>
        </div>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-5" noValidate>
        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.name")}</label>
          <div className="relative">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="text"
              {...register("name")}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {errors.name?.message && (
            <p className="mt-2 text-sm text-destructive">{errors.name.message}</p>
          )}
        </div>

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

        <div>
          <label className="block text-sm mb-2 text-foreground">{t("auth.confirmPassword")}</label>
          <div className="relative">
            <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-muted-foreground" />
            <input
              type="password"
              {...register("confirmPassword")}
              className="w-full pl-11 pr-4 py-3 bg-input-background border border-border rounded-xl focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
            />
          </div>
          {errors.confirmPassword?.message && (
            <p className="mt-2 text-sm text-destructive">{errors.confirmPassword.message}</p>
          )}
        </div>

        <div id="clerk-captcha" className="min-h-8" />

        {errors.root?.message && <p className="text-sm text-destructive">{errors.root.message}</p>}

        <button
          type="submit"
          disabled={!isLoaded || isSubmitting}
          className="w-full bg-primary text-primary-foreground py-3 rounded-xl hover:bg-primary/90 transition-all shadow-lg hover:shadow-xl"
        >
          {isSubmitting ? t("common.creatingAccount") : t("auth.register")}
        </button>
      </form>

      <div className="mt-6 text-center">
        <Link
          to="/auth/login"
          search={{ redirect: safeRedirect !== "/" ? safeRedirect : undefined }}
          className="text-primary hover:underline"
        >
          {t("auth.haveAccountLogin")}
        </Link>
      </div>
    </>
  );
}
