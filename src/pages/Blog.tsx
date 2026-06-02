import { ArrowRight, BookOpen } from 'lucide-react';
import SEO from '../components/SEO';

const articles = [
  {
    category: 'Tolerance Control',
    title: 'How to Control Position Tolerance in Precision Machining',
    excerpt: 'Position tolerance is one of the most important requirements in precision machined parts. It directly affects assembly accuracy, functional alignment and equipment stability.',
    content: [
      'To control position tolerance, manufacturers must review datum structure, machining sequence, clamping method and inspection strategy before production.',
      'A good machining process should reduce repeated clamping. It should also keep important features in the same setup whenever possible.',
      'Inspection is also critical. CMM measurement helps verify hole position, profile accuracy and relationship between key features.',
      'For high-precision parts, position tolerance should not be treated as a final inspection issue. It must be controlled during process planning.'
    ]
  },
  {
    category: 'Grinding',
    title: 'Maintaining ±0.01 mm Grinding Stability',
    excerpt: 'Grinding is often used when CNC machining alone cannot achieve the required dimensional accuracy or surface finish.',
    content: [
      'Maintaining ±0.01 mm stability requires proper material preparation, heat treatment control, grinding wheel selection, machine condition and inspection discipline.',
      'Thermal deformation must also be considered. Small temperature changes may affect final measurement results.',
      'For batch production, operators should monitor grinding allowance, wheel wear and inspection frequency.',
      'Stable grinding quality depends on both technical skill and process discipline.'
    ]
  },
  {
    category: 'Drawing Interpretation',
    title: 'Japanese Drawings vs ISO Drawings: Key Differences Engineers Should Know',
    excerpt: 'Japanese industrial drawings often emphasize practical manufacturing discipline, clear inspection points and strict attention to detail.',
    content: [
      'ISO drawings provide standardized symbols, tolerances and geometric requirements.',
      'For suppliers serving Japanese customers, understanding drawing intent is very important. Sometimes the real requirement is not only the tolerance value, but also the assembly purpose behind the tolerance.',
      'A qualified supplier should review drawings carefully, confirm unclear requirements and provide manufacturability suggestions before production.'
    ]
  },
  {
    category: 'Delivery & Quality',
    title: 'Why Stable Delivery Matters in Precision Manufacturing',
    excerpt: 'In equipment manufacturing, one delayed part can delay a complete machine.',
    content: [
      'Stable delivery is not only about shipping on time. It requires material planning, process scheduling, outsourcing coordination, inspection control and risk reporting.',
      'A reliable machining supplier should monitor production milestones and communicate early when risk appears.',
      'This allows customers to adjust assembly plans and reduce project uncertainty.'
    ]
  }
];

export default function Blog() {
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
      <section className="py-24">
        <div className="mx-auto max-w-5xl px-4 sm:px-6 lg:px-8">
           <div className="space-y-16">
             {articles.map((article, idx) => (
               <article key={idx} className="group cursor-default">
                 <div className="border-l-2 border-transparent group-hover:border-accent pl-6 transition-colors">
                   <div className="flex items-center gap-2 text-sm font-sans font-medium text-accent uppercase tracking-widest mb-3">
                     <BookOpen className="h-4 w-4" />
                     {article.category}
                   </div>
                   <h2 className="text-2xl font-display font-bold text-primary-900 mb-4">{article.title}</h2>
                   <p className="text-gray-600 font-medium mb-6 leading-relaxed">
                     {article.excerpt}
                   </p>
                   <div className="space-y-4 text-gray-500 text-sm leading-relaxed mb-6">
                     {article.content.map((paragraph, pIdx) => (
                       <p key={pIdx}>{paragraph}</p>
                     ))}
                   </div>
                   {/* Decorative button */}
                   <button className="inline-flex items-center text-sm font-semibold text-primary-900 group-hover:text-accent transition-colors mt-2">
                     Read Full Article
                     <ArrowRight className="ml-1.5 h-4 w-4" />
                   </button>
                 </div>
               </article>
             ))}
           </div>
        </div>
      </section>
    </div>
  );
}
