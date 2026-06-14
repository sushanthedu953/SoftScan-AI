import { Link, Navigate, useParams } from 'react-router-dom';
import PageLayout from '../components/PageLayout';
import { blogPosts } from '../content/siteConfig';

const postBodies: Record<string, string[]> = {
  'why-winget-exports': [
    'Manual spreadsheets drift the moment you install something new. winget list gives you a single source of truth tied to what Windows actually has installed.',
    'JSON exports preserve structure so version strings are easier to parse. That improves both AI analysis and repeat scans you save in history.',
  ],
  'batch-updates-safely': [
    'Batch scripts are convenient but run with Administrator rights. Review each winget id before executing on a work machine.',
    'Prefer updating security-flagged apps first, reboot if required, then handle general version bumps. Keep a restore point on production systems.',
  ],
};

export default function BlogPostPage() {
  const { postId } = useParams<{ postId: string }>();
  const post = blogPosts.find((p) => p.id === postId);
  const paragraphs = postId ? postBodies[postId] : undefined;

  if (!post || !paragraphs) {
    return <Navigate to="/blog" replace />;
  }

  return (
    <PageLayout title={post.title} subtitle={post.excerpt}>
      <p className="text-[10px] text-[#9CA3AF] uppercase tracking-wider font-bold -mt-4 mb-6">
        {new Date(post.date).toLocaleDateString(undefined, { dateStyle: 'long' })}
      </p>
      {paragraphs.map((p) => (
        <p key={p} className="text-[#9CA3AF] text-sm leading-relaxed">
          {p}
        </p>
      ))}
      <Link to="/blog" className="inline-block text-xs font-semibold text-[#A78BFA] hover:text-[#C4B5FD]">
        ← All posts
      </Link>
    </PageLayout>
  );
}
