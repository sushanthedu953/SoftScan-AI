import { Navigate, useLocation } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { sitePages } from '../content/siteConfig';

export default function InfoPage() {
  const { pathname } = useLocation();
  const slug = pathname.replace(/^\//, '');
  const page = sitePages[slug];

  if (!page) {
    return <Navigate to="/" replace />;
  }

  return (
    <PageLayout title={page.title} subtitle={page.subtitle} cta={page.cta}>
      {page.sections.map((section) => (
        <section key={section.title}>
          <h2 className="text-[#F5F3FF] text-sm font-semibold mb-2">{section.title}</h2>
          {section.paragraphs.map((p) => (
            <p key={p} className="text-[#9CA3AF] text-sm leading-relaxed mb-2">
              {p}
            </p>
          ))}
          {section.bullets && (
            <ul className="mt-2 space-y-1.5">
              {section.bullets.map((item) => (
                <li
                  key={item}
                  className="text-[#C4B5FD] text-xs font-mono px-3 py-2 rounded-lg bg-[rgba(139,92,246,0.06)] border border-[rgba(167,139,250,0.12)]"
                >
                  {item}
                </li>
              ))}
            </ul>
          )}
        </section>
      ))}
    </PageLayout>
  );
}
