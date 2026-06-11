"use client";

import { useState } from "react";
import { LocaleToggle } from "@/components/shared/LocaleToggle";
import { AuthService, isUnauthorizedError } from "@/services/authService";
import { useI18n } from "@/i18n/I18nProvider";

interface LoginPanelProps {
  onSuccess: () => void;
}

export function LoginPanel({ onSuccess }: LoginPanelProps) {
  const { t } = useI18n();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [pending, setPending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setPending(true);
    setError(null);

    try {
      const session = await AuthService.login(username.trim(), password);
      if (!session.authenticated) {
        setError(t("auth.loginFailed"));
        return;
      }
      onSuccess();
    } catch (err) {
      if (isUnauthorizedError(err)) {
        setError(t("auth.invalidCredentials"));
      } else {
        setError(t("auth.temporarilyUnavailable"));
      }
    } finally {
      setPending(false);
    }
  }

  return (
    <section className="w-full max-w-md space-y-5 rounded-lg border border-zinc-800 bg-zinc-950/90 p-4 shadow-2xl sm:space-y-6 sm:p-6">
      <div className="flex justify-end">
        <LocaleToggle />
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{t("brand.name")}</h1>
        <p className="font-mono text-xs tracking-[0.18em] text-zinc-500">
          {t("auth.publicTestAccess")}
        </p>
      </div>

      <form className="space-y-4" onSubmit={handleSubmit}>
        <label className="block space-y-2">
          <span className="font-mono text-xs text-zinc-500">{t("auth.username")}</span>
          <input
            value={username}
            onChange={(event) => setUsername(event.target.value)}
            className="h-11 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-base focus:border-zinc-600 focus:outline-none sm:text-sm"
            autoComplete="username"
          />
        </label>
        <label className="block space-y-2">
          <span className="font-mono text-xs text-zinc-500">{t("auth.password")}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="h-11 w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-base focus:border-zinc-600 focus:outline-none sm:text-sm"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="font-mono text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending || username.trim() === "" || password === ""}
          className="h-11 w-full rounded border border-zinc-700 py-2 font-mono text-xs tracking-[0.14em] text-zinc-100 hover:border-lime-300 disabled:opacity-50 sm:tracking-[0.18em]"
        >
          {pending ? t("auth.authenticating") : t("auth.enter")}
        </button>
      </form>
    </section>
  );
}
