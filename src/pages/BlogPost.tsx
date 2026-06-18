import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, Calendar } from 'lucide-react';
import SEO from '../components/SEO';
import { useBlogInitialData } from '../blogInitialData';

export default function BlogPost() {
  const { slug } = useParams<{ slug: string }>();
  const initialBlogData = useBlogInitialData();
  const initialPost = initialBlogData.post?.slug === slug ? initialBlogData.post : null;
  const [post, setPost] = useState<any>(initialPost);
  const [loading, setLoading] = useState(!initialPost);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/blog/posts/${slug}`);
        if (!response.ok) {
          throw new Error('Post not found');
        }

        const data = await response.json();
        setPost(data);
      } catch (err: any) {
        setError(err.message || 'Failed to load the article.');
      } finally {
        setLoading(false);
      }
    };

    if (slug) {
      fetchPost();
    }
  }, [slug]);

  if (loading) {
    return (
      <div className="pt-24 pb-24 bg-white min-h-[60vh]">
        <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 animate-pulse">
          <div className="w-24 h-4 bg-gray-200 rounded mb-8"></div>
          <div className="w-full bg-gray-200 rounded-xl mb-10 h-[300px] sm:h-[400px] lg:h-[500px]"></div>
          <div className="mb-10">
            <div className="h-10 sm:h-12 bg-gray-200 rounded w-3/4 mb-4"></div>
            <div className="h-10 sm:h-12 bg-gray-200 rounded w-1/2 mb-6"></div>
            <div className="w-32 h-4 bg-gray-200 rounded"></div>
          </div>
        </article>
      </div>
    );
  }

  if (error || !post) {
    return (
      <div className="pt-24 pb-16 min-h-[60vh] flex flex-col items-center justify-center text-center px-4">
        <h1 className="text-3xl font-bold text-slate-900 mb-4">Post Not Found</h1>
        <p className="text-slate-600 mb-8">{error || "The article you're looking for doesn't exist or has been removed."}</p>
        <Link to="/blog" className="inline-flex items-center gap-2 text-blue-700 font-medium hover:text-blue-800">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>
      </div>
    );
  }

  const dateStr = new Date(post.date).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });

  return (
    <div className="pt-24 pb-24 bg-white">
      <SEO
        title={`${post.title} - Hongyuan Precision`}
        description={post.excerpt || 'Read about precision manufacturing, CNC machining and insights.'}
      />

      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link to="/blog" className="inline-flex items-center gap-2 text-slate-500 hover:text-blue-700 mb-8 transition-colors">
          <ArrowLeft className="w-4 h-4" /> Back to Blog
        </Link>

        {post.img && (
          <img
            src={post.img}
            alt={post.title}
            className="w-full h-auto max-h-[500px] object-cover rounded-xl mb-10"
          />
        )}

        <header className="mb-10">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold text-slate-900 leading-tight mb-6">{post.title}</h1>

          <div className="flex items-center gap-4 text-slate-500 text-sm">
            <time dateTime={post.date} className="flex items-center gap-1.5">
              <Calendar className="w-4 h-4" />
              {dateStr}
            </time>
          </div>
        </header>

        <div
          className="prose prose-lg prose-slate max-w-none prose-headings:font-bold prose-headings:text-slate-900 prose-a:text-blue-700 hover:prose-a:text-blue-800 prose-img:rounded-xl"
          dangerouslySetInnerHTML={{ __html: post.contentHtml }}
        />
      </article>
    </div>
  );
}
