import Link from "next/link";

// Quick navigation links for implemented auth screens.
const pages = [
  {
    href: "/login",
    title: "Login Page",
    description: "Figma node 139:502",
  },
  {
    href: "/role-selection",
    title: "Role Selection Page",
    description: "Figma node 139:678",
  },
  {
    href: "/sign-up",
    title: "Sign Up Page",
    description: "Figma node 144:706",
  },
];

export default function Home() {
  return (
    <main className="min-h-screen bg-[#f8fafc] px-6 py-16 text-slate-900">
      <div className="mx-auto w-full max-w-3xl space-y-10 rounded-3xl bg-white p-8 shadow-[0_20px_48px_-20px_rgba(11,28,48,0.2)] md:p-12">
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-[-0.8px]">
            Distributed Health Auth Screens
          </h1>
          <p className="text-slate-600">
            Open each implemented page from the links below.
          </p>
        </div>

        <div className="space-y-4">
          {pages.map((page) => (
            <Link
              key={page.href}
              href={page.href}
              className="block rounded-2xl border border-slate-200 p-5 transition hover:border-sky-200 hover:bg-sky-50/50"
            >
              <p className="text-lg font-semibold text-slate-900">{page.title}</p>
              <p className="mt-1 text-sm text-slate-500">{page.description}</p>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
