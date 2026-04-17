export const siteConfig = {
  /** Primary name in the header, footer, and metadata */
  name: "BMiller Consulting",
  /** Short line under the name in the header (desktop) */
  headline: "Independent consultant",
  tagline:
    "I help leaders cut through complexity, align teams, and ship outcomes that last.",
  description:
    "Independent consultant partnering with executives and operators who need sharp thinking, honest facilitation, and practical plans they can run without a big firm on retainer.",
  url: process.env.NEXT_PUBLIC_APP_URL ?? "https://bmillerconsulting.com",
  ogImage: "",
  email: "hello@bmillerconsulting.com",
  phone: "+1 (415) 555-0142",
  /** Shown on Contact and in the footer */
  address: {
    line1: "Remote & on-site",
    line2: "",
    city: "San Francisco Bay Area",
    region: "CA",
    postal: ""
  },
  social: {
    linkedin: "https://www.linkedin.com/in/bmillerconsulting"
  }
} as const
