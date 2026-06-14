import { Link } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { blogPosts } from '../content/siteConfig';

export default function BlogPage() {
  return (
    <PageLayout title="Blog" subtitle="Notes on software health and Windows maintenance.">
      <ul className="space-y-4">
        {blogPosts.map((post) => (
          <li key={post.id}>
            <article className="rounded-xl border border-[rgba(167,139,250,0.15)] bg-[rgba(139,92,246,0.04)] p-4 hover:border-[rgba(167,139,250,0.3)] transition-colors">
              <time className="text-[10px] font-bold uppercase tracking-wider text-[#9CA3AF]">
                {new Date(post.date).toLocaleDateString(undefined, {
                  year: 'numeric',
                  month: 'short',
                  day: 'numeric',
                })}
              </time>
              <h2 className="text-[#F5F3FF] text-base font-semibold mt-1 mb-1">{post.title}</h2>
              <p className="text-[#9CA3AF] text-sm">{post.excerpt}</p>
              <Link
                to={`/blog/${post.id}`}
                className="inline-block mt-3 text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD]"
              >
                Read more →
              </Link>
            </article>
          </li>
        ))}
      </ul>
    </PageLayout>
  );
}
