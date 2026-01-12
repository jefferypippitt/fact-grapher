export function Background() {
  return (
    <div
      aria-hidden="true"
      className="-z-10 absolute top-0 right-0 left-0"
      style={{
        backgroundImage: `
          linear-gradient(to right, var(--border) 1px, transparent 1px),
          linear-gradient(to bottom, var(--border) 1px, transparent 1px)
        `,
        backgroundSize: "64px 64px",
        height: "100%",
        left: "max(calc((100% - 100vw) / 2 + 1rem), calc((100% - 100vw) / 2))",
        maskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
        opacity: 0.3,
        right: "max(calc((100% - 100vw) / 2 + 1rem), calc((100% - 100vw) / 2))",
        WebkitMaskImage:
          "linear-gradient(to bottom, transparent 0%, black 15%, black 85%, transparent 100%)",
      }}
    />
  );
}
