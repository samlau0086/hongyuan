import { Check } from 'lucide-react';
import SEO from '../components/SEO';

export default function Capabilities() {
  return (
    <div className="bg-white">
      <SEO 
        title="Capabilities" 
        description="Comprehensive CNC machining and secondary operations for complex geometries and tight tolerances. CNC Turning, Grinding, EDM & Wire Cut." 
        keywords="CNC Milling, CNC Turning, Precision Grinding, EDM, Wire Cut, Tolerances, Materials" 
      />
      {/* Header */}
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Capabilities</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Comprehensive CNC machining and secondary operations for complex geometries and tight tolerances.</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-24">
        {/* Core Processes */}
        <div className="space-y-32">
          
          {/* CNC Milling */}
          <section className="scroll-mt-32" id="cnc-milling">
             <div className="border-b border-gray-200 pb-4 mb-8 flex items-baseline gap-4">
               <h2 className="text-3xl font-display font-bold text-primary-900">CNC Milling</h2>
               <span className="text-sm font-sans font-medium text-gray-400 uppercase tracking-widest hidden sm:block">Process 01</span>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Aluminum & Steel Parts</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">We machine aluminum, steel, stainless steel and alloy components for industrial machinery, automation systems and custom equipment.</p>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Precision Structures</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">We support structural components requiring stable dimensions, accurate hole positions and reliable flatness control.</p>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Complex Geometry</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">With advanced process planning, we produce parts with pockets, slots, stepped surfaces, curved profiles and multi-face machining requirements.</p>
               </div>
             </div>
          </section>

          {/* CNC Turning */}
          <section className="scroll-mt-32" id="cnc-turning">
             <div className="border-b border-gray-200 pb-4 mb-8 flex items-baseline gap-4">
               <h2 className="text-3xl font-display font-bold text-primary-900">CNC Turning</h2>
               <span className="text-sm font-sans font-medium text-gray-400 uppercase tracking-widest hidden sm:block">Process 02</span>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Shaft Components</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">We manufacture shafts, pins, bushings, collars, sleeves and custom round components.</p>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Tight Concentricity</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">For rotating components and shaft assemblies, concentricity and surface finish are carefully controlled.</p>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Stable Batch Production</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Turning processes are optimized for repeatability, efficiency and consistent batch quality.</p>
               </div>
             </div>
          </section>

          {/* Precision Grinding */}
          <section className="scroll-mt-32" id="grinding">
             <div className="border-b border-gray-200 pb-4 mb-8 flex items-baseline gap-4">
               <h2 className="text-3xl font-display font-bold text-primary-900">Precision Grinding</h2>
               <span className="text-sm font-sans font-medium text-gray-400 uppercase tracking-widest hidden sm:block">Process 03</span>
             </div>
             <div className="grid md:grid-cols-3 gap-8">
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">0.01 mm Tolerance</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">We support grinding processes with tolerance control down to 0.01 mm, depending on part geometry, material and inspection conditions.</p>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Surface Finish Control</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">Grinding is used to improve dimensional accuracy, surface roughness and matching performance.</p>
               </div>
               <div>
                  <h3 className="text-lg font-bold text-primary-900 mb-3">Cylindrical Grinding</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">We support cylindrical grinding for shafts and round components requiring accurate diameter, roundness and surface finish.</p>
               </div>
             </div>
          </section>

          {/* EDM and Wire Cut */}
          <section className="scroll-mt-32" id="edm">
             <div className="border-b border-gray-200 pb-4 mb-8 flex items-baseline gap-4">
               <h2 className="text-3xl font-display font-bold text-primary-900">EDM and Wire Cut</h2>
               <span className="text-sm font-sans font-medium text-gray-400 uppercase tracking-widest hidden sm:block">Process 04</span>
             </div>
             <div className="grid md:grid-cols-2 gap-12">
               <div>
                 <p className="text-gray-600 leading-relaxed mb-6">
                   EDM and wire cutting are suitable for hard materials, complex internal shapes, sharp corners and high-precision profiles.
                 </p>
               </div>
               <div>
                 <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary-900 mb-4">Typical Applications</h3>
                 <ul className="space-y-3">
                   {['Tooling components', 'Precision inserts', 'Mold-related parts', 'Complex profiles', 'Small precision features'].map((item, i) => (
                     <li key={i} className="flex items-start gap-3 text-gray-600 text-sm">
                       <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                       {item}
                     </li>
                   ))}
                 </ul>
               </div>
             </div>
          </section>
        </div>
      </div>

      {/* Materials & Treatments Grid */}
      <section className="py-24 bg-primary-50 border-t border-gray-200">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-3 gap-8">
            
            {/* Materials */}
            <div className="bg-white p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-display font-bold text-primary-900 mb-6 border-b border-gray-100 pb-4">Materials</h2>
              <ul className="space-y-3">
                 {[
                   'Aluminum: 6061, 7075 and other grades',
                   'Stainless steel: 304, 316, 420 and others',
                   'Carbon steel',
                   'Alloy steel',
                   'Tool steel',
                   'Brass and copper',
                   'Engineering plastics'
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-900 shrink-0 mt-1.5" />
                      {item}
                   </li>
                 ))}
              </ul>
              <p className="text-xs text-gray-500 mt-6 pt-4 border-t border-gray-100 italic">
                Material certificates and traceability documents can be provided.
              </p>
            </div>

            {/* Heat Treatment */}
            <div className="bg-white p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-display font-bold text-primary-900 mb-6 border-b border-gray-100 pb-4">Heat Treatment</h2>
              <ul className="space-y-3">
                 {[
                   'Quenching',
                   'Tempering',
                   'Nitriding',
                   'Vacuum heat treatment',
                   'Stress relief',
                   'Hardening treatment'
                 ].map((item, i) => (
                   <li key={i} className="flex items-start gap-3 text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-900 shrink-0 mt-1.5" />
                      {item}
                   </li>
                 ))}
              </ul>
            </div>

            {/* Surface Treatment */}
            <div className="bg-white p-8 border border-gray-200 shadow-sm">
              <h2 className="text-xl font-display font-bold text-primary-900 mb-6 border-b border-gray-100 pb-4">Surface Treatment</h2>
              <div className="grid grid-cols-2 gap-3">
                 {[
                   'Anodizing',
                   'Passivation',
                   'Hard anodizing',
                   'Sandblasting',
                   'Black oxide',
                   'Polishing',
                   'Zinc plating',
                   'Brushing',
                   'Nickel plating',
                   'Electropolishing'
                 ].map((item, i) => (
                   <div key={i} className="flex items-start gap-2 text-sm text-gray-600">
                      <div className="h-1.5 w-1.5 rounded-full bg-primary-900 shrink-0 mt-1.5" />
                      {item}
                   </div>
                 ))}
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
}
