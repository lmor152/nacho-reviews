"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "motion/react";
import { ChipIcon } from "@/components/chip-icon";

const NAV_ITEMS = [
  { href: "/", label: "Dashboard", code: "00" },
  { href: "/reviews", label: "Reviews", code: "01" },
  { href: "/submit", label: "Submit", code: "02" },
  { href: "/admin", label: "Admin", code: "03" },
];

function isItemActive(pathname: string, href: string): boolean {
  return href === "/" ? pathname === "/" : pathname.startsWith(href);
}

export function Nav() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <>
    <header className="relative z-30 px-4 sm:px-10 pt-5 sm:pt-6">
      <div className="mx-auto flex max-w-[1400px] items-center justify-between gap-3">
        <Link href="/" className="group flex items-center gap-3 min-w-0">
          <span className="relative inline-block shrink-0">
            <ChipIcon size={40} rotate={-12} />
            <span className="absolute -right-1 -top-1 h-3 w-3 rounded-full bg-[var(--color-salsa)] ring-2 ring-[var(--color-paper)]" />
          </span>
          <span className="flex flex-col leading-none min-w-0">
            <span className="display text-xl sm:text-2xl tracking-tight text-[var(--color-mole)]">
              Nachódex
            </span>
            <span className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)] truncate">
              field journal
            </span>
          </span>
        </Link>

        <nav className="hidden md:flex items-center gap-1 rounded-full border border-[var(--color-mole)]/30 bg-[var(--color-cream-light)]/85 p-1.5 shadow-[0_8px_24px_-18px_rgba(42,24,18,0.6)] backdrop-blur">
          {NAV_ITEMS.map((item) => {
            const isActive = isItemActive(pathname, item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`relative flex items-center gap-2 rounded-full px-4 py-2 text-sm transition-colors ${
                  isActive
                    ? "bg-[var(--color-mole)] text-[var(--color-cream-light)]"
                    : "text-[var(--color-mole)] hover:bg-[var(--color-paper-deep)]"
                }`}
              >
                <span className="mono text-[10px] opacity-60">
                  {item.code}
                </span>
                <span className="font-medium">{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="flex items-center gap-2">
          <Link
            href="/submit"
            className="btn-primary text-xs sm:text-sm whitespace-nowrap"
          >
            <span className="hidden sm:inline">+ New plate</span>
            <span className="sm:hidden">+ Plate</span>
          </Link>
          <button
            type="button"
            onClick={() => setOpen((o) => !o)}
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
            className="md:hidden flex h-11 w-11 items-center justify-center rounded-full border-[1.5px] border-[var(--color-mole)] bg-[var(--color-cream-light)] text-[var(--color-mole)] shadow-[0_4px_0_-1px_rgba(42,24,18,0.3)] transition-transform active:translate-y-0.5"
          >
            <span className="sr-only">Menu</span>
            <span className="relative h-4 w-5" aria-hidden>
              <span
                className={`absolute left-0 right-0 h-[2px] bg-current transition-transform ${
                  open ? "top-1/2 -translate-y-1/2 rotate-45" : "top-0"
                }`}
              />
              <span
                className={`absolute left-0 right-0 top-1/2 -translate-y-1/2 h-[2px] bg-current transition-opacity ${
                  open ? "opacity-0" : "opacity-100"
                }`}
              />
              <span
                className={`absolute left-0 right-0 h-[2px] bg-current transition-transform ${
                  open ? "top-1/2 -translate-y-1/2 -rotate-45" : "bottom-0"
                }`}
              />
            </span>
          </button>
        </div>
      </div>
      <div className="mx-auto mt-4 sm:mt-5 hidden md:flex max-w-[1400px] items-center justify-between gap-3">
        <div className="h-px flex-1 bg-[var(--color-mole)]/25" />
        <p className="mono text-[10px] uppercase tracking-[0.4em] text-[var(--color-mole)]/70 text-center">
          A nachological survey of restaurants worth remembering
        </p>
        <div className="h-px flex-1 bg-[var(--color-mole)]/25" />
      </div>
    </header>

    {/* Mobile menu lives outside the header so it isn't trapped in the
        header's stacking context. As a body sibling with z-50 it sits above
        every panel/card on the page. */}
    <AnimatePresence>
      {open && (
        <motion.div
          key="mobile-menu"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.18 }}
          className="md:hidden fixed inset-0 z-50"
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[var(--color-mole)]/40 backdrop-blur-[2px]"
          />
          <motion.div
            initial={{ y: -24, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -24, opacity: 0 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            onClick={(e) => e.stopPropagation()}
            className="absolute left-3 right-3 top-3 panel overflow-hidden p-3"
          >
            <div className="flex items-center justify-between gap-3 px-2 py-1">
              <span className="mono text-[10px] uppercase tracking-[0.32em] text-[var(--color-tortilla-deep)]">
                Navigation
              </span>
              <button
                type="button"
                onClick={() => setOpen(false)}
                className="mono text-[10px] uppercase tracking-[0.22em] text-[var(--color-mole)]/60"
                aria-label="Close menu"
              >
                close ✕
              </button>
            </div>
            <ul className="mt-3 flex flex-col">
              {NAV_ITEMS.map((item) => {
                const isActive = isItemActive(pathname, item.href);
                return (
                  <li key={item.href}>
                    <Link
                      href={item.href}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 rounded-2xl px-3 py-3 transition-colors ${
                        isActive
                          ? "bg-[var(--color-mole)] text-[var(--color-cream-light)]"
                          : "text-[var(--color-mole)] hover:bg-[var(--color-paper-deep)]"
                      }`}
                    >
                      <span
                        className={`mono text-[11px] tracking-[0.18em] ${
                          isActive
                            ? "text-[var(--color-cheese)]"
                            : "text-[var(--color-tortilla-deep)]"
                        }`}
                      >
                        §{item.code}
                      </span>
                      <span className="display text-2xl flex-1">
                        {item.label}
                      </span>
                      <span aria-hidden>→</span>
                    </Link>
                  </li>
                );
              })}
            </ul>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
