import {
  ArrowRight,
  ArrowUpRight,
  Browser,
  Calculator,
  CalendarCheck,
  ChatCircleText,
  Check,
  EnvelopeSimple,
  GitBranch,
  List,
  Minus,
  Plus,
  ShieldCheck,
  Sparkle,
  X,
} from "@phosphor-icons/react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";

type PageId = "home" | "services" | "examples" | "packages" | "contact" | "privacy" | "terms";
type ContactStatus = "idle" | "sending" | "success" | "error";

const navItems: Array<{ id: PageId; label: string; path: string }> = [
  { id: "home", label: "Home", path: "/" },
  { id: "services", label: "Services", path: "/services" },
  { id: "examples", label: "Examples", path: "/examples" },
  { id: "packages", label: "Packages", path: "/packages" },
  { id: "contact", label: "Contact", path: "/contact" },
];

const legalItems: Array<{ id: PageId; label: string; path: string }> = [
  { id: "privacy", label: "Privacy", path: "/privacy" },
  { id: "terms", label: "Terms", path: "/terms" },
];

const allPages = [...navItems, ...legalItems];
const pageByPath = new Map(allPages.map((item) => [item.path, item.id]));
const siteUrl = "https://example.com";

const imageAssets = {
  hero: "/assets/studio-hero.svg",
  workshop: "/assets/studio-workshop.svg",
  contact: "/assets/studio-contact.svg",
};

const pageMeta: Record<PageId, { title: string; description: string; path: string }> = {
  home: {
    title: "AI Build Studio | Websites & AI Tools for Small Businesses",
    description:
      "A customizable service website starter with responsive pages, sample calculators, and structured project inquiries.",
    path: "/",
  },
  services: {
    title: "Services | AI Build Studio",
    description:
      "Explore business websites, quote calculators, AI assistants, and focused automations. Choose a practical starting point for your business.",
    path: "/services/",
  },
  examples: {
    title: "Examples | AI Build Studio",
    description:
      "Explore demonstration service websites, calculators, and project inquiry flows.",
    path: "/examples/",
  },
  packages: {
    title: "Packages | AI Build Studio",
    description:
      "Compare website packages from $2,500, website and AI tool builds, and focused automations. Larger custom applications are quoted separately.",
    path: "/packages/",
  },
  contact: {
    title: "Contact | AI Build Studio",
    description:
      "Send a structured project inquiry to a business using its configured email provider.",
    path: "/contact/",
  },
  privacy: {
    title: "Privacy | AI Build Studio",
    description: "How AI Build Studio handles contact form submissions, email replies, analytics, and project inquiry data.",
    path: "/privacy/",
  },
  terms: {
    title: "Terms | AI Build Studio",
    description: "Basic website terms for using AI Build Studio and requesting project information.",
    path: "/terms/",
  },
};

const leadSystemParts: Array<{
  name: string;
  role: string;
  customerSees: string;
  ownerReceives: string;
}> = [
  {
    name: "A clearer website",
    role: "Show what you do, who you help, and how to get in touch.",
    customerSees: "Sharp pages, service clarity, proof, and one obvious next step.",
    ownerReceives: "A serious first impression before any AI layer is added.",
  },
  {
    name: "Better project requests",
    role: "Collect the service, timing, and budget details you need before replying.",
    customerSees: "A short path for need, timing, budget, and urgency.",
    ownerReceives: "A reply-ready email instead of a blank message.",
  },
  {
    name: "Useful quote tools",
    role: "Give customers a starting price range based on the work they need.",
    customerSees: "Useful guidance before they ask for a quote.",
    ownerReceives: "Better-qualified leads with expectations framed.",
  },
  {
    name: "AI front desk",
    role: "Answers common questions and routes people toward the right action.",
    customerSees: "A helpful assistant trained around the offer and FAQs.",
    ownerReceives: "Summaries with context, not a pile of chat transcripts.",
  },
  {
    name: "Owner view",
    role: "Shows the leads and follow-ups that need attention.",
    customerSees: "Nothing extra. The public experience stays simple.",
    ownerReceives: "Requests, priority, source, and next action in one view.",
  },
  {
    name: "Follow-up automation",
    role: "Reduces manual sorting, reminders, and repetitive handoffs.",
    customerSees: "Faster confirmations and clearer next steps.",
    ownerReceives: "Email summaries, routing, reminders, and workflow helpers.",
  },
];

type ExampleSystem = {
  title: string;
  audience: string;
  problem: string;
  customerPath: string;
  ownerHandoff: string;
  pieces: string[];
  liveUrl?: string;
  liveLabel?: string;
};

const exampleSystems: ExampleSystem[] = [
  {
    title: "Service website example",
    audience: "Local service company",
    problem: "Incomplete inquiries make it harder to plan the next conversation.",
    customerPath: "Read the offer and send a structured project inquiry.",
    ownerHandoff: "Project details arrive together when email delivery is configured.",
    pieces: ["Responsive pages", "Sample pricing", "Inquiry form"],
  },
  {
    title: "Quote-ready service site",
    audience: "Local service company",
    problem: "Pricing requests miss scope, timing, location, and urgency.",
    customerPath: "Choose service, answer quote questions, see a range, send.",
    ownerHandoff: "Budget range, timeline, and notes arrive ready to review.",
    pieces: ["Premium service page", "Quote-range calculator", "Request summary email"],
  },
  {
    title: "Consult-fit qualifier",
    audience: "Advisor or consultant",
    problem: "Discovery calls fill with poor-fit or unclear prospects.",
    customerPath: "Share goals, constraints, budget, and readiness.",
    ownerHandoff: "A short consult brief shows whether to book or redirect.",
    pieces: ["Positioning page", "Fit checker", "Consult brief"],
  },
  {
    title: "Booking-intake system",
    audience: "Appointment-led business",
    problem: "Booking requests arrive incomplete.",
    customerPath: "Pick service, answer readiness questions, choose timing.",
    ownerHandoff: "Service, urgency, contact details, and prep notes arrive together.",
    pieces: ["Guided booking path", "FAQ assistant", "Confirmation email"],
  },
  {
    title: "Lead follow-up desk",
    audience: "Owner-led team",
    problem: "Leads and next actions scatter across the inbox.",
    customerPath: "The public site stays simple while requests capture context.",
    ownerHandoff: "New requests, priority, source, and follow-up status stay visible.",
    pieces: ["Request table", "Priority tags", "Follow-up prompts"],
  },
];

const demoDossiers = [
  {
    label: "Demo 01",
    title: "Quote-ready service system",
    audience: "Local service company",
    promise: "Turn price shoppers into scoped requests before the owner replies.",
    buyerPath: ["Choose service type", "Answer scope questions", "See a realistic range", "Send a quote-ready request"],
    ownerPacket: [
      ["Need", "Website + quote estimator"],
      ["Budget signal", "$3,500-$6,500"],
      ["Timing", "Launch this month"],
      ["Reply angle", "Confirm scope and ask for two reference examples"],
    ],
    notes: ["Premium service page", "Quote range logic", "Resend summary email"],
  },
  {
    label: "Demo 02",
    title: "Consult-fit qualifier",
    audience: "Advisor or consultant",
    promise: "Help the right prospects explain goals, urgency, and fit before a discovery call.",
    buyerPath: ["Pick the goal", "Share constraints", "Choose readiness level", "Receive the best next step"],
    ownerPacket: [
      ["Need", "Consult request"],
      ["Fit signal", "High intent, budget known"],
      ["Timing", "Ready in 30 days"],
      ["Reply angle", "Send booking link with one prep question"],
    ],
    notes: ["Positioning page", "Fit checker", "Consult brief"],
  },
];

const packages = [
  {
    name: "Business website",
    price: "$2,500+",
    timeline: "1-2 weeks",
    bestFor: "A five-page website with a guided inquiry form",
    included: ["5 core pages", "Service-focused copy", "Guided inquiry form", "Mobile layout and launch"],
    projectType: "Website + request flow",
  },
  {
    name: "Website + AI tool",
    price: "$5,000+",
    timeline: "2-4 weeks",
    bestFor: "A website with one chatbot or quote calculator",
    included: ["Business website package", "One chatbot or calculator", "Inquiry summaries by email", "Launch support"],
    projectType: "AI lead system",
    featured: true,
  },
  {
    name: "Focused automation",
    price: "$3,500+",
    timeline: "2-3 weeks",
    bestFor: "One defined intake or follow-up workflow",
    included: ["One workflow map", "Smart request flow", "Email summaries", "Optional owner view, scoped first"],
    projectType: "Focused automation",
  },
];

const recommendationMap: Record<string, { title: string; body: string; pieces: string[] }> = {
  quoting: {
    title: "Quote-ready lead system",
    body: "Make pricing range clear before the visitor contacts you.",
    pieces: ["Offer page", "Quote calculator", "Structured request email"],
  },
  booking: {
    title: "Booking-intake system",
    body: "Collect the details that make a booking request useful.",
    pieces: ["Service page", "Guided booking flow", "Confirmation handoff"],
  },
  questions: {
    title: "AI front desk system",
    body: "Answer repeat questions and route the next step.",
    pieces: ["FAQ assistant", "Intake prompts", "Owner summary email"],
  },
  followup: {
    title: "Lead follow-up desk",
    body: "Prioritize, reply, and follow up from one clear handoff.",
    pieces: ["Request flow", "Lead summary", "Owner snapshot"],
  },
};

const projectTypes = ["Not sure yet", "AI lead system", "Website + request flow", "Quote calculator", "AI front desk", "Booking intake", "Focused automation", "Owner dashboard", "Custom business application"];

const trustItems = [
  "Public pages plus one guided lead path",
  "Project details delivered to your inbox",
  "Responsive pages for phones and desktops",
  "A written scope before work begins",
];

const deliverables = [
  {
    title: "Buyer path",
    body: "The page, form, calculator, assistant, or booking path the customer uses.",
  },
  {
    title: "Owner handoff",
    body: "A structured request with the details you need to decide, quote, book, or reply.",
  },
  {
    title: "Launch notes",
    body: "What shipped, what stayed out, and what to watch next.",
  },
];

const sampleBriefRows = [
  ["Customer action", "Quote request for website + estimator"],
  ["Friction captured", "Pricing uncertainty, timeline, service fit"],
  ["Recommended reply", "Confirm scope, ask for 2 examples, offer call"],
  ["Owner next step", "Reply today or mark for follow-up"],
];

const launchStandards = [
  ["Clear offer", "Visitors know what you do, who it is for, and why it is worth contacting you."],
  ["Useful intake", "The system asks the questions you would otherwise ask manually."],
  ["Clean handoff", "The email or owner view is written for action."],
  ["Lean stack", "Extra systems wait until they earn their place."],
];

const quoteDemoConfig = {
  services: [
    { id: "website", label: "Website + calculator", base: 3500 },
    { id: "intake", label: "Booking flow", base: 2500 },
    { id: "assistant", label: "AI front desk", base: 4200 },
  ],
  scopes: [
    { id: "simple", label: "Simple", multiplier: 1, note: "One offer, one buyer path, light copy polish" },
    { id: "standard", label: "Standard", multiplier: 1.35, note: "Multiple pages, deeper logic, stronger handoff" },
    { id: "advanced", label: "Advanced", multiplier: 1.75, note: "More branching, richer content, launch support" },
  ],
  timelines: [
    { id: "flexible", label: "Flexible", adjustment: 0, note: "Normal planning window" },
    { id: "soon", label: "This month", adjustment: 500, note: "Prioritize the first useful path" },
    { id: "rush", label: "ASAP", adjustment: 1200, note: "Tighter scope and faster decisions needed" },
  ],
};

const faqs = [
  {
    question: "Do I need AI on my website?",
    answer:
      "Not necessarily. A clear website and a good inquiry form may be enough. A chatbot, calculator, or automation belongs in the scope only when it has a useful job to do.",
  },
  {
    question: "Do I need a full app to start?",
    answer:
      "No. The strongest first version is usually one public-facing system that improves lead quality before adding accounts, payments, databases, or internal portals.",
  },
  {
    question: "Are the prices fixed?",
    answer:
      "They are starting prices for the listed scope. You receive a written proposal covering features, price, and timing before work begins. Additional features are agreed and priced separately.",
  },
  {
    question: "Does this starter include a full business platform?",
    answer:
      "No. The starter includes public pages, example calculators, and an inquiry form. Accounts, payments, AI chatbots, and customer dashboards require separate implementation.",
  },
  {
    question: "What about ongoing costs?",
    answer:
      "Hosting, AI usage, email services, and ongoing support are identified in the proposal. They are separate from the build price unless explicitly included in your agreed scope.",
  },
  {
    question: "What should I send first?",
    answer:
      "Tell me about your business, what is not working, and what you want to change. Share your current website if you have one. You do not need a technical specification to start a conversation.",
  },
];

function App() {
  const [page, setPage] = useState<PageId>(() => getPageFromPath());
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const onPopState = () => {
      setPage(getPageFromPath());
      setMenuOpen(false);
    };
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    applyPageMeta(page);
  }, [page]);

  useEffect(() => {
    if (!menuOpen) return;
    const onEscape = (event: KeyboardEvent) => {
      if (event.key !== "Escape") return;
      setMenuOpen(false);
      document.querySelector<HTMLButtonElement>(".mobile-menu-button")?.focus();
    };
    window.addEventListener("keydown", onEscape);
    return () => window.removeEventListener("keydown", onEscape);
  }, [menuOpen]);

  const navigate = (id: PageId) => {
    const target = allPages.find((item) => item.id === id) ?? navItems[0];
    window.history.pushState({}, "", target.path);
    setPage(id);
    setMenuOpen(false);
    window.scrollTo({ top: 0, behavior: window.matchMedia("(prefers-reduced-motion: reduce)").matches ? "instant" : "smooth" });
  };

  return (
    <>
      <a className="skip-link" href="#main-content">Skip to content</a>
      <Header currentPage={page} menuOpen={menuOpen} onNavigate={navigate} onToggleMenu={() => setMenuOpen((open) => !open)} />
      <main id="main-content" tabIndex={-1}>
        {page === "home" && <HomePage onNavigate={navigate} />}
        {page === "services" && <ServicesPage onNavigate={navigate} />}
        {page === "examples" && <ExamplesPage onNavigate={navigate} />}
        {page === "packages" && <PackagesPage onNavigate={navigate} />}
        {page === "contact" && <ContactPage />}
        {page === "privacy" && <PrivacyPage />}
        {page === "terms" && <TermsPage />}
      </main>
      <Footer onNavigate={navigate} />
    </>
  );
}

function Header({
  currentPage,
  menuOpen,
  onNavigate,
  onToggleMenu,
}: {
  currentPage: PageId;
  menuOpen: boolean;
  onNavigate: (id: PageId) => void;
  onToggleMenu: () => void;
}) {
  return (
    <header className="site-header">
      <a
        className="brand"
        href="/"
        onClick={(event) => {
          if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
          event.preventDefault();
          onNavigate("home");
        }}
      >
        <span className="brand-wordmark">AI Build Studio</span>
        <span className="brand-line">Websites & AI tools</span>
      </a>

      <nav className="desktop-nav" aria-label="Main navigation">
        {navItems.map((item) => (
          <a
            key={item.id}
            href={item.path}
            className={currentPage === item.id ? "active" : ""}
            aria-current={currentPage === item.id ? "page" : undefined}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
              event.preventDefault();
              onNavigate(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>

      <button className="button header-button" type="button" onClick={() => onNavigate("contact")}>
        Discuss your project
        <ArrowRight size={16} weight="bold" aria-hidden="true" />
      </button>

      <button className="icon-button mobile-menu-button" type="button" aria-label={menuOpen ? "Close menu" : "Open menu"} aria-expanded={menuOpen} aria-controls="mobile-navigation" onClick={onToggleMenu}>
        {menuOpen ? <X size={20} weight="bold" /> : <List size={20} weight="bold" />}
      </button>

      {menuOpen && (
        <nav id="mobile-navigation" className="mobile-nav" aria-label="Mobile navigation">
          {navItems.map((item) => (
            <a
              key={item.id}
              href={item.path}
              className={currentPage === item.id ? "active" : ""}
              aria-current={currentPage === item.id ? "page" : undefined}
              onClick={(event) => {
                if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
                event.preventDefault();
                onNavigate(item.id);
              }}
            >
              {item.label}
            </a>
          ))}
        </nav>
      )}
    </header>
  );
}

function HomePage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <>
      <section className="hero">
        <img className="hero-background" src={imageAssets.hero} alt="" fetchPriority="high" />
        <div className="hero-copy">
          <p className="eyebrow">AI Build Studio</p>
          <h1>Websites &amp; AI tools for small businesses.</h1>
          <p>
            Give customers a clear reason to choose you. I build professional websites and practical tools that make it easier to ask questions, request a quote, and take the next step.
          </p>
          <div className="button-row">
            <button className="button primary" type="button" onClick={() => onNavigate("contact")}>
              Discuss your project
              <ArrowRight size={18} weight="bold" aria-hidden="true" />
            </button>
            <a className="button secondary" href="#live-work">See my work <ArrowUpRight size={18} aria-hidden="true" /></a>
          </div>
          <div className="hero-notes" aria-label="Project approach">
            <span><Check size={18} aria-hidden="true" /> Work directly with the builder</span>
            <span><Check size={18} aria-hidden="true" /> Written scope</span>
            <span><Check size={18} aria-hidden="true" /> Review before launch</span>
          </div>
          <p className="hero-budget">Website packages from $2,500. Custom applications quoted separately.</p>
        </div>
      </section>

      <LiveProject />

      <BuyerServices />
      <WorkingTogether onNavigate={onNavigate} />
      <PackagePreview />
      <FAQSection />
      <CTA onNavigate={onNavigate} />
    </>
  );
}

function LiveProject() {
  return (
    <section className="section live-project" id="live-work">
      <div className="live-project-layout">
        <div>
          <p className="eyebrow">Starter example</p>
          <h2>A service website with useful intake</h2>
          <p>This starter includes responsive pages, a sample quote calculator, and a project inquiry form. Its examples and prices are demonstration content.</p>
          <dl className="project-details-list">
            <div><dt>The website</dt><dd>Service pages, sample pricing, and an interactive calculator.</dd></div>
            <div><dt>The next step</dt><dd>A structured inquiry sent through a configured email provider.</dd></div>
          </dl>
          <a className="case-link" href="/examples">Explore the examples <ArrowUpRight size={18} aria-hidden="true" /></a>
          <p className="project-caption">No live customer system or customer data is included.</p>
        </div>
        <figure>
          <img src="/assets/studio-workshop.svg" width="1440" height="960" loading="lazy" alt="Illustrated website layout placeholder" />
          <figcaption>Service website <span>Pages + project inquiry</span></figcaption>
          <p className="project-scope">Customize the example content and configure your own services before deployment.</p>
        </figure>
      </div>
    </section>
  );
}

function ServicesPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <>
      <PageHero
        eyebrow="Services"
        title="Websites and tools with a clear job to do."
        body="Help customers understand your services, ask better questions, and reach the right next step."
      />
      <section className="section">
        <SystemPartGrid />
      </section>
      <RecommendationSection />
      <WorkingTogether onNavigate={onNavigate} />
      <CTA onNavigate={onNavigate} />
    </>
  );
}

function BuyerServices() {
  const services = [
    {
      icon: Browser,
      title: "A website you can send customers to",
      body: "Present your services clearly, look professional on mobile, and give people an obvious way to contact you.",
      detail: "Service pages, useful copy, and a guided inquiry form.",
      action: "Discuss a business website",
      project: "Website + request flow",
    },
    {
      icon: Calculator,
      title: "Useful answers before the first call",
      body: "Help people understand a price range or get answers to common questions before they reach out.",
      detail: "A quote calculator or a focused AI assistant.",
      action: "Discuss an AI or quote tool",
      project: "AI lead system",
    },
    {
      icon: GitBranch,
      title: "Software for the way you work",
      body: "Bring a specific workflow into one place, from collecting requests to reviewing and following up.",
      detail: "Custom applications, dashboards, and integrations.",
      action: "Discuss custom software",
      project: "Custom business application",
    },
  ];

  return (
    <section className="section buyer-services">
      <SectionIntro eyebrow="What I can build for you" title="Start with what your business needs." body="A new website, one useful tool, or a larger application. The scope starts with the problem you want to solve." />
      <div className="buyer-service-grid">
        {services.map(({ icon: Icon, ...service }) => (
          <article key={service.project}>
            <Icon size={30} weight="regular" aria-hidden="true" />
            <h3>{service.title}</h3>
            <p>{service.body}</p>
            <p className="service-deliverable">{service.detail}</p>
            <a className="text-action" href={`/contact?project=${encodeURIComponent(service.project)}`}>
              {service.action}<ArrowRight size={18} aria-hidden="true" />
            </a>
          </article>
        ))}
      </div>
    </section>
  );
}

function WorkingTogether({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  const steps = [
    ["Agree on the scope", "We define the features, price, timeline, and any ongoing costs before development starts."],
    ["Review a working version", "You see the build in a private preview and give feedback before anything is published."],
    ["Launch with a clear handoff", "We check the agreed pages and forms, then document what is included and how ongoing support will work."],
  ];
  return (
    <section id="how-we-work" className="section working-together">
      <div className="working-layout">
        <div className="working-intro">
          <p className="eyebrow">Work directly with the builder</p>
          <h2>Your project.<span>One person to talk to.</span></h2>
          <p>Introduce your business and explain how you help customers here.</p>
          <p>You don't need to arrive with every answer. We start with what your business needs.</p>
          <button className="text-action" type="button" onClick={() => onNavigate("contact")}>Discuss your project <ArrowRight size={18} aria-hidden="true" /></button>
        </div>
        <ol className="working-steps">
          {steps.map(([title, body], index) => (
            <li key={title}>
              <span className="step-number" aria-hidden="true">{String(index + 1).padStart(2, "0")}</span>
              <div><h3>{title}</h3><p>{body}</p></div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}

function RecommendationSection() {
  return (
    <section className="section recommendation-section">
      <div className="split recommendation-split">
        <div>
          <p className="eyebrow">Find your starting point</p>
          <h2>What keeps slowing you down?</h2>
          <p>Pricing questions, incomplete bookings, or leads waiting for a reply. A focused tool can help with one specific problem.</p>
          <a className="text-action" href="/packages">Compare starting prices <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <RecommendationTool />
      </div>
    </section>
  );
}

function ExamplesPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <>
      <PageHero
        eyebrow="Examples"
        title="See the work. Explore the possibilities."
        body="A live product, followed by sample tools for other small-business workflows."
      />
      <LiveProject />
      <DemoDossierSection />
      <QuoteFlowDemo />
      <section className="section work-preview">
        <SectionIntro
          eyebrow="More starting points"
          title="Ideas for your business."
          body="Illustrative concepts for service businesses, consultants, and small teams."
        />
        <ExampleShowcase />
      </section>
      <CTA onNavigate={onNavigate} />
    </>
  );
}

function PackagesPage({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <>
      <PageHero
        eyebrow="Packages"
        title="A clear starting price. A scope we agree on."
        body="Start with a website or one focused workflow. Larger applications are quoted separately, with features, timing, and ongoing costs agreed before work begins."
      />
      <section className="section package-section">
        <PackageCards />
        <PackageScopeNote />
        <CustomApplicationOffer />
      </section>
      <DeliveryStandardSection />
      <FAQSection />
      <CTA onNavigate={onNavigate} />
    </>
  );
}

function ContactPage() {
  return (
    <>
      <PageHero eyebrow="Discuss your project" title="Tell me what your business needs." body="I'll review your idea personally and reply with a practical next step. An inquiry starts a conversation, not a commitment." />
      <section className="section contact-section">
        <div className="contact-layout">
          <ContactForm />
          <ContactAside />
        </div>
      </section>
    </>
  );
}

function PrivacyPage() {
  return (
    <>
      <PageHero
        eyebrow="Privacy"
        title="Privacy and project inquiries."
        body="What you share when you get in touch, how it is used, and the services that help this website run."
      />
      <PolicySection
        sections={[
          {
            title: "Information collected",
            items: [
              "Contact form submissions may include your name, email, business name, project type, budget range, timeline, and message.",
              "Technical logs may be processed by Cloudflare Pages to keep the site secure and available.",
              "Sending an inquiry does not create a customer account or payment profile.",
            ],
          },
          {
            title: "How information is used",
            items: [
              "Project inquiry details are used to reply, scope the request, and plan a possible build.",
              "Contact submissions are delivered to our inbox using the configured email service, Cloudflare Email or Resend.",
              "Information is not sold or used to create unrelated marketing profiles.",
            ],
          },
          {
            title: "Website analytics",
            items: [
              "When enabled, Google Analytics measures visits and page interactions and uses cookies to distinguish visitors and sessions.",
              "Cloudflare Web Analytics may also measure page views and website performance. These tools help us understand which pages are useful and where the website needs improvement.",
              "Please keep passwords, payment details, and private customer records out of project messages.",
            ],
          },
        ]}
      />
    </>
  );
}

function TermsPage() {
  return (
    <>
      <PageHero
        eyebrow="Terms"
        title="Basic website terms."
        body="This site describes AI Build Studio services and lets visitors send project inquiries. A submitted form does not create a contract or guarantee availability."
      />
      <PolicySection
        sections={[
          {
            title: "Use of the site",
            items: [
              "The website is provided for general information and project inquiry purposes.",
              "Package prices are starting ranges and final project scope, timing, and cost must be confirmed in writing.",
              "Do not submit sensitive credentials, payment information, or private customer data through the contact form.",
            ],
          },
          {
            title: "Project discussions",
            items: [
              "A project starts only after scope, timeline, payment terms, and responsibilities are agreed separately.",
              "AI features, automations, and integrations depend on the tools, data, and constraints involved in each project.",
              "The current website does not provide legal, financial, medical, or compliance advice.",
            ],
          },
        ]}
      />
    </>
  );
}

function RecommendationTool() {
  const [friction, setFriction] = useState("quoting");
  const recommendation = recommendationMap[friction];

  return (
    <aside className="recommendation-tool" aria-label="Project recommendation demo">
      <div className="tool-header">
        <Sparkle size={19} weight="duotone" aria-hidden="true" />
        <div>
          <h2>Project recommendation</h2>
          <p>An illustrative starting point.</p>
        </div>
      </div>
      <div className="segmented-control" aria-label="Current lead friction">
        {[
          ["quoting", "Pricing"],
          ["booking", "Booking"],
          ["questions", "Questions"],
          ["followup", "Follow-up"],
        ].map(([value, label]) => (
          <button className={friction === value ? "active" : ""} aria-pressed={friction === value} type="button" key={value} onClick={() => setFriction(value)}>
            {label}
          </button>
        ))}
      </div>
      <div className="recommendation-result" aria-live="polite" aria-atomic="true">
        <small>A possible starting point</small>
        <h3>{recommendation.title}</h3>
        <p>{recommendation.body}</p>
        <ul>
          {recommendation.pieces.map((piece) => (
            <li key={piece}>
              <Check size={15} weight="bold" aria-hidden="true" />
              <span>{piece}</span>
            </li>
          ))}
        </ul>
        <p className="estimate-note">Your price is confirmed after we review the scope.</p>
      </div>
      <a className="button primary" href={`/contact?project=${encodeURIComponent({ quoting: "Quote calculator", booking: "Booking intake", questions: "AI front desk", followup: "Owner dashboard" }[friction] ?? "AI lead system")}`}>Discuss this build <ArrowRight size={18} aria-hidden="true" /></a>
    </aside>
  );
}

function SectionIntro({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <div className="section-intro">
      <p className="eyebrow">{eyebrow}</p>
      <h2>{title}</h2>
      <p>{body}</p>
    </div>
  );
}

function PageHero({ eyebrow, title, body }: { eyebrow: string; title: string; body: string }) {
  return (
    <section className="page-hero">
      <p className="eyebrow">{eyebrow}</p>
      <h1>{title}</h1>
      <p>{body}</p>
    </section>
  );
}

function SystemPartGrid({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`system-grid ${compact ? "compact" : ""}`}>
      {(compact ? leadSystemParts.slice(0, 3) : leadSystemParts).map((part) => (
        <article key={part.name}>
          <h3>{part.name}</h3>
          <p>{part.role}</p>
          {!compact && (
            <dl>
              <div>
                <dt>Customer sees</dt>
                <dd>{part.customerSees}</dd>
              </div>
              <div>
                <dt>Owner receives</dt>
                <dd>{part.ownerReceives}</dd>
              </div>
            </dl>
          )}
        </article>
      ))}
    </div>
  );
}

function ExampleShowcase({ limit }: { limit?: number }) {
  const concepts = exampleSystems.filter((example) => !example.liveUrl);
  const items = typeof limit === "number" ? concepts.slice(0, limit) : concepts;

  return (
    <div className="example-stack">
      {items.map((example) => (
        <article className="example-case" key={example.title}>
          <div>
            <span>{example.audience}</span>
            <h2>{example.title}</h2>
          </div>
          <div className="case-columns">
            <div>
              <strong>Problem</strong>
              <p>{example.problem}</p>
            </div>
            <div>
              <strong>Customer path</strong>
              <p>{example.customerPath}</p>
            </div>
            <div>
              <strong>Owner handoff</strong>
              <p>{example.ownerHandoff}</p>
            </div>
          </div>
          {example.liveUrl && (
            <a className="case-link" href={example.liveUrl} target="_blank" rel="noreferrer">
              {example.liveLabel ?? "View live example"}
              <ArrowRight size={16} weight="bold" />
            </a>
          )}
          <ul>
            {example.pieces.map((piece) => (
              <li key={piece}>{piece}</li>
            ))}
          </ul>
        </article>
      ))}
    </div>
  );
}

function DemoDossierSection() {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const selected = demoDossiers[selectedIndex] ?? demoDossiers[0];

  return (
    <section className="section dossier-section">
      <div className="dossier-shell">
        <div className="dossier-copy">
          <p className="eyebrow">Sample projects</p>
          <h2>What your customer does. What you receive.</h2>
          <p>
            Illustrative projects showing the questions a customer answers and the summary your team receives.
          </p>
          <div className="dossier-tabs" aria-label="Demo dossier selector">
            {demoDossiers.map((dossier, index) => (
              <button
                className={selectedIndex === index ? "active" : ""}
                aria-pressed={selectedIndex === index}
                type="button"
                key={dossier.title}
                onClick={() => setSelectedIndex(index)}
              >
                <span>{dossier.label}</span>
                {dossier.title}
              </button>
            ))}
          </div>
        </div>
        <article className="dossier-board">
          <div className="dossier-board-header">
            <span>{selected.audience}</span>
            <h3>{selected.title}</h3>
            <p>{selected.promise}</p>
          </div>
          <div className="dossier-grid">
            <div className="buyer-path-preview">
              <span>Buyer path</span>
              <ol>
                {selected.buyerPath.map((step) => (
                  <li key={step}>{step}</li>
                ))}
              </ol>
            </div>
            <div className="owner-packet-preview">
              <span>Owner packet</span>
              <dl>
                {selected.ownerPacket.map(([label, value]) => (
                  <div key={label}>
                    <dt>{label}</dt>
                    <dd>{value}</dd>
                  </div>
                ))}
              </dl>
            </div>
          </div>
          <ul className="dossier-notes">
            {selected.notes.map((note) => (
              <li key={note}>{note}</li>
            ))}
          </ul>
        </article>
      </div>
    </section>
  );
}

function QuoteFlowDemo() {
  const [serviceId, setServiceId] = useState("website");
  const [scopeId, setScopeId] = useState("standard");
  const [timelineId, setTimelineId] = useState("soon");

  const service = quoteDemoConfig.services.find((item) => item.id === serviceId) ?? quoteDemoConfig.services[0];
  const scope = quoteDemoConfig.scopes.find((item) => item.id === scopeId) ?? quoteDemoConfig.scopes[1];
  const timeline = quoteDemoConfig.timelines.find((item) => item.id === timelineId) ?? quoteDemoConfig.timelines[1];
  const low = Math.round((service.base * scope.multiplier + timeline.adjustment) / 250) * 250;
  const high = low + (scope.id === "advanced" ? 3500 : scope.id === "standard" ? 2500 : 1500);
  const priority = timeline.id === "rush" ? "High" : timeline.id === "soon" ? "Medium" : "Normal";

  return (
    <section className="section live-demo-section">
      <div className="live-demo-shell">
        <div className="live-demo-copy">
          <p className="eyebrow">Sample quote calculator</p>
          <h2>Try the quote flow.</h2>
          <p>Fictional sample values, not AI Build Studio package prices. A calculator for your business would use your own pricing rules.</p>
          <a className="text-action" href="/contact?project=Quote%20calculator">Discuss a calculator <ArrowRight size={18} aria-hidden="true" /></a>
        </div>
        <div className="quote-demo">
          <div className="quote-panel customer-panel">
            <div className="panel-heading">
              <span>Customer path</span>
              <h3>Project fit check</h3>
            </div>
            <DemoChoiceGroup
              label="What are you trying to improve?"
              value={serviceId}
              options={quoteDemoConfig.services}
              onChange={setServiceId}
            />
            <DemoChoiceGroup label="How complex is the first version?" value={scopeId} options={quoteDemoConfig.scopes} onChange={setScopeId} />
            <DemoChoiceGroup label="When do you want to launch?" value={timelineId} options={quoteDemoConfig.timelines} onChange={setTimelineId} />
            <div className="range-result" aria-live="polite" aria-atomic="true">
              <span>Sample calculation, not a quote</span>
              <strong>
                {formatCurrency(low)} - {formatCurrency(high)}
              </strong>
              <p>{scope.note}.</p>
            </div>
          </div>
          <div className="quote-panel owner-panel">
            <div className="panel-heading">
              <span>Owner packet</span>
              <h3>Ready-to-reply summary</h3>
            </div>
            <dl className="owner-summary-list">
              <div>
                <dt>Request</dt>
                <dd>{service.label}</dd>
              </div>
              <div>
                <dt>Scope signal</dt>
                <dd>{scope.label}</dd>
              </div>
              <div>
                <dt>Timing</dt>
                <dd>{timeline.label}</dd>
              </div>
              <div>
                <dt>Priority</dt>
                <dd>{priority}</dd>
              </div>
            </dl>
            <div className="reply-note">
              <ChatCircleText size={18} weight="duotone" aria-hidden="true" />
              <p>
                Suggested reply: confirm the main offer and propose the smallest first build.
              </p>
            </div>
            <div className="handoff-strip">
              <span>Structured email</span>
              <span>No login required</span>
              <span>Project details included</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

function DemoChoiceGroup({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Array<{ id: string; label: string }>;
  onChange: (value: string) => void;
}) {
  return (
    <fieldset className="demo-choice-group">
      <legend>{label}</legend>
      <div>
        {options.map((option) => (
          <button className={value === option.id ? "active" : ""} aria-pressed={value === option.id} type="button" key={option.id} onClick={() => onChange(option.id)}>
            {option.label}
          </button>
        ))}
      </div>
    </fieldset>
  );
}

function formatCurrency(value: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function ProcessRail() {
  const steps = [
    ["Map the lead", "What does the customer want, what do you need to know, and where should the request land?"],
    ["Build the first path", "Create the page, tool, assistant, or form that improves that one moment."],
    ["Launch and learn", "Ship the first version, watch what people use, and add only what earns its place."],
  ];

  return (
    <div className="process-rail">
      {steps.map(([title, body], index) => (
        <article key={title}>
          <span>{String(index + 1).padStart(2, "0")}</span>
          <h3>{title}</h3>
          <p>{body}</p>
        </article>
      ))}
    </div>
  );
}

function ArtifactSection({ dark = false }: { dark?: boolean }) {
  return (
    <section className={`section artifact-section ${dark ? "contrast-section" : ""}`}>
      <div className="split artifact-split">
        <div>
          <p className="eyebrow">Proof of shape</p>
          <h2>You should be able to picture the deliverable before you hire me.</h2>
          <p>The first version is a visible customer path and a useful owner handoff.</p>
          <div className="deliverable-list">
            {deliverables.map((item) => (
              <article key={item.title}>
                <span>{item.title}</span>
                <p>{item.body}</p>
              </article>
            ))}
          </div>
        </div>
        <ArtifactPreview />
      </div>
    </section>
  );
}

function ArtifactPreview() {
  return (
    <aside className="artifact-preview" aria-label="Sample owner handoff">
      <div className="artifact-preview-top">
        <span>Sample owner handoff</span>
        <strong>Qualified request</strong>
      </div>
      <div className="artifact-rows">
        {sampleBriefRows.map(([label, value]) => (
          <div key={label}>
            <dt>{label}</dt>
            <dd>{value}</dd>
          </div>
        ))}
      </div>
      <div className="artifact-message">
        <ChatCircleText size={18} weight="duotone" aria-hidden="true" />
        <p>
          "I need a better way to explain pricing before people contact me. Budget is likely $3,500-$6,500. Hoping to
          launch this month."
        </p>
      </div>
      <div className="artifact-footer">
        <span>Ready to reply</span>
        <span>Sent by Resend</span>
      </div>
    </aside>
  );
}

function DeliveryStandardSection() {
  return (
    <section className="section contrast-section standard-section">
      <div className="split">
        <div>
          <p className="eyebrow">Launch standard</p>
          <h2>Know what you're getting.</h2>
          <p>We agree on the customer experience, deliverables, and launch checks before building.</p>
        </div>
        <div className="standard-grid">
          {launchStandards.map(([title, body]) => (
            <article key={title}>
              <span>{title}</span>
              <p>{body}</p>
            </article>
          ))}
        </div>
      </div>
      <div className="guardrail-grid">
        {trustItems.map((item) => (
          <article key={item}>
            <ShieldCheck size={18} weight="duotone" aria-hidden="true" />
            <span>{item}</span>
          </article>
        ))}
      </div>
    </section>
  );
}

function PackagePreview() {
  return (
    <section className="section">
      <SectionIntro
        eyebrow="Packages"
        title="Start with a focused build."
        body="Website and focused-tool packages, with a written scope before work begins."
      />
      <PackageCards compact />
      <PackageScopeNote />
      <CustomApplicationOffer />
    </section>
  );
}

function PackageCards({ compact = false }: { compact?: boolean }) {
  return (
    <div className={`package-cards ${compact ? "compact" : ""}`}>
      {packages.map((pkg) => (
        <article className={pkg.featured ? "featured" : ""} key={pkg.name}>
          <div className="package-top">
            <span>{pkg.name}</span>
            {pkg.featured && <em>One added tool</em>}
          </div>
          <strong>{pkg.price}<span>Starting build price</span></strong>
          <p>{pkg.bestFor}</p>
          <small>Planning estimate: {pkg.timeline}</small>
          <ul>
            {pkg.included.map((item) => (
              <li key={item}>
                <Check size={16} weight="bold" aria-hidden="true" />
                <span>{item}</span>
              </li>
            ))}
          </ul>
          <a className={`button ${pkg.featured ? "primary" : "secondary"}`} href={`/contact?project=${encodeURIComponent(pkg.projectType)}`} aria-label={`Discuss the ${pkg.name} package`}>
            Discuss this package
            <ArrowRight size={17} weight="bold" aria-hidden="true" />
          </a>
        </article>
      ))}
    </div>
  );
}

function PackageScopeNote() {
  return <p className="package-scope-note">Starting prices cover the listed scope, not a complete software platform. Additional integrations, ongoing services, and support are quoted separately.</p>;
}

function CustomApplicationOffer() {
  return (
    <div className="custom-build">
      <div>
        <p className="eyebrow">Beyond a website</p>
        <h3>Custom business applications</h3>
        <p>Accounts, payments, dashboards, or connected workflows. Let's define what your business needs and what the first version should include.</p>
      </div>
      <div className="custom-build-action">
        <strong>Quoted after scope review</strong>
        <p>Features, integrations, and support agreed before pricing.</p>
        <a className="button primary" href={`/contact?project=${encodeURIComponent("Custom business application")}`}>
          Discuss a custom application
          <ArrowRight size={18} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </div>
  );
}

function FAQSection() {
  return (
    <section id="questions" className="section faq-section">
      <SectionIntro
        eyebrow="Questions"
        title="A few things you may be wondering."
        body="Practical answers before we talk."
      />
      <div className="faq-grid">
        {faqs.map((faq) => (
          <details key={faq.question}>
            <summary>
              <span>{faq.question}</span>
              <Plus className="faq-plus" size={24} weight="bold" aria-hidden="true" />
              <Minus className="faq-minus" size={24} weight="bold" aria-hidden="true" />
            </summary>
            <p>{faq.answer}</p>
          </details>
        ))}
      </div>
    </section>
  );
}

function ContactForm() {
  const [status, setStatus] = useState<ContactStatus>("idle");
  const [error, setError] = useState("");
  const requestedProject = new URLSearchParams(window.location.search).get("project") ?? "";
  const selectedProject = projectTypes.includes(requestedProject) ? requestedProject : "Not sure yet";

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (status === "sending") return;
    setStatus("sending");
    setError("");

    const form = event.currentTarget;
    const formData = new FormData(form);
    const payload = Object.fromEntries(formData.entries());

    try {
      const response = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.headers.get("content-type")?.includes("application/json")) {
        throw new Error("Your request couldn't be sent. Please try again shortly; your details are still here.");
      }
      const result = (await response.json()) as { ok?: boolean; error?: string };

      if (!response.ok || !result.ok) {
        throw new Error(result.error ?? "Something went wrong. Please try again.");
      }

      setStatus("success");
      form.reset();
    } catch (caughtError) {
      setStatus("error");
      setError(caughtError instanceof Error ? caughtError.message : "Something went wrong. Please try again.");
    }
  };

  if (status === "success") {
    return (
      <div className="contact-form form-confirmation" role="status">
        <Check size={32} aria-hidden="true" />
        <h2>Thank you. Your inquiry was sent.</h2>
        <p>I'll review your project and reply to the email address you provided.</p>
        <button className="button secondary" type="button" onClick={() => setStatus("idle")}>Send another inquiry</button>
      </div>
    );
  }

  return (
    <form className="contact-form" onSubmit={handleSubmit} aria-busy={status === "sending"}>
      <h2>Your project</h2>
      <p className="form-intro">A new website, a useful tool, or a problem you want to solve. Let's see what fits.</p>
      <input className="honeypot" type="text" name="companyWebsite" tabIndex={-1} autoComplete="off" aria-hidden="true" />
      <div className="form-row">
        <Field label="Name" name="name" autoComplete="name" required />
        <Field label="Email" name="email" type="email" autoComplete="email" required />
      </div>
      <Field label="Business name (optional)" name="business" autoComplete="organization" />
      <label>
        <span>What would you like help with?</span>
        <textarea name="message" rows={4} maxLength={2000} required placeholder="My business is... I'd like to improve... My current website is..." />
      </label>
      <details className="project-details" open={requestedProject ? true : undefined}>
        <summary>Project details (optional)</summary>
        <div className="optional-fields">
          <label>
            <span>Project type</span>
            <select name="projectType" defaultValue={selectedProject}>
              {projectTypes.map((type) => <option key={type}>{type}</option>)}
            </select>
          </label>
          <div className="form-row">
        <label>
          <span>Budget range</span>
          <select name="budget" defaultValue="Not sure yet">
            <option>Not sure yet</option>
            <option>$2,500 - $3,500</option>
            <option>$3,500 - $7,500</option>
            <option>$7,500+</option>
          </select>
        </label>
        <label>
          <span>Timeline</span>
          <select name="timeline" defaultValue="Flexible">
            <option>This month</option>
            <option>Next 1-2 months</option>
            <option>Flexible</option>
          </select>
        </label>
          </div>
        </div>
      </details>
      <label className="consent-field">
        <input type="checkbox" name="consent" required />
        <span>AI Build Studio may email me about this inquiry. <a href="/privacy">Privacy policy</a></span>
      </label>
      <button className="button primary submit-button" type="submit" disabled={status === "sending"}>
        {status === "sending" ? "Sending..." : "Send inquiry"}
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </button>
      {status === "error" && <p className="form-message error" role="alert">{error}</p>}
    </form>
  );
}

function Field({
  label,
  name,
  type = "text",
  autoComplete,
  required,
  placeholder,
}: {
  label: string;
  name: string;
  type?: string;
  autoComplete?: string;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label>
      <span>{label}</span>
      <input name={name} type={type} autoComplete={autoComplete} required={required} placeholder={placeholder} maxLength={200} />
    </label>
  );
}

function ContactAside() {
  return (
    <aside className="contact-aside">
      <div className="founder-note">
        <p className="eyebrow">Your business</p>
        <h2>Introduce your team here.</h2>
        <p>Replace this demonstration content with your own information, service offer, and privacy policy before launching.</p>
      </div>
      <div className="aside-panel dark">
        <h2>What happens next</h2>
        <ol>
          <li>Your configured inbox receives the project inquiry.</li>
          <li>Your team reviews the request and clarifies the scope.</li>
          <li>You agree on the next step with the customer.</li>
        </ol>
      </div>
      <div className="mini-contact">
        <CalendarCheck size={20} weight="duotone" aria-hidden="true" />
        <span>Choose the process that fits your business.</span>
      </div>
      <div className="mini-contact">
        <EnvelopeSimple size={20} weight="duotone" aria-hidden="true" />
        <span>Email delivery requires your own configuration.</span>
      </div>
    </aside>
  );
}

function PolicySection({
  sections,
}: {
  sections: Array<{
    title: string;
    items: string[];
  }>;
}) {
  return (
    <section className="section policy-section">
      <div className="policy-layout">
        {sections.map((section) => (
          <article className="policy-card" key={section.title}>
            <h2>{section.title}</h2>
            <ul>
              {section.items.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </article>
        ))}
        <p className="policy-contact">Have a question? <a href="/contact">Contact your business.</a></p>
      </div>
    </section>
  );
}

function CTA({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <section className="cta-band">
      <div>
        <p className="eyebrow">Let's talk about your business</p>
        <h2>What would you like to build?</h2>
        <p>Tell me what you need. I'll reply personally with a practical next step, before you commit to a project.</p>
      </div>
      <button className="button primary" type="button" onClick={() => onNavigate("contact")}>
        Discuss your project
        <ArrowRight size={18} weight="bold" aria-hidden="true" />
      </button>
    </section>
  );
}

function Footer({ onNavigate }: { onNavigate: (id: PageId) => void }) {
  return (
    <footer className="site-footer">
      <div>
        <strong>AI Build Studio</strong>
        <p>Websites and practical AI tools for small businesses.</p>
      </div>
      <nav aria-label="Footer navigation">
        {[...navItems, ...legalItems].map((item) => (
          <a
            key={item.id}
            href={item.path}
            onClick={(event) => {
              if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return;
              event.preventDefault();
              onNavigate(item.id);
            }}
          >
            {item.label}
          </a>
        ))}
      </nav>
    </footer>
  );
}

function getPageFromPath(): PageId {
  const path = window.location.pathname.replace(/\/$/, "") || "/";
  return pageByPath.get(path) ?? "home";
}

function applyPageMeta(page: PageId) {
  const meta = pageMeta[page];
  const url = `${siteUrl}${meta.path === "/" ? "/" : meta.path}`;

  document.title = meta.title;
  setMeta("name", "description", meta.description);
  setMeta("property", "og:title", meta.title);
  setMeta("property", "og:description", meta.description);
  setMeta("property", "og:url", url);
  setMeta("property", "og:type", "website");
  setMeta("property", "og:image", `${siteUrl}/assets/studio-hero.svg`);
  setMeta("name", "twitter:card", "summary_large_image");
  setMeta("name", "twitter:title", meta.title);
  setMeta("name", "twitter:description", meta.description);
  setMeta("name", "twitter:image", `${siteUrl}/assets/studio-hero.svg`);

  let canonical = document.querySelector<HTMLLinkElement>('link[rel="canonical"]');
  if (!canonical) {
    canonical = document.createElement("link");
    canonical.rel = "canonical";
    document.head.appendChild(canonical);
  }
  canonical.href = url;
}

function setMeta(attribute: "name" | "property", key: string, content: string) {
  let element = document.querySelector<HTMLMetaElement>(`meta[${attribute}="${key}"]`);
  if (!element) {
    element = document.createElement("meta");
    element.setAttribute(attribute, key);
    document.head.appendChild(element);
  }
  element.content = content;
}

export default App;
