export default function LandingFooter() {
  return (
    <footer className="py-8 px-4 border-t border-border bg-background">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-4">
        <p className="text-muted-foreground text-sm" style={{ fontFamily: "'DM Sans', sans-serif" }}>
          © 2026 Veehtor AI LLC. Tampa, FL.
        </p>
        <a
          href="https://www.linkedin.com/in/vitorungari/"
          target="_blank"
          rel="noopener noreferrer"
          className="text-muted-foreground hover:text-foreground transition-colors text-sm"
          style={{ fontFamily: "'DM Sans', sans-serif" }}
        >
          LinkedIn
        </a>
      </div>
    </footer>
  );
}
