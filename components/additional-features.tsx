export default function AdditionalFeatures() {
  const targetUsers = [
    {
      title: "Students & Teachers",
      description: "Turn lectures into visual study guides in minutes",
    },
    {
      title: "Content Creators & Journalists",
      description: "Explain complex stories simply for fast sharing.",
    },
    {
      title: "Operators & Analysts",
      description:
        "Visualize processes and metrics to brief stakeholders quickly and clearly.",
    },
    {
      title: "Social Teams",
      description:
        "Ship consistent, branded carousels that translate data into quick hits.",
    },
    {
      title: "Researchers & Academics",
      description:
        "Summarize findings with cited visuals to speed up peer reviews and talks.",
    },
    {
      title: "Marketing & Communications",
      description:
        "Package product truths and proof points into visuals that convert faster.",
    },
  ];

  return (
    <section className="py-8">
      <div className="max-w-4xl">
        <h2 className="mb-6 text-left font-semibold text-3xl md:text-4xl">
          Who Is <span className="text-primary">This</span> For?
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {targetUsers.map((user) => (
            <div
              className="space-y-2 rounded-lg border bg-card p-4 shadow-sm transition-shadow hover:shadow-md"
              key={user.title}
            >
              <h3 className="font-semibold text-sm md:text-base">
                {user.title}
              </h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {user.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
