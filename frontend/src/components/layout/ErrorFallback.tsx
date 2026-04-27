import React from "react";
import { Link } from "@tanstack/react-router";
import { AlertTriangle, Bug, Home, RefreshCw } from "lucide-react";
import type { ErrorComponentProps } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { useTranslation } from "react-i18next";

export function ErrorFallback({ error, reset }: ErrorComponentProps) {
  const { t } = useTranslation();
  const isDevelopment = import.meta.env.DEV;
  const [showDetails, setShowDetails] = React.useState(false);

  return (
    <div className="flex items-center justify-center p-4 h-full">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
            <AlertTriangle className="h-8 w-8 text-destructive" />
          </div>
          <CardTitle className="text-2xl font-semibold">{t("error.title")}</CardTitle>
          <CardDescription className="text-base">{t("error.description")}</CardDescription>
        </CardHeader>

        <CardContent className="space-y-4">
          <Alert>
            <Bug className="h-4 w-4" />
            <AlertDescription className="font-medium">
              {error.message || t("error.unexpected")}
            </AlertDescription>
          </Alert>

          {isDevelopment && (
            <div className="space-y-3">
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowDetails(!showDetails)}
              >
                {showDetails ? t("error.hide") : t("error.show")} {t("error.technicalDetails")}
              </Button>

              {showDetails && (
                <div className="rounded-lg border bg-muted/50 p-4">
                  <div className="mb-2 flex items-center gap-2">
                    <Badge variant="secondary">{t("error.developmentMode")}</Badge>
                  </div>
                  <div className="space-y-2">
                    <div>
                      <h4 className="text-sm font-medium text-muted-foreground">
                        {t("error.errorMessage")}
                      </h4>
                      <p className="text-sm font-mono text-destructive">{error.message}</p>
                    </div>
                    {error.stack && (
                      <div>
                        <h4 className="text-sm font-medium text-muted-foreground">
                          {t("error.stackTrace")}
                        </h4>
                        <pre className="mt-1 max-h-40 overflow-auto rounded border bg-muted p-2 text-xs">
                          <code className="text-muted-foreground">{error.stack}</code>
                        </pre>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          <div className="flex flex-col gap-3 sm:flex-row">
            <Button onClick={reset} className="flex-1">
              <RefreshCw className="mr-2 h-4 w-4" />
              {t("error.tryAgain")}
            </Button>
            <Button variant="outline" asChild className="flex-1">
              <Link to="/">
                <Home className="mr-2 h-4 w-4" />
                {t("error.goHome")}
              </Link>
            </Button>
          </div>

          <div className="pt-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t("error.contactSupportPrefix")}{" "}
              <a href="#" className="text-primary underline-offset-4 hover:underline">
                {t("error.contactSupportLink")}
              </a>
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
