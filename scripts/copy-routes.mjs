import { existsSync, mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const distDir = "dist";
const siteUrl = "https://example.com";
const analyticsToken = process.env.VITE_CF_WEB_ANALYTICS_TOKEN ?? "";
const ga4MeasurementId = process.env.VITE_GA4_MEASUREMENT_ID ?? "";
const routeMeta = {
  "": {
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
    description: "Read how AI Build Studio handles contact form submissions, email replies, analytics, and project inquiry data.",
    path: "/privacy/",
  },
  terms: {
    title: "Terms | AI Build Studio",
    description: "Read basic terms for using the AI Build Studio website and requesting project information.",
    path: "/terms/",
  },
};

if (!existsSync(join(distDir, "index.html"))) {
  throw new Error("dist/index.html was not found. Run this script after vite build.");
}

const template = readFileSync(join(distDir, "index.html"), "utf8");

for (const [route, meta] of Object.entries(routeMeta)) {
  const html = template
    .replaceAll("__PAGE_TITLE__", escapeHtml(meta.title))
    .replaceAll("__PAGE_DESCRIPTION__", escapeHtml(meta.description))
    .replaceAll("__PAGE_URL__", `${siteUrl}${meta.path === "/" ? "/" : meta.path}`)
    .replaceAll("__CF_WEB_ANALYTICS_TOKEN__", escapeJsString(analyticsToken))
    .replaceAll("__GA4_MEASUREMENT_ID__", escapeJsString(ga4MeasurementId));

  if (route === "") {
    writeFileSync(join(distDir, "index.html"), html);
    continue;
  }

  const routeDir = join(distDir, route);
  mkdirSync(routeDir, { recursive: true });
  writeFileSync(join(routeDir, "index.html"), html);
}

function escapeHtml(value) {
  return value.replaceAll("&", "&amp;").replaceAll('"', "&quot;").replaceAll("<", "&lt;").replaceAll(">", "&gt;");
}

function escapeJsString(value) {
  return value.replaceAll("\\", "\\\\").replaceAll('"', '\\"').replaceAll("\n", "\\n").replaceAll("\r", "\\r");
}
