export const siteConfig = {
  /** Primary name in the header, footer, and metadata */
  name: "B Miller Consulting",
  /** Short line under the name in the header (desktop) */
  headline: "Partner to owners & leadership teams",
  tagline: "Building businesses that run with clarity and intention.",
  description:
    "I partner with business owners and executive teams to align on goals, uncover weaknesses, strengthen what’s already working, and build practical solutions around the owner’s vision—so the business runs for the owner, not the other way around.",
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
