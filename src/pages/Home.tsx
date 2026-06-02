import { Link } from 'react-router-dom';
import { 
  UploadCloud, 
  ArrowRight,
  Award,
  Target,
  Zap,
  Package,
  ShieldCheck,
  UserCheck,
  Cpu,
  Bot,
  Car,
  Utensils,
  Key,
  CheckCircle2,
  FileText,
  Search,
  Settings,
  Shield
} from 'lucide-react';
import SEO from '../components/SEO';

export default function Home() {
  return (
    <div className="bg-white">
      <SEO 
        title="Home" 
        description="Reliable CNC machining, turning, grinding and one-stop manufacturing support for demanding industrial parts. We help engineers control quality from prototype to batch production." 
        keywords="Precision Machining, CNC Machining, Japanese Quality Discipline, Aluminum, Carbon Steel" 
      />
      
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 opacity-40">
           <img src="https://images.unsplash.com/photo-1565810052953-e57ebddc1efb?q=80&w=2070&auto=format&fit=crop" alt="CNC Machining" className="w-full h-full object-cover" referrerPolicy="no-referrer" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/80 to-transparent"></div>
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white">
              Precision Machining<br />with Japanese Quality Discipline
            </h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">
              Serving Semiconductor, Automation and Robotics Industries with Reliable CNC Manufacturing.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to="/contact" className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-sm transition-colors group">
                <UploadCloud className="mr-3 h-6 w-6" />
                <div className="text-left">
                   <div className="leading-snug text-base text-white">Upload Your Drawing</div>
                   <div className="text-[10px] font-normal opacity-80 text-white">Get Quote in 24 Hours</div>
                </div>
              </Link>
              <Link to="/capabilities" className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold border border-slate-500 hover:border-white text-white rounded-sm transition-colors">
                View Capabilities
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* Why Engineering Teams Choose Us */}
      <section className="py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Why Engineering Teams Choose Us</h2>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {[
              { icon: Award, title: '1. Japanese Manufacturing Experience', desc: '15 years serving Japanese automotive, automation and industrial equipment manufacturers.' },
              { icon: Target, title: '2. Tight Tolerance Capability', desc: 'Grinding and precision machining capability within ±0.01 mm.' },
              { icon: Zap, title: '3. Rapid Prototype & Small Batch Support', desc: 'Fast quotation, rapid prototyping and flexible low-volume production.' },
              { icon: Package, title: '4. One-Stop Manufacturing', desc: 'Material sourcing, machining, heat treatment and surface finishing.' },
              { icon: ShieldCheck, title: '5. Stable Quality & Delivery Control', desc: 'Disciplined production management with proactive progress updates.' },
              { icon: UserCheck, title: '6. Customer-Oriented Engineering Support', desc: 'Helping customers reduce manufacturing costs through engineering optimization.' }
            ].map((feature, idx) => (
              <div key={idx} className="flex flex-col items-center">
                 <div className="w-16 h-16 rounded-full border-2 border-blue-100 bg-blue-50/50 flex items-center justify-center mb-6">
                   <feature.icon className="h-8 w-8 text-blue-700 stroke-[1.5]" />
                 </div>
                 <h3 className="font-bold text-slate-900 mb-3 text-sm leading-tight">{feature.title}</h3>
                 <p className="text-xs text-slate-500 leading-relaxed px-2">{feature.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Industries We Serve</h2>
          </div>
          
          <div className="grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {[
              { 
                icon: Cpu, title: 'Semiconductor\nEquipment', 
                img: 'https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=2070&auto=format&fit=crop',
                items: ['Wafer Handling', 'Inspection Equipment', 'Vacuum Systems', 'Fixture Components'] 
              },
              { 
                icon: Bot, title: 'Automation &\nRobotics', 
                img: 'https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?q=80&w=2070&auto=format&fit=crop',
                items: ['Robot Components', 'End Effectors', 'Motion Systems', 'Assembly Equipment'] 
              },
              { 
                icon: Car, title: 'Automotive\nEquipment', 
                img: 'https://images.unsplash.com/photo-1563986768609-322da13575f3?q=80&w=2070&auto=format&fit=crop',
                items: ['Production Line Parts', 'Jigs & Fixtures', 'Testing Equipment', 'Precision Components'] 
              },
              { 
                icon: Utensils, title: 'Food Processing\nEquipment', 
                img: 'https://images.unsplash.com/photo-1586864387967-d02ef85d93e8?q=80&w=2070&auto=format&fit=crop',
                items: ['Conveyor Parts', 'Filling Machines', 'Cutting Components', 'Hygienic Equipment'] 
              },
              { 
                icon: Key, title: 'Key Cutting\nEquipment', 
                img: 'https://images.unsplash.com/photo-1580983554867-d16ed417b351?q=80&w=2070&auto=format&fit=crop',
                items: ['Key Cutting Parts', 'Precision Guides', 'Clamping Components', 'Wear-Resistant Parts'] 
              }
            ].map((industry, idx) => (
              <div key={idx} className="bg-white border border-slate-200">
                <div className="h-32 bg-slate-200 w-full overflow-hidden">
                  <img src={industry.img} alt={industry.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                </div>
                <div className="p-5">
                  <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                    <industry.icon className="h-6 w-6 text-blue-700 shrink-0" />
                    <h3 className="font-bold text-sm text-slate-900 whitespace-pre-line leading-tight">{industry.title}</h3>
                  </div>
                  <ul className="space-y-2">
                    {industry.items.map((item, i) => (
                      <li key={i} className="text-xs text-slate-600 flex items-start gap-2">
                        <span className="text-blue-700 mt-0.5">•</span>
                        {item}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Core Capabilities */}
      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">Our Core Capabilities</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
             {[
               { title: 'CNC Milling', img: 'https://images.unsplash.com/photo-1565869363026-68196e8e818b?q=80&w=2070&auto=format&fit=crop', items: ['3/4/5-Axis Milling', 'Aluminum, Steel', 'Stainless, Plastics', 'Tolerance ±0.01 mm'] },
               { title: 'CNC Turning', img: 'https://images.unsplash.com/photo-1620021600854-3e9a7e8e7784?q=80&w=2070&auto=format&fit=crop', items: ['Precision Turning', 'Shafts, Bushings, Pins', 'Tight Concentricity', 'Tolerance ±0.01 mm'] },
               { title: 'Surface Grinding', img: 'https://images.unsplash.com/photo-1504917595217-d4dc5ebe6122?q=80&w=2070&auto=format&fit=crop', items: ['Flatness Control', 'Parallelism Control', 'Surface Finish Ra 0.2', 'Tolerance ±0.01 mm'] },
               { title: 'EDM & Wire EDM', img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop', items: ['Complex Profiles', 'Hardened Materials', 'Precision Slots', 'High Accuracy'] },
               { title: 'Materials', img: 'https://images.unsplash.com/photo-1509213606622-c3c721ddb9c0?q=80&w=2070&auto=format&fit=crop', items: ['Aluminum, Stainless Steel', 'Carbon Steel, Brass', 'Copper, Titanium', 'Engineering Plastics'] },
               { title: 'Secondary Processes', img: 'https://images.unsplash.com/photo-1581092335878-2d9fd86aecf3?q=80&w=2070&auto=format&fit=crop', items: ['Anodizing, Plating', 'Heat Treatment', 'Laser Marking', 'And More'] },
             ].map((cap, idx) => (
                <div key={idx} className="border border-slate-800 flex flex-col text-center hover:bg-slate-800 transition-colors overflow-hidden group">
                   <div className="h-32 w-full bg-slate-800 overflow-hidden">
                     <img src={cap.img} alt={cap.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" referrerPolicy="no-referrer" />
                   </div>
                   <div className="p-6 flex-1 flex flex-col">
                     <h3 className="font-bold border-b border-slate-700 pb-4 mb-4 text-sm whitespace-pre-line">{cap.title}</h3>
                     <ul className="space-y-2 flex-1">
                       {cap.items.map((item, i) => (
                         <li key={i} className="text-xs text-slate-400">{item}</li>
                       ))}
                     </ul>
                   </div>
                </div>
             ))}
          </div>
          
          <div className="text-center mt-12">
             <Link to="/capabilities" className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-sm transition-colors shadow-sm">
               View All Capabilities
             </Link>
          </div>
        </div>
      </section>

      {/* Quality Built Into Every Step */}
      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Quality Built Into Every Step</h2>
          </div>
          
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            {/* Left Col */}
            <div className="space-y-10">
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-white border border-slate-200 rounded-sm">
                    <Search className="h-6 w-6 text-blue-700 stroke-[1.5]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Advanced Inspection Equipment</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">CMM, Height Gauge, Profile Projector, Micrometer and more.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-white border border-slate-200 rounded-sm">
                    <Shield className="h-6 w-6 text-blue-700 stroke-[1.5]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Strict Process Control</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Incoming, In-Process and Final Inspection to ensure consistent quality.</p>
                </div>
              </div>
              <div className="flex gap-4">
                <div className="shrink-0">
                  <div className="p-3 bg-white border border-slate-200 rounded-sm">
                    <FileText className="h-6 w-6 text-blue-700 stroke-[1.5]" />
                  </div>
                </div>
                <div>
                  <h3 className="font-bold text-slate-900 mb-2 text-sm">Full Traceability</h3>
                  <p className="text-xs text-slate-500 leading-relaxed">Material certificates, inspection reports and calibration records available.</p>
                </div>
              </div>
            </div>
            
            {/* Middle Col - Image */}
            <div className="h-64 lg:h-[400px] w-full bg-slate-200 p-2 bg-white border border-slate-200 shadow-sm">
               <div className="w-full h-full bg-slate-100 overflow-hidden relative">
                 <img src="https://images.unsplash.com/photo-1581092160562-40aa08e78837?q=80&w=2070&auto=format&fit=crop" alt="Quality Inspection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" referrerPolicy="no-referrer" />
               </div>
            </div>
            
            {/* Right Col - Table */}
            <div>
               <div className="bg-white border border-slate-200 overflow-hidden text-sm shadow-sm">
                 <table className="w-full text-left">
                   <thead className="bg-slate-50 border-b border-slate-200">
                     <tr>
                       <th className="px-4 py-3 font-bold text-slate-900 text-xs uppercase tracking-widest whitespace-nowrap">Inspection Item</th>
                       <th className="px-4 py-3 font-bold text-slate-900 text-xs uppercase tracking-widest border-l border-slate-200">Inspection Method</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-slate-100">
                     {[
                       ['Hole Diameter', 'Pin Gauge Inspection'],
                       ['OD', 'Micrometer'],
                       ['Thread', 'Thread Gauge Inspection'],
                       ['Hardness', 'Hardness Inspection (HRC/HB)'],
                       ['Gloss', 'Surface Gloss Inspection'],
                       ['Position', 'CMM Inspection'],
                       ['Flatness', 'Surface Plate & Height Gauge']
                     ].map((row, i) => (
                       <tr key={i} className="hover:bg-slate-50 transition-colors">
                         <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">{row[0]}</td>
                         <td className="px-4 py-3 text-slate-500 border-l border-slate-200">{row[1]}</td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          </div>
          
          <div className="text-center mt-12">
             <Link to="/quality" className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-sm transition-colors shadow-sm">
               Learn More About Quality
             </Link>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">Latest Insights</h2>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
             {[
               { img: 'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2070&auto=format&fit=crop', title: 'How to Control Position Tolerance in CNC Machining', date: 'May 20, 2024' },
               { img: 'https://images.unsplash.com/photo-1541888081691-10c0e815610e?q=80&w=2070&auto=format&fit=crop', title: 'Japanese Drawing vs ISO Drawing', date: 'May 10, 2024' },
               { img: 'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop', title: 'Maintaining ±0.01 mm Grinding Tolerance', date: 'Apr 25, 2024' },
               { img: 'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop', title: 'How We Inspect Tight-Tolerance Parts', date: 'Apr 05, 2024' },
             ].map((post, idx) => (
               <Link to="/blog" key={idx} className="group flex flex-col">
                 <div className="h-48 bg-slate-200 mb-5 overflow-hidden rounded-sm border border-slate-200">
                   <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100" referrerPolicy="no-referrer" />
                 </div>
                 <h3 className="font-bold text-sm text-slate-900 mb-3 leading-relaxed group-hover:text-blue-700 transition-colors line-clamp-2">{post.title}</h3>
                 <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase mt-auto">{post.date}</p>
               </Link>
             ))}
          </div>
          
          <div className="text-center mt-12">
             <Link to="/blog" className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold border border-slate-300 hover:border-slate-400 text-slate-700 rounded-sm transition-colors">
               View All Articles
             </Link>
          </div>
        </div>
      </section>

      {/* CTA Footer Section */}
      <section className="bg-blue-700 text-white py-12 border-b-4 border-blue-900">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
           <div className="text-center lg:text-left">
             <h2 className="text-3xl font-bold mb-3">Ready to Start Your Project?</h2>
             <p className="text-blue-100 text-sm">Upload your drawing and get a quotation within 24 hours.</p>
           </div>
           
           <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
             <Link to="/contact" className="w-full sm:w-auto inline-flex items-center gap-4 border-2 border-dashed border-blue-400 hover:border-white bg-blue-800/40 hover:bg-blue-800 px-6 py-4 rounded-sm transition-colors">
                <UploadCloud className="h-8 w-8 text-blue-200 shrink-0" />
                <div className="text-left">
                  <div className="text-sm font-bold text-white">Drop files here or click to upload</div>
                  <div className="text-[10px] text-blue-200 uppercase tracking-widest mt-1">PDF, STEP, IGES, DWG up to 50MB</div>
                </div>
             </Link>
             <Link to="/contact" className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 text-sm font-bold bg-white text-blue-700 hover:bg-slate-50 rounded-sm transition-colors shadow-sm">
               Contact Us
             </Link>
           </div>
        </div>
      </section>
    </div>
  );
}
