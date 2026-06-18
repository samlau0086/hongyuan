import { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import SEO from '../components/SEO';
import { BlogSummary, useBlogInitialData } from '../blogInitialData';

type BlogArticle = {
  title: string;
  date: string;
  img: string;
  slug: string;
  excerpt?: string;
};

export default function Blog() {
  const initialBlogData = useBlogInitialData();
  const [currentPage, setCurrentPage] = useState(1);
  const [articles, setArticles] = useState<BlogArticle[]>(formatBlogArticles(initialBlogData.posts || []));
  const [loading, setLoading] = useState(!initialBlogData.posts);
  const [fetchError, setFetchError] = useState<string | null>(null);
  const itemsPerPage = 18;
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await fetch('/api/blog/posts');
        if (!response.ok) {
          throw new Error(`Failed to fetch posts: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        setArticles(formatBlogArticles(data));
      } catch (error: any) {
        setFetchError(error.message || 'Failed to load blog posts.');
        setArticles([]);
      } finally {
        setLoading(false);
      }
    };

    fetchPosts();
  }, []);

  const totalPages = Math.ceil(articles.length / itemsPerPage) || 1;
  const currentArticles = articles.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  return (
    <div className="bg-white">
      <SEO
        title="Technical Blog"
        description="Insights on precision machining, quality control, and engineering best practices. Learn about position tolerance, grinding stability, and drawing interpretation."
        keywords="Precision Machining Blog, Tolerance Control, Grinding, Drawing Interpretation"
      />

      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Technical Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Insights on precision machining, quality control, and engineering best practices.</p>
        </div>
      </section>

      <section className="py-24 bg-slate-50 min-h-[600px]">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
              {Array.from({ length: 18 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-32 md:h-40 rounded-lg mb-4"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))}
            </div>
          ) : (
            <>
              {fetchError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6 text-sm">
                  <strong>Blog Load Issue:</strong> {fetchError}
                </div>
              )}

              {!currentArticles.length && !fetchError && (
                <div className="bg-white border border-gray-200 p-12 text-center text-slate-600">
                  No blog posts have been published yet.
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
                {currentArticles.map((article) => (
                  <article
                    key={article.slug}
                    className="group cursor-pointer"
                    onClick={() => navigate(`/blog/${article.slug}`)}
                  >
                    <div className="rounded-lg overflow-hidden mb-4 border border-gray-200 bg-white">
                      <img src={article.img} alt={article.title} className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500" />
                    </div>
                    <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors line-clamp-3">
                      {article.title}
                    </h3>
                    <div className="text-xs text-slate-500">
                      {article.date}
                    </div>
                  </article>
                ))}
              </div>

              {totalPages > 1 && (
                <div className="mt-16 flex justify-center items-center gap-2">
                  <button
                    onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                    disabled={currentPage === 1}
                    className="p-2 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>

                  {Array.from({ length: totalPages }).map((_, i) => (
                    <button
                      key={i}
                      onClick={() => setCurrentPage(i + 1)}
                      className={`w-10 h-10 rounded border text-sm font-medium transition-colors ${
                        currentPage === i + 1
                          ? 'bg-blue-700 text-white border-blue-700'
                          : 'border-gray-200 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      {i + 1}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                    disabled={currentPage === totalPages}
                    className="p-2 rounded border border-gray-200 text-gray-500 hover:bg-gray-100 hover:text-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </section>
    </div>
  );
}

function formatBlogArticles(posts: BlogSummary[]): BlogArticle[] {
  return posts.map((post) => ({
    title: post.title,
    date: new Date(post.date).toLocaleDateString('en-US', { month: 'short', day: '2-digit', year: 'numeric' }),
    img: post.img || '/home-banner.jpg',
    slug: post.slug,
    excerpt: post.excerpt,
  }));
}
