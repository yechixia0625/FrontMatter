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
    <section className="w-full max-w-md space-y-6 rounded-lg border border-zinc-800 bg-zinc-950/80 p-6 shadow-2xl">
      <div className="flex justify-end">
        <LocaleToggle />
      </div>
      <div className="space-y-2 text-center">
        <h1 className="text-3xl font-bold tracking-tight">{t("brand.name")}</h1>
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
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-600 focus:outline-none"
            autoComplete="username"
          />
        </label>
        <label className="block space-y-2">
          <span className="font-mono text-xs text-zinc-500">{t("auth.password")}</span>
          <input
            type="password"
            value={password}
            onChange={(event) => setPassword(event.target.value)}
            className="w-full rounded border border-zinc-800 bg-zinc-900 px-3 py-2 text-sm focus:border-zinc-600 focus:outline-none"
            autoComplete="current-password"
          />
        </label>
        {error && <p className="font-mono text-xs text-red-400">{error}</p>}
        <button
          type="submit"
          disabled={pending || username.trim() === "" || password === ""}
          className="w-full rounded border border-zinc-700 py-2 font-mono text-xs tracking-[0.18em] text-zinc-100 hover:border-lime-300 disabled:opacity-50"
        >
          {pending ? t("auth.authenticating") : t("auth.enter")}
        </button>
      </form>
    </section>
  );
}
