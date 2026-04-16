// Footer links reused across authentication-related pages.
const links = ["Privacy Policy", "Terms of Service", "Contact Support", "Security"]

export function AuthFooter() {
  return (
    <footer className="w-full border-t border-slate-200 bg-white px-6 py-10">
      <div className="mx-auto flex w-full max-w-7xl flex-col gap-6 text-sm text-slate-500 lg:flex-row lg:items-center lg:justify-between">
        <p className="text-base text-slate-800">Distributed Health</p>

        <nav className="flex flex-wrap items-center gap-5">
          {links.map((link) => (
            <a
              key={link}
              href="#"
              className="transition-colors hover:text-slate-700"
            >
              {link}
            </a>
          ))}
        </nav>

        <p>© 2024 Distributed Health. All rights reserved.</p>
      </div>
    </footer>
  )
}
