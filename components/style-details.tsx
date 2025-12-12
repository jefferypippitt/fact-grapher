"use client";

import { InfoIcon } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
} from "@/components/ui/sidebar";

const styleDescriptions: Record<string, string> = {
  Timeline:
    "Shows a sequence of events, like a project roadmap or company history. Perfect for historical events, project milestones, and chronological narratives.",
  Comparison:
    "Highlights differences and similarities, often using side-by-side layouts. Ideal for comparing products, concepts, or options (e.g., Mac vs. PC, pros and cons).",
  "Process Infographics":
    "Guides users through steps, workflows, or cycles. Great for how-to guides, company processes, or explaining complex procedures step-by-step.",
  "Statistical infographics":
    "Presents data using charts, graphs, and numbers. Perfect for visualizing trends, survey results, population data, and quantitative information.",
  Flowchart:
    "Illustrates decisions, paths, and logical flows. Excellent for troubleshooting guides, decision trees, and showing cause-and-effect relationships.",
  "Hierarchical infographics":
    "Shows relationships and structure in a top-down or organizational format. Ideal for organizational charts, taxonomies, and classification systems.",
};

const styleExamples: Record<string, readonly string[]> = {
  Timeline: [
    "Create a timeline of World War II",
    "Show the history of the Roman Empire",
    "Timeline of the coffee bean lifecycle",
    "Evolution of renewable energy over time",
    "Chronological events leading to the fall of the Mongol Empire",
    "Project milestones for Q4 2024",
  ] as const,
  Comparison: [
    "Compare Mac vs PC features",
    "Pros and cons of renewable energy",
    "Before and after climate change impacts",
    "Compare different programming languages",
    "iPhone vs Android comparison",
    "Electric vs gas vehicles",
  ] as const,
  "Process Infographics": [
    "How to make coffee step by step",
    "Customer journey from awareness to purchase",
    "Manufacturing process of a smartphone",
    "Recipe for making sourdough bread",
    "Workflow for handling customer support tickets",
    "Assembly instructions for furniture",
  ] as const,
  "Statistical infographics": [
    "Visualize global population growth from 1950 to 2024",
    "Sales trends for the last 5 years",
    "Survey results about remote work preferences",
    "Market research data on electric vehicles",
    "Statistics on renewable energy adoption",
    "Dashboard showing quarterly revenue metrics",
  ] as const,
  Flowchart: [
    "Create a decision tree for choosing a programming language",
    "Troubleshooting guide for network connectivity issues",
    "Cause and effect diagram of climate change",
    "Process flow for order fulfillment",
    "Logic diagram for user authentication",
    "Problem solving flowchart for debugging code",
  ] as const,
  "Hierarchical infographics": [
    "Organizational chart of a tech company",
    "Taxonomy of animal kingdom",
    "Classification system for programming languages",
    "Family tree of European monarchies",
    "Directory structure of a web application",
    "Category hierarchy for an e-commerce site",
  ] as const,
};

export function StyleDetails() {
  const [open, setOpen] = useState(false);
  const [selectedStyle, setSelectedStyle] = useState<string>(
    Object.keys(styleDescriptions)[0] ?? ""
  );

  const styles = Object.keys(styleDescriptions);

  return (
    <Dialog onOpenChange={setOpen} open={open}>
      <DialogTrigger asChild>
        <Button size="sm" variant="link">
          <InfoIcon className="size-4" />
          <span>Style Guide</span>
        </Button>
      </DialogTrigger>
      <DialogContent className="overflow-hidden p-0 md:max-h-[500px] md:max-w-[700px] lg:max-w-[800px]">
        <DialogTitle className="sr-only">Infographic Style Guide</DialogTitle>
        <DialogDescription className="sr-only">
          Learn about different infographic styles and when to use them.
        </DialogDescription>
        <SidebarProvider className="items-start">
          <Sidebar className="hidden h-[480px] md:flex" collapsible="none">
            <SidebarContent>
              <ScrollArea className="h-full">
                <SidebarGroup>
                  <SidebarGroupContent>
                    <SidebarMenu>
                      {styles.map((style) => (
                        <SidebarMenuItem key={style}>
                          <SidebarMenuButton
                            asChild
                            isActive={style === selectedStyle}
                          >
                            <button
                              onClick={() => setSelectedStyle(style)}
                              type="button"
                            >
                              <span>{style}</span>
                            </button>
                          </SidebarMenuButton>
                        </SidebarMenuItem>
                      ))}
                    </SidebarMenu>
                  </SidebarGroupContent>
                </SidebarGroup>
              </ScrollArea>
            </SidebarContent>
          </Sidebar>
          <main className="flex h-[480px] flex-1 flex-col overflow-hidden">
            <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12">
              <div className="flex items-center gap-2 px-4">
                <div className="md:hidden">
                  <Select
                    onValueChange={setSelectedStyle}
                    value={selectedStyle}
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {styles.map((style) => (
                        <SelectItem key={style} value={style}>
                          {style}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <Breadcrumb className="hidden md:flex">
                  <BreadcrumbList>
                    <BreadcrumbItem className="hidden md:block">
                      <BreadcrumbLink href="#">Style Guide</BreadcrumbLink>
                    </BreadcrumbItem>
                    <BreadcrumbSeparator className="hidden md:block" />
                    <BreadcrumbItem>
                      <BreadcrumbPage>{selectedStyle}</BreadcrumbPage>
                    </BreadcrumbItem>
                  </BreadcrumbList>
                </Breadcrumb>
              </div>
            </header>
            <div className="flex flex-1 flex-col gap-4 overflow-y-auto p-4 pt-0">
              <div className="space-y-4">
                <div>
                  <h2 className="mb-2 font-semibold text-2xl">
                    {selectedStyle}
                  </h2>
                  <p className="mb-4 text-base text-muted-foreground leading-relaxed">
                    {styleDescriptions[selectedStyle]}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {styleExamples[selectedStyle]?.map((example) => (
                      <Badge key={example} variant="outline">
                        {example}
                      </Badge>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </main>
        </SidebarProvider>
      </DialogContent>
    </Dialog>
  );
}
