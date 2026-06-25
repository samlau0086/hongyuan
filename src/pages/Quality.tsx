import SEO from '../components/SEO';

const inspectionImages = [
  { src: '/quality/2-Perpendicularity%20Inspection-TESA%20height%20gauge.jpg', alt: 'Perpendicularity inspection with TESA height gauge' },
  { src: '/quality/3-Height%20gauge-TESA.jpg', alt: 'TESA height gauge inspection' },
  { src: '/quality/4-%20Profile%20projector.jpg', alt: 'Profile projector inspection' },
  { src: '/quality/5-%20gloss%20meter-Surface%20Gloss%20Measurement.jpg', alt: 'Surface gloss measurement with gloss meter' },
  { src: '/quality/6-%20micrometer.jpg', alt: 'Micrometer inspection' },
  { src: '/quality/7-%20Outer%20Diameter%20Inspection-micrometers.jpg', alt: 'Outer diameter inspection with micrometers' },
  { src: '/quality/8-%20Hardness%20Inspection.jpg', alt: 'Hardness inspection' },
  { src: '/quality/9-%20pin%20gauges%20-Hole%20Diameter%20Inspection.jpg', alt: 'Hole diameter inspection with pin gauges' },
  { src: '/quality/10-%20Thread%20Inspection%20Using%20Thread%20Gauge.jpg', alt: 'Thread inspection using thread gauge' },
  { src: '/quality/11-%20Dimensional%20Quality%20Check%20for%20High-Precision%20Turning%20Components.png', alt: 'Dimensional quality check for high precision turning components' },
];

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
          <p className="text-xl text-gray-400 max-w-4xl">
            Quality is not just inspection at the end - it starts from drawing review, process control, and disciplined execution throughout production.
          </p>
        </div>
      </section>

      {/* Quality Commitment */}
      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">Our Quality Commitment</h2>
              <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
                <ul className="space-y-3 list-none pl-0">
                  {[
                    '100% inspection on critical dimensions',
                    'Full inspection report available upon request',
                    '15 years of Japanese quality discipline',
                  ].map((item) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600">
                      <span className="mt-2 h-1.5 w-1.5 bg-primary-900 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img
                src="/quality/inspect%20reporter.jpg"
                alt="Precision inspection report review"
                className="h-full min-h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Process Control */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-primary-900">Quality Process</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { title: 'Drawing Review', desc: 'Critical tolerances, GD&T, and special requirements are reviewed before production.' },
                { title: 'In-Process Inspection', desc: 'Critical dimensions are checked during machining to prevent deviation.' },
                { title: 'Final Inspection', desc: 'Finished parts are inspected before shipment to ensure compliance.' },
                { title: 'Inspection Report', desc: 'Measurement reports can be provided for customer verification.' },
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
                    'Thread gauges', 'Other precision tools'
                  ].map((item, i) => (
                    <li key={i} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-none bg-primary-900"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img
                src="/quality/inspection-equipment.png"
                alt="Inspection equipment"
                className="h-full min-h-[360px] w-full object-cover"
              />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {inspectionImages.map((image) => (
              <div key={image.src} className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                <img
                  src={image.src}
                  alt={image.alt}
                  loading="lazy"
                  className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105"
                />
              </div>
            ))}
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
