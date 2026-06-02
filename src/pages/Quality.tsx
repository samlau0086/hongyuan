import SEO from '../components/SEO';

export default function Quality() {
  return (
    <div className="bg-white">
      <SEO 
        title="Quality Control" 
        description="Quality is built into the precision machining process. Learn about our inspection equipment, calibration, and delivery control systems." 
        keywords="Incoming Inspection, Quality Control, Measurement Traceability" 
      />
      {/* Header */}
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Quality Control</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Quality is built into the process, not only inspected at the end.</p>
        </div>
      </section>

      {/* Quality Philosophy */}
      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">Quality Philosophy</h2>
            <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
              <p className="mb-6">
                We believe that precision machining quality depends on process planning, operator discipline, inspection control and continuous communication.
              </p>
              <p className="font-medium text-primary-900 border-l-2 border-accent pl-4">
                Final inspection is important. However, real quality begins before machining starts.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Process Control */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-primary-900">Process Control</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { title: 'Incoming Inspection', desc: 'Material grade, size, surface condition and certificates can be checked before production.' },
                { title: 'Material Traceability', desc: 'Material traceability records are maintained according to customer and project requirements.' },
                { title: 'In-Process Inspection', desc: 'Critical dimensions are inspected during machining to prevent batch defects.' },
                { title: 'Final Inspection', desc: 'Finished parts are inspected before shipment based on drawing dimensions, tolerances, surface treatment and appearance requirements.' },
                { title: 'Critical Dimension Control', desc: 'Key dimensions are identified before production. Inspection frequency is adjusted according to part risk and customer requirements.' },
              ].map((step, idx) => (
                <div key={idx} className="bg-white p-8 border border-gray-200 shadow-sm">
                   <div className="h-8 text-primary-900 font-mono text-sm font-bold opacity-30 mb-2">0{idx+1}</div>
                   <h3 className="text-lg font-sans font-bold text-primary-900 mb-3">{step.title}</h3>
                   <p className="text-sm text-gray-600 leading-relaxed">{step.desc}</p>
                </div>
              ))}
          </div>
        </div>
      </section>

      {/* Inspection Equipment & Calibration */}
      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 text-primary-900">Inspection Equipment</h2>
              <div className="bg-gray-50 border border-gray-200 p-8">
                <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {[
                    'CMM', 'TESA height gauge', 'Profile projector', 'Hardness tester',
                    'Gloss meter', 'Micrometers', 'Calipers', 'Pin gauges',
                    'Thread gauges', 'Surface roughness tester', 'Other precision tools'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-none bg-primary-900"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div>
              <h2 className="text-3xl font-display font-bold mb-8 text-primary-900">Calibration & Environment</h2>
              <div className="space-y-6">
                 <div>
                    <h3 className="text-lg font-bold text-primary-900 mb-2">Calibration Records</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Calibration records are maintained to ensure measurement reliability.</p>
                 </div>
                 <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-2">Traceability</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Measurement traceability supports stable quality control and customer audit requirements.</p>
                 </div>
                 <div className="border-t border-gray-100 pt-6">
                    <h3 className="text-lg font-bold text-primary-900 mb-2">Controlled Inspection Environment</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">Inspection conditions are managed to reduce measurement errors caused by temperature, handling or equipment variation.</p>
                 </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Delivery Control */}
      <section className="py-24 bg-primary-900 text-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-display font-bold mb-6">Delivery Control</h2>
            <div className="prose prose-lg text-gray-300 prose-p:leading-relaxed">
              <p className="mb-6">
                Production schedules and delivery milestones are continuously monitored to ensure stable lead time performance.
              </p>
              <p className="mb-6">
                We track material preparation, machining progress, outsourcing processes, inspection status and shipment readiness.
              </p>
              <p>
                Customers receive timely updates when required, especially for urgent projects or multi-process components.
              </p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
}
