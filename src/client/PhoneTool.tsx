import { ArrowRight, Pencil, User, Volume2 } from "lucide-react";
import { useEffect, useState } from "react";
import { AtoZHeader, AzBanner } from "./AtoZHeader.js";

/**
 * Mock recreation of the A-to-Z Phone Tool profile page, routed by alias:
 * /phonetool/jdoe (default), /phonetool/jrivera, etc. Curated profiles
 * exist for the demo cast; any other alias in the graph renders a sample
 * profile from its graph attributes. All data on this page is fictional.
 */

interface Profile {
  alias: string;
  name: string;
  firstName: string;
  title: string;
  team: string;
  tenure: string;
  email: string;
  photo?: string;
}

const PROFILES: Record<string, Profile> = {
  jdoe: {
    alias: "jdoe",
    name: "Jane Doe",
    firstName: "Jane",
    title: "AFE SDE Intern, L4",
    team: "Atlas Experience (7421)",
    tenure: "2 months, 3 days",
    email: "jdoe@example.com",
    photo: "/profile-jane.jpeg"
  },
  jrivera: {
    alias: "jrivera",
    name: "Jordan Rivera",
    firstName: "Jordan",
    title: "Senior SDE, L6",
    team: "Atlas Experience (7421)",
    tenure: "4 years, 2 months",
    email: "jrivera@example.com"
  },
  pshah: {
    alias: "pshah",
    name: "Priya Shah",
    firstName: "Priya",
    title: "SDE III, L5",
    team: "Atlas Experience (7421)",
    tenure: "3 years, 1 month",
    email: "pshah@example.com"
  }
};

const ATLAS_ORG = [
  { initials: "CR", name: "Casey Reed", alias: "caseyr", title: "Senior Manager, Software Development, L7", meta: "Direct reports: 24", level: 0 },
  { initials: "ML", name: "Morgan Lee", alias: "morganl", title: "Software Development Manager, L6", meta: "Direct reports: 8", level: 1 },
  { initials: "JR", name: "Jordan Rivera", alias: "jrivera", title: "Senior SDE, L6", meta: "4 years at Amazon", level: 2 },
  { initials: "PS", name: "Priya Shah", alias: "pshah", title: "SDE III, L5", meta: "3 years at Amazon", level: 2 },
  { initials: "AK", name: "Alex Kim", alias: "alexkim", title: "Senior SDE, L6", meta: "6 years at Amazon", level: 2 },
  { initials: "SP", name: "Sam Patel", alias: "spatel", title: "SDE II, L5", meta: "3 years at Amazon", level: 2 },
  { initials: "TB", name: "Taylor Brooks", alias: "tbrooks", title: "SDE I, L4", meta: "1 year at Amazon", level: 2 },
  { initials: "JD", name: "Jane Doe", alias: "jdoe", title: "AFE SDE Intern, L4", meta: "2 months at Amazon", level: 2 }
];

function initialsOf(name: string): string {
  return name
    .split(/\s+/)
    .map((part) => part[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function useProfile(alias: string): Profile | null {
  const curated = PROFILES[alias] ?? null;
  const [fetched, setFetched] = useState<Profile | null>(null);

  useEffect(() => {
    if (curated) return;
    fetch(`/api/entities/search?q=${encodeURIComponent(alias)}`)
      .then((result) => (result.ok ? result.json() : { entities: [] }))
      .then(({ entities }) => {
        const person = (entities as Array<{
          type: string;
          label: string;
          attributes: Record<string, unknown>;
        }>).find(
          (entity) =>
            entity.type === "person" && entity.attributes.alias === alias
        );
        if (!person) return;
        setFetched({
          alias,
          name: person.label,
          firstName: person.label.split(" ")[0],
          title: typeof person.attributes.role === "string" ? person.attributes.role : "Software Development Engineer",
          team: typeof person.attributes.team === "string" ? person.attributes.team : "Amazon",
          tenure: "3 years, 4 months",
          email: `${alias}@example.com`
        });
      })
      .catch(() => undefined);
  }, [alias, curated]);

  return curated ?? fetched;
}

export function PhoneToolPage({ alias }: { alias: string }) {
  const profile = useProfile(alias);
  const showOrgChart = profile?.team.startsWith("Atlas Experience") ?? false;

  return (
    <div className="pt-page">
      <AtoZHeader active="phonetool" />

      <AzBanner cta={{ label: "Ask Path", href: "/path" }}>
        Need answers to ownership queries? Ask Path &ldquo;Who owns
        AtlasRegionContext?&rdquo; or &ldquo;Who owns metrics?&rdquo;
      </AzBanner>

      <main className="pt-content">
        <section className="pt-hero">
          <div className="pt-badge" aria-hidden="true">
            <span className="pt-badge-top">{profile?.firstName ?? alias}</span>
            <span className="pt-badge-photo">
              {profile?.photo ? (
                <img src={profile.photo} alt="" />
              ) : profile ? (
                <span className="pt-badge-initials">
                  {initialsOf(profile.name)}
                </span>
              ) : (
                <User size={44} strokeWidth={1.5} />
              )}
            </span>
            <span className="pt-badge-alias">{alias}@</span>
          </div>
          <div className="pt-hero-info">
            <h2>{profile?.name ?? `${alias}@`}</h2>
            <p className="pt-title-line">{profile?.title ?? "Amazonian"}</p>
            <p className="pt-title-line">{profile?.team ?? ""}</p>
            <dl>
              <div>
                <dt>Message:</dt>
                <dd>
                  Not added <Pencil size={13} />
                </dd>
              </div>
              <div>
                <dt>Pronunciation:</dt>
                <dd>
                  <Volume2 size={14} />
                </dd>
              </div>
              <div>
                <dt>Total tenure:</dt>
                <dd>{profile?.tenure ?? ""}</dd>
              </div>
            </dl>
            <div className="pt-hero-actions">
              <button type="button" className="pt-button-primary">
                <Pencil size={14} />
                {alias === "jdoe" ? "Edit my information" : "Send a message"}
              </button>
              <button type="button" className="pt-button-secondary">
                <User size={14} />
                {alias === "jdoe" ? "My profile" : "Full profile"}
              </button>
            </div>
          </div>
          <aside className="pt-contact-card">
            <p>
              <strong>@</strong> {alias}
            </p>
            <p>
              <strong>✉</strong> {profile?.email ?? `${alias}@example.com`}
            </p>
            <p>
              <strong>⌖</strong> SEA000 (Seattle, WA, US)
            </p>
            <p>
              <strong>⏱</strong> 8:37 AM (PDT)
            </p>
          </aside>
        </section>

        <div className="pt-grid">
          {showOrgChart ? (
            <section className="pt-card">
              <h3>Org chart</h3>
              <ul className="pt-org-list">
                {ATLAS_ORG.map((person) => (
                  <li
                    key={person.alias}
                    className={person.alias === alias ? "pt-org-self" : ""}
                    style={{ marginLeft: person.level * 22 }}
                  >
                    <span
                      className="pt-org-expand"
                      aria-hidden="true"
                      style={
                        person.meta.startsWith("Direct reports")
                          ? undefined
                          : { visibility: "hidden" }
                      }
                    >
                      −
                    </span>
                    <span className="pt-org-avatar" aria-hidden="true">
                      {person.alias === "jdoe" ? (
                        <img src="/profile-jane.jpeg" alt="" />
                      ) : (
                        person.initials
                      )}
                    </span>
                    <span>
                      <a href={`/phonetool/${person.alias}`}>{person.name}</a>{" "}
                      <span className="pt-org-alias">{person.alias}@</span>
                      <small>{person.title}</small>
                      <small className="pt-org-meta">{person.meta}</small>
                    </span>
                  </li>
                ))}
              </ul>
            </section>
          ) : (
            <section className="pt-card">
              <h3>Org chart</h3>
              <p className="pt-muted">
                Org chart is not available for this sample profile.
              </p>
            </section>
          )}

          <div className="pt-col">
            <section className="pt-card">
              <h3>Work bio</h3>
              <p className="pt-muted">
                {alias === "jdoe"
                  ? "Add your work bio to share more about what you do."
                  : `${profile?.name ?? alias} has not added a work bio yet.`}
              </p>
            </section>

            <section className="pt-card pt-path-card">
              <h3>Path</h3>
              <a className="pt-button-primary pt-find-resource" href="/path">
                Find a resource
                <ArrowRight size={15} />
              </a>
            </section>
          </div>
        </div>
      </main>
    </div>
  );
}
