export function AdditionalFeatures() {
  const targetUsers = [
    {
      title: "Students & Teachers",
      description:
        "Turn lectures into visual study guides in minutes—no design apps needed.",
    },
    {
      title: "Content Creators & Journalists",
      description:
        "Publish-ready explainers that make complex stories skimmable and shareable.",
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
        <h2 className="mb-6 text-left font-semibold text-3xl">
          Who Is This For?
        </h2>
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {targetUsers.map((user) => (
            <div className="space-y-1" key={user.title}>
              <h3 className="font-semibold text-sm">{user.title}</h3>
              <p className="text-muted-foreground text-sm">
                {user.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
