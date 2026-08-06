import { Outlet, Link } from "react-router-dom";
import { HousePlug } from "lucide-react";

function AuthLayout() {
  return (
    <div className="relative flex min-h-screen w-full items-center justify-center overflow-hidden bg-neutral-50 px-4 py-12 dark:bg-neutral-950">
      <div className="pointer-events-none absolute -top-32 -left-24 h-80 w-80 rounded-full bg-amber-200/40 blur-3xl dark:bg-amber-500/10" />
      <div className="pointer-events-none absolute -bottom-32 -right-24 h-80 w-80 rounded-full bg-neutral-300/40 blur-3xl dark:bg-neutral-700/20" />
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.4] dark:opacity-[0.15]"
        style={{
          backgroundImage: "radial-gradient(currentColor 1px, transparent 1px)",
          backgroundSize: "28px 28px",
          color: "rgb(0 0 0 / 0.06)",
        }}
      />

      <div className="relative z-10 w-full max-w-md">
        <Link to="/shop/home" className="mb-8 flex items-center justify-center gap-2 group">
          <div className="flex h-9 w-9 items-center justify-center rounded-lg bg-neutral-900 transition-transform group-hover:scale-105 dark:bg-white">
            <HousePlug className="h-4 w-4 text-white dark:text-neutral-900" />
          </div>
          <span className="font-serif text-2xl font-semibold tracking-tight text-neutral-900 dark:text-white">
            sleave
          </span>
        </Link>

        <div className="rounded-2xl border border-neutral-200/70 bg-white/80 p-8 shadow-xl shadow-neutral-200/60 backdrop-blur-xl dark:border-neutral-800 dark:bg-neutral-900/80 dark:shadow-none">
          <Outlet />
        </div>

        <p className="mt-6 text-center text-xs text-muted-foreground">
          By continuing you agree to sleave&apos;s Terms of Service and Privacy Policy.
        </p>
      </div>
    </div>
  );
}

export default AuthLayout;