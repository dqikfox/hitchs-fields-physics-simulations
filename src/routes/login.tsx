import { createFileRoute, Link } from "@tanstack/react-router";
import { GROK_PROVIDERS, authEnabled, signIn } from "@/lib/auth/client";

export const Route = createFileRoute("/login")({ component: Login });

function Login() {
  return (
    <main className="grid min-h-dvh place-items-center bg-bg px-5 text-fg">
      <div className="w-full max-w-sm rounded-xl border border-line bg-surface p-6">
        <p className="font-mono text-[11px] tracking-[0.22em] text-muted uppercase">
          HFPS
        </p>
        <h1 className="mt-2 text-2xl font-medium tracking-tight">Sign in</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Optional. The lab runs as a guest. Sign in to keep your account on
          this device.
        </p>
        <div className="mt-6 flex flex-col gap-2">
          {authEnabled ? (
            GROK_PROVIDERS.map((p) => (
              <button
                key={p.providerId}
                type="button"
                onClick={() => signIn(p.providerId, { callbackURL: "/" })}
                className="h-11 rounded-md border border-line bg-surface-2 px-4 text-sm font-medium text-fg transition-colors hover:border-accent hover:bg-accent hover:text-accent-fg"
              >
                Continue with {p.label}
              </button>
            ))
          ) : (
            <p className="text-sm text-muted">Sign-in is disabled.</p>
          )}
        </div>
        <Link
          to="/"
          className="mt-5 inline-block text-sm text-muted underline-offset-4 hover:text-fg hover:underline"
        >
          Back to the lab
        </Link>
      </div>
    </main>
  );
}
