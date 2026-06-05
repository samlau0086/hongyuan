import { useState } from 'react';
import { ArrowRight, BookOpen, ChevronLeft, ChevronRight } from 'lucide-react';
import SEO from '../components/SEO';

const articles = [
  {
    title: 'How to Control Position Tolerance in CNC Machining',
    date: 'May 20, 2024',
    img: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Japanese Drawing vs ISO Drawing',
    date: 'May 10, 2024',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Maintaining ±0.01 mm Grinding Tolerance',
    date: 'Apr 25, 2024',
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Common Causes of Surface Finish Defects',
    date: 'Apr 15, 2024',
    img: 'https://images.unsplash.com/photo-1509213606622-c3c721ddb9c0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'How We Inspect Tight-Tolerance Parts',
    date: 'Apr 05, 2024',
    img: 'https://images.unsplash.com/photo-1620021600854-3e9a7e8e7784?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'CNC Machining for Semiconductor Equipment',
    date: 'Mar 28, 2024',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Best Practices for 5-Axis Milling',
    date: 'Mar 15, 2024',
    img: 'https://images.unsplash.com/photo-1565869363026-68196e8e818b?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Material Selection for Aerospace Components',
    date: 'Mar 02, 2024',
    img: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Optimizing Cycle Times in Lathe Machining',
    date: 'Feb 20, 2024',
    img: 'https://images.unsplash.com/photo-1620021600854-3e9a7e8e7784?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'The Importance of Tool Life Management',
    date: 'Feb 05, 2024',
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Wire EDM vs Die Sinker EDM: A Comparison',
    date: 'Jan 22, 2024',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Designing Parts for Manufacturability (DFM)',
    date: 'Jan 10, 2024',
    img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Geometric Dimensioning and Tolerancing',
    date: 'Dec 15, 2023',
    img: 'https://images.unsplash.com/photo-1565810052953-e57ebddc1efb?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Advances in Precision Measurement',
    date: 'Nov 28, 2023',
    img: 'https://images.unsplash.com/photo-1509213606622-c3c721ddb9c0?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Quality Control in Automotive Parts',
    date: 'Nov 12, 2023',
    img: 'https://images.unsplash.com/photo-1620021600854-3e9a7e8e7784?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Surface Heat Treatment and Hardness Testing',
    date: 'Oct 25, 2023',
    img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'The Role of Coolant in High-Speed Machining',
    date: 'Oct 10, 2023',
    img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop'
  },
  {
    title: 'Reducing Chatter in Aluminum Parts',
    date: 'Sep 22, 2023',
    img: 'https://images.unsplash.com/photo-1590496794008-383c8070b257?q=80&w=2070&auto=format&fit=crop'
  }
];

export default function Blog() {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 18;
  
  // Duplicate articles for demonstration purposes
  const allArticles = [...articles, ...articles, ...articles];
  const totalPages = Math.ceil(allArticles.length / itemsPerPage);
  
  const currentArticles = allArticles.slice(
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
      {/* Header */}
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Technical Blog</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Insights on precision machining, quality control, and engineering best practices.</p>
        </div>
      </section>

      {/* Blog List */}
      <section className="py-24 bg-slate-50">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
           <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-6 lg:gap-8">
             {currentArticles.map((article, idx) => (
               <article key={idx} className="group cursor-pointer">
                 <div className="rounded-lg overflow-hidden mb-4 border border-gray-200 bg-white">
                   <img src={article.img} alt={article.title} className="w-full h-32 md:h-40 object-cover group-hover:scale-105 transition-transform duration-500" referrerPolicy="no-referrer" />
                 </div>
                 <h3 className="text-[15px] font-bold text-slate-900 leading-snug mb-2 group-hover:text-blue-700 transition-colors">
                   {article.title}
                 </h3>
                 <div className="text-xs text-slate-500">
                   {article.date}
                 </div>
               </article>
             ))}
           </div>

           {/* Pagination */}
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
        </div>
      </section>
    </div>
  );
}
