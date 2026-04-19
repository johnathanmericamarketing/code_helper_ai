import React from "react";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Bot,
  CheckCircle2,
  ChevronRight,
  Code2,
  Eye,
  Globe,
  Layers3,
  Lock,
  MonitorSmartphone,
  Rocket,
  ShieldCheck,
  Sparkles,
  Wand2,
  Workflow,
  History,
  GitBranch,
  MousePointerClick,
  Palette,
  MessageSquare,
  Server,
  KeyRound,
  PlayCircle,
  BadgeCheck,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useNavigate } from "react-router-dom";

const features = [
  {
    icon: Bot,
    title: "AI website changes",
    text: "Describe what you want in plain language and generate a safe visual preview before anything goes live.",
  },
  {
    icon: Eye,
    title: "Before and after review",
    text: "Compare your current site with the proposed update side by side so changes feel obvious and low risk.",
  },
  {
    icon: Palette,
    title: "Brand-aware output",
    text: "Keep colors, fonts, spacing, and tone more consistent by using project context and saved brand rules.",
  },
  {
    icon: History,
    title: "Version confidence",
    text: "Save drafts, review previous versions, and restore with confidence when something needs to be rolled back.",
  },
  {
    icon: KeyRound,
    title: "Bring your own keys",
    text: "Use your own model keys or platform-managed access depending on how you want to scale and control costs.",
  },
  {
    icon: ShieldCheck,
    title: "Safe publishing",
    text: "Keep your live site protected until you explicitly publish the approved preview.",
  },
];

const steps = [
  {
    number: "01",
    title: "Connect your project",
    text: "Add your website, project context, brand rules, and deployment target so the system understands what it is working on.",
  },
  {
    number: "02",
    title: "Describe a change",
    text: "Ask for a redesign, copy improvement, layout cleanup, mobile fix, or section-specific update using everyday language.",
  },
  {
    number: "03",
    title: "Review the preview",
    text: "See what changed, compare it against the current site, inspect details visually, and refine without fear.",
  },
  {
    number: "04",
    title: "Publish when ready",
    text: "Approve the result, publish safely, and keep a version trail you can return to later.",
  },
];

const personas = [
  {
    title: "For founders and marketers",
    text: "Ship website improvements without waiting on a long dev queue for every headline, layout tweak, or conversion test.",
  },
  {
    title: "For designers and operators",
    text: "Review proposed UI changes visually, keep brand consistency tighter, and collaborate around safer previews.",
  },
  {
    title: "For developers",
    text: "Keep access to code, version history, logic review, and deployment workflows without making the product feel technical to everyone else.",
  },
];

function SectionLabel({ children }) {
  return (
    <Badge
      variant="secondary"
      className="rounded-full border border-violet-200 bg-violet-50 px-3 py-1 text-violet-700"
    >
      {children}
    </Badge>
  );
}

function BrowserPreview({ after = false }) {
  return (
    <div className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
      {/* Mini chrome bar */}
      <div className="flex items-center justify-between border-b border-slate-200 bg-white px-3 py-2">
        <div className="flex gap-1">
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
          <span className="h-2 w-2 rounded-full bg-slate-200" />
        </div>
        <span className={`rounded-full px-2 py-0.5 text-[10px] font-medium ${after ? "bg-violet-50 text-violet-700" : "bg-slate-100 text-slate-500"
          }`}>
          {after ? "After" : "Before"}
        </span>
      </div>
      {/* Hero block */}
      <div className={`px-3 py-4 ${after
        ? "bg-gradient-to-br from-slate-950 via-violet-950 to-slate-900 text-white"
        : "bg-slate-100 text-slate-900"
        }`}>
        <div className={`mb-1.5 inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] ${after ? "bg-white/10 text-violet-200" : "bg-white text-slate-500"
          }`}>
          <Bot className="h-2.5 w-2.5" />
          AI builder
        </div>
        <div className="text-xs font-semibold leading-snug">
          {after ? "Premium hero layout" : "Build with AI"}
        </div>
        <div className={`mt-1 text-[10px] leading-relaxed ${after ? "text-slate-300" : "text-slate-500"
          }`}>
          {after ? "Better CTA contrast, cleaner spacing." : "Describe your change in plain language."}
        </div>
        <div className="mt-2 flex gap-1.5">
          <div className={`rounded-lg px-2.5 py-1 text-[10px] font-medium ${after ? "bg-white text-slate-950" : "bg-slate-900 text-white"
            }`}>Start free</div>
          <div className={`rounded-lg px-2.5 py-1 text-[10px] ${after ? "border border-white/20 bg-white/5 text-white" : "border border-slate-200 bg-white text-slate-600"
            }`}>Demo</div>
        </div>
      </div>
      {/* Skeleton cards */}
      <div className="grid grid-cols-3 gap-2 bg-white p-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className={`rounded-xl border p-2 ${after ? "border-violet-100 bg-violet-50/40" : "border-slate-200 bg-slate-50"
            }`}>
            <div className={`mb-1.5 h-5 w-5 rounded-lg border border-slate-100 ${after ? "bg-white" : "bg-white"
              }`} />
            <div className="h-1.5 w-2/3 rounded bg-slate-200" />
            <div className="mt-1 h-1.5 w-full rounded bg-slate-100" />
          </div>
        ))}
      </div>
    </div>
  );
}

function FeatureCard({ icon: Icon, title, text }) {

  return (
    <Card className="rounded-[28px] border-slate-200 bg-white shadow-sm">
      <CardContent className="p-7">
        <div className="grid h-12 w-12 place-items-center rounded-2xl bg-violet-50 text-violet-700">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="mt-5 text-xl font-semibold text-slate-900">{title}</h3>
        <p className="mt-3 text-sm leading-7 text-slate-600">{text}</p>
      </CardContent>
    </Card>
  );
}

export function LandingPage() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-slate-50 text-slate-900">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <header className="sticky top-0 z-30 border-b border-slate-200/80 bg-white/90 backdrop-blur-xl">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white shadow-sm">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <div className="text-lg font-semibold tracking-tight">
                Code Helper Studio
              </div>
              <div className="text-xs text-slate-500">AI website workspace</div>
            </div>
          </div>

          <nav className="hidden items-center gap-8 md:flex">
            <a href="#why" className="text-sm text-slate-600 hover:text-slate-900">
              Why it works
            </a>
            <a href="#how" className="text-sm text-slate-600 hover:text-slate-900">
              How it works
            </a>
            <a href="#features" className="text-sm text-slate-600 hover:text-slate-900">
              Features
            </a>
            <a href="#faq" className="text-sm text-slate-600 hover:text-slate-900">
              FAQ
            </a>
          </nav>

          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              className="rounded-2xl text-slate-700"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
            <Button
              className="rounded-2xl bg-violet-600 px-5 text-white hover:bg-violet-700"
              onClick={() => navigate("/auth")}
            >
              Start free
            </Button>
          </div>
        </div>
      </header>

      {/* ── Hero ───────────────────────────────────────────────────── */}
      <section className="relative overflow-hidden border-b border-slate-200 bg-[radial-gradient(circle_at_top,#ede9fe,white_45%)]">
        <div className="absolute inset-x-0 top-0 h-[520px] bg-[linear-gradient(to_bottom,rgba(139,92,246,0.10),transparent)]" />
        <div className="absolute left-1/2 top-32 h-72 w-72 -translate-x-1/2 rounded-full bg-violet-200/30 blur-3xl" />

        <div className="relative mx-auto grid max-w-7xl items-start gap-12 px-4 py-16 sm:px-6 lg:grid-cols-[minmax(0,1.15fr)_420px] lg:px-8 lg:py-20">
          <div className="max-w-2xl">
            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.45 }}
            >
              <SectionLabel>Built for safer AI website changes</SectionLabel>
              <h1 className="mt-6 text-5xl font-semibold leading-[1.02] tracking-tight text-slate-950 sm:text-6xl">
                Your AI website team,
                <span className="block text-violet-600">
                  with preview, memory, and control.
                </span>
              </h1>
              <p className="mt-6 max-w-xl text-lg leading-8 text-slate-600">
                Code Helper Studio helps people improve websites faster by
                turning plain-language requests into safe visual previews,
                brand-aware changes, and controlled publishing.
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-12 rounded-2xl bg-slate-950 px-6 text-white hover:bg-slate-800"
                  onClick={() => navigate("/auth")}
                >
                  Start building for free{" "}
                  <ArrowRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-slate-200 px-6"
                >
                  <PlayCircle className="mr-2 h-4 w-4" /> Watch the workflow
                </Button>
              </div>

              <div className="mt-8 grid gap-3 sm:grid-cols-3">
                {[
                  "Safe before and after preview",
                  "Brand-aware AI changes",
                  "Drafts, versions, and restore",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-start gap-2 rounded-2xl border border-slate-200 bg-white/80 p-3 text-sm text-slate-700 backdrop-blur"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-600" />
                    {item}
                  </div>
                ))}
              </div>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.98, y: 18 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.08 }}
            className="relative lg:ml-auto lg:max-w-[420px]"
          >
            <Card className="overflow-hidden rounded-[32px] border-slate-200 bg-white shadow-[0_20px_80px_rgba(15,23,42,0.10)] max-h-[820px]">
              <CardContent className="p-0 overflow-hidden flex flex-col">
                <div className="border-b border-slate-200 px-5 py-4 shrink-0">
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="text-sm font-semibold text-slate-900">
                        Workspace Studio
                      </div>
                      <div className="text-xs text-slate-500">
                        See your site, request a change, review safely
                      </div>
                    </div>
                    <Badge
                      variant="secondary"
                      className="rounded-full bg-violet-50 text-violet-700"
                    >
                      Guided mode
                    </Badge>
                  </div>
                </div>

                <div className="flex flex-col gap-3 p-4 overflow-hidden">
                  {/* Before / After miniature previews */}
                  <div className="grid grid-cols-2 gap-3">
                    <BrowserPreview after={false} />
                    <BrowserPreview after />
                  </div>

                  {/* Prompt + What changed — stacked, compact */}
                  <div className="rounded-2xl border border-slate-200 bg-slate-50 p-3">
                    <div className="text-xs font-medium text-slate-500 mb-1.5">Prompt</div>
                    <div className="rounded-xl border border-slate-200 bg-white px-3 py-2 text-xs leading-5 text-slate-700 line-clamp-2">
                      Make the hero feel more premium, improve the CTA, keep brand colors.
                    </div>
                  </div>

                  <div className="rounded-2xl border border-slate-200 bg-white p-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-xs font-semibold text-slate-900">What changed</div>
                      <div className="text-[10px] text-slate-400">Plain-English review</div>
                    </div>
                    <div className="grid grid-cols-1 gap-1.5">
                      {[
                        "Cleaned the hero spacing",
                        "Made the primary CTA visible",
                        "Kept brand color direction",
                      ].map((item) => (
                        <div
                          key={item}
                          className="flex items-center gap-1.5 rounded-lg border border-slate-100 bg-slate-50 px-2.5 py-1.5 text-[11px] text-slate-700"
                        >
                          <BadgeCheck className="h-3 w-3 shrink-0 text-emerald-600" />
                          {item}
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </section>

      {/* ── Trust bar ──────────────────────────────────────────────── */}
      <section className="border-b border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-4 px-4 py-6 text-sm text-slate-500 sm:px-6 md:grid-cols-4 lg:px-8">
          {[
            [Bot, "AI-assisted changes"],
            [Workflow, "Guided visual workflow"],
            [Server, "Project + deploy aware"],
            [Lock, "Protected publishing"],
          ].map(([Icon, label]) => (
            <div
              key={label}
              className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3"
            >
              <Icon className="h-4 w-4 text-violet-600" />
              <span>{label}</span>
            </div>
          ))}
        </div>
      </section>

      {/* ── Why ────────────────────────────────────────────────────── */}
      <section
        id="why"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <SectionLabel>Why this system exists</SectionLabel>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            Most teams do not need more website tools. They need a safer way to
            make changes.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Website updates usually break down between vague requests, long
            feedback loops, inconsistent styling, and fear of publishing the
            wrong thing. Code Helper Studio reduces that friction by turning AI
            into a guided workspace instead of a black box.
          </p>
        </div>

        <div className="mt-12 grid gap-6 lg:grid-cols-3">
          {[
            {
              icon: MessageSquare,
              title: "The problem with normal AI chat",
              text: "Most tools generate once and forget context. Teams repeat themselves, lose consistency, and end up reviewing output with low confidence.",
            },
            {
              icon: Layers3,
              title: "The difference here",
              text: "This system carries project context, previous approved changes, brand rules, and visual review into the workflow.",
            },
            {
              icon: ShieldCheck,
              title: "The core promise",
              text: "You can request change quickly, see the result safely, and only publish when it looks right.",
            },
          ].map((item) => (
            <FeatureCard key={item.title} {...item} />
          ))}
        </div>
      </section>

      {/* ── How it works ───────────────────────────────────────────── */}
      <section
        id="how"
        className="border-y border-slate-200 bg-slate-100/70"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <SectionLabel>How it works</SectionLabel>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              A simple workflow for people who want results, not tool
              complexity.
            </h2>
            <p className="mt-5 text-lg leading-8 text-slate-600">
              The system is designed to feel understandable for non-technical
              users while still giving technical teams the control they expect.
            </p>
          </div>

          <div className="mt-12 grid gap-6 lg:grid-cols-4">
            {steps.map((step) => (
              <Card
                key={step.number}
                className="rounded-[28px] border-slate-200 bg-white shadow-sm"
              >
                <CardContent className="p-7">
                  <div className="text-sm font-semibold text-violet-600">
                    {step.number}
                  </div>
                  <h3 className="mt-4 text-xl font-semibold text-slate-900">
                    {step.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {step.text}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features ───────────────────────────────────────────────── */}
      <section
        id="features"
        className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8"
      >
        <div className="max-w-3xl">
          <SectionLabel>What you can do</SectionLabel>
          <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
            One workspace for AI generation, visual review, brand control, and
            publishing.
          </h2>
          <p className="mt-5 text-lg leading-8 text-slate-600">
            Instead of juggling disconnected tools, you get one guided
            environment for understanding the current site, proposing changes,
            reviewing output, and moving forward safely.
          </p>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature) => (
            <FeatureCard key={feature.title} {...feature} />
          ))}
        </div>
      </section>

      {/* ── Who it's for ───────────────────────────────────────────── */}
      <section className="border-y border-slate-200 bg-white">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 py-20 sm:px-6 lg:grid-cols-[minmax(0,1.1fr)_420px] lg:px-8">
          <div>
            <SectionLabel>Who this is for</SectionLabel>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              Built for mixed teams, not just developers.
            </h2>
            <div className="mt-8 space-y-4">
              {personas.map((item) => (
                <div
                  key={item.title}
                  className="rounded-[24px] border border-slate-200 bg-slate-50 p-6"
                >
                  <h3 className="text-xl font-semibold text-slate-900">
                    {item.title}
                  </h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">
                    {item.text}
                  </p>
                </div>
              ))}
            </div>
          </div>

          <Card className="rounded-[32px] border-slate-200 bg-slate-950 text-white shadow-sm">
            <CardContent className="p-8">
              <div className="inline-flex rounded-full bg-white/10 px-3 py-1 text-xs text-violet-100">
                Why teams stick with it
              </div>
              <h3 className="mt-5 text-3xl font-semibold">
                Less friction. More confidence. Faster shipping.
              </h3>
              <div className="mt-8 space-y-4 text-sm leading-7 text-slate-300">
                {[
                  "The AI uses project context instead of starting cold every time.",
                  "Review happens visually, not only in generated code blocks.",
                  "Brand consistency is easier to protect across iterations.",
                  "Publishing feels safer because preview, versions, and restore are part of the workflow.",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex gap-3 rounded-2xl border border-white/10 bg-white/5 p-4"
                  >
                    <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-emerald-400" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── What makes it different + CTA ──────────────────────────── */}
      <section className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-6 lg:grid-cols-2">
          <Card className="rounded-[32px] border-slate-200 bg-white shadow-sm">
            <CardContent className="p-8">
              <SectionLabel>What makes it different</SectionLabel>
              <h3 className="mt-5 text-3xl font-semibold text-slate-950">
                It explains the change, not just generates it.
              </h3>
              <div className="mt-6 space-y-4 text-sm leading-7 text-slate-600">
                <p>
                  The system does more than output UI. It helps people
                  understand what changed, compare it against the live version,
                  and decide what to do next.
                </p>
                <p>
                  That makes it more useful for approval, iteration, stakeholder
                  review, and safer deployment.
                </p>
              </div>
              <div className="mt-8 grid gap-3 sm:grid-cols-2">
                {[
                  ["Guided mode", MonitorSmartphone],
                  ["Visual inspector", MousePointerClick],
                  ["Version restore", GitBranch],
                  ["Brand memory", Palette],
                ].map(([label, Icon]) => (
                  <div
                    key={label}
                    className="flex items-center gap-3 rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm text-slate-700"
                  >
                    <Icon className="h-4 w-4 text-violet-600" />
                    {label}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card className="rounded-[32px] border-slate-200 bg-gradient-to-br from-violet-600 via-violet-700 to-slate-950 text-white shadow-sm">
            <CardContent className="p-8">
              <SectionLabel>Sign up</SectionLabel>
              <h3 className="mt-5 text-3xl font-semibold">
                Start improving your website with safer AI workflows.
              </h3>
              <p className="mt-5 text-sm leading-7 text-violet-100">
                Create a project, load your current site, and generate your
                first guided preview in minutes.
              </p>

              <div className="mt-8 space-y-3 rounded-[24px] border border-white/10 bg-white/5 p-4">
                {[
                  "Create your workspace",
                  "Add your site and brand context",
                  "Generate your first safe preview",
                ].map((item) => (
                  <div
                    key={item}
                    className="flex items-center gap-3 text-sm text-white"
                  >
                    <CheckCircle2 className="h-4 w-4 text-emerald-300" />
                    {item}
                  </div>
                ))}
              </div>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row">
                <Button
                  className="h-12 rounded-2xl bg-white px-6 text-slate-950 hover:bg-slate-100"
                  onClick={() => navigate("/auth")}
                >
                  Create free account <ChevronRight className="ml-1 h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  className="h-12 rounded-2xl border-white/20 bg-white/5 px-6 text-white hover:bg-white/10"
                >
                  Book a demo
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* ── FAQ ────────────────────────────────────────────────────── */}
      <section id="faq" className="border-t border-slate-200 bg-white">
        <div className="mx-auto max-w-5xl px-4 py-20 sm:px-6 lg:px-8">
          <div className="text-center">
            <SectionLabel>FAQ</SectionLabel>
            <h2 className="mt-5 text-4xl font-semibold tracking-tight text-slate-950">
              The questions people will ask before signing up
            </h2>
          </div>

          <div className="mt-12 space-y-4">
            {[
              [
                "Do I need to be a developer to use it?",
                "No. The guided workflow is built so non-technical users can request changes, review previews, and publish safely. Advanced users can go deeper when needed.",
              ],
              [
                "Will it change my live site immediately?",
                "No. The product is designed around safe preview first. Your live site stays unchanged until you explicitly publish.",
              ],
              [
                "Can I keep my brand consistent?",
                "Yes. The system uses saved brand rules, project context, and previous approved changes to reduce random styling drift.",
              ],
              [
                "Can I use my own model keys?",
                "Yes. You can bring your own keys or use managed platform access depending on your setup and pricing model.",
              ],
            ].map(([q, a]) => (
              <Card key={q} className="rounded-[24px] border-slate-200 shadow-sm">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-slate-950">{q}</h3>
                  <p className="mt-3 text-sm leading-7 text-slate-600">{a}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────── */}
      <footer className="border-t border-slate-200 bg-slate-50">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-4 py-10 text-sm text-slate-500 sm:px-6 lg:flex-row lg:items-center lg:justify-between lg:px-8">
          <div className="flex items-center gap-3">
            <div className="grid h-10 w-10 place-items-center rounded-2xl bg-violet-600 text-white">
              <Wand2 className="h-5 w-5" />
            </div>
            <div>
              <div className="font-semibold text-slate-900">
                Code Helper Studio
              </div>
              <div>
                AI website workspace for safer changes and faster publishing.
              </div>
            </div>
          </div>

          <div className="flex flex-wrap items-center gap-6">
            <a href="#features" className="hover:text-slate-900">
              Features
            </a>
            <a href="#how" className="hover:text-slate-900">
              How it works
            </a>
            <a href="#faq" className="hover:text-slate-900">
              FAQ
            </a>
            <a href="#" className="hover:text-slate-900">
              Privacy
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
