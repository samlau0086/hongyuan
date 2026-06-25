import { Check } from 'lucide-react';
import SEO from '../components/SEO';

const capabilitySteps = [
  {
    id: 'precision-machining',
    title: 'Precision Machining',
    process: '01',
    intro: [
      'We specialize in custom precision machined parts for automation, semiconductor equipment, robotics, and industrial machinery.',
    ],
    groups: [
      {
        title: 'Core Machining Capabilities',
        items: ['CNC Milling', 'CNC Turning', 'Swiss-Type Turning', 'Surface Grinding', 'Wire EDM'],
      },
    ],
  },
  {
    id: 'tolerance-engineering',
    title: 'Tolerance & Engineering',
    process: '02',
    intro: [
      'We understand that precision is more than just machining - it directly affects fit, assembly, and product performance.',
    ],
    groups: [
      {
        title: 'Engineering Control',
        items: [
          'Tight tolerance machining (up to 0.01 mm)',
          'GD&T interpretation',
          'Critical dimension control',
          'Surface finish requirements',
          'Drawing-based manufacturability review',
        ],
      },
    ],
  },
  {
    id: 'one-stop-support',
    title: 'One-Stop Manufacturing Support',
    process: '03',
    intro: [
      'Based in Shenzhen, we benefit from a strong manufacturing ecosystem and extensive supplier network.',
      'Beyond machining, we can coordinate additional processes including:',
    ],
    groups: [
      {
        title: 'Additional Processes',
        items: [
          'Heat Treatment',
          'Anodizing',
          'Plating',
          'Sandblasting',
          'Surface Coating',
          'Sheet Metal Fabrication',
          'Assembly Support',
        ],
      },
    ],
  },
  {
    id: 'flexible-production',
    title: 'Flexible Production Support',
    process: '04',
    intro: ['We support customers across different project stages:'],
    groups: [
      {
        title: 'Production Stages',
        items: [
          'Fast Rapid Prototyping',
          'T1 / Engineering Samples',
          'Small-Batch Production',
          'Stable Repeat Orders',
          'Urgent Delivery Support',
        ],
      },
    ],
  },
  {
    id: 'materials',
    title: 'Materials We Machine',
    process: '05',
    intro: [
      'We work with a wide range of engineering materials for precision machining applications.',
      'Material certificates and traceability documents can be provided.',
    ],
    groups: [
      {
        title: 'Metals',
        items: [
          'Aluminum (2017, 6061, 6063, 5056, 7075)',
          'Carbon Steel',
          'Stainless Steel',
          'Brass',
          'Copper',
          'Tool Steel',
          'Titanium',
        ],
      },
      {
        title: 'Engineering Plastics',
        items: ['POM (Delrin)', 'PTFE', 'Nylon', 'PEEK', 'Acrylic', 'UHMW'],
      },
      {
        title: 'Special Materials',
        items: ['Inconel', 'SKD11', 'A2', 'P20', 'Hardened Steel'],
      },
    ],
  },
  {
    id: 'heat-treatment-surface-finishing',
    title: 'Heat Treatment & Surface Finishing',
    process: '06',
    intro: [
      'Heat treatment and surface finishing are coordinated through our trusted partner network in Shenzhen, ensuring consistent quality and fast turnaround.',
    ],
    groups: [
      {
        title: 'Available Processes',
        items: ['Hardening', 'Anodizing', 'Plating', 'Sandblasting', 'Coating', 'And more'],
      },
    ],
  },
];

export default function Capabilities() {
  return (
    <div className="bg-white">
      <SEO
        title="Our Capabilities"
        description="From prototype to production, we manufacture custom precision parts based on customer drawings, supporting prototypes, small batches, and stable production with flexible manufacturing resources."
        keywords="CNC Milling, CNC Turning, Precision Grinding, EDM, Wire Cut, Tolerances, Materials"
      />
      {/* Header */}
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Our Capabilities</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-semibold mb-4">From Prototype to Production, Built Around Your Drawings</p>
          <p className="text-lg text-gray-400 max-w-4xl leading-relaxed">
            We manufacture custom precision parts based on customer drawings, supporting prototypes, small batches, and stable production with flexible manufacturing resources.
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-32">
          {capabilitySteps.map((step) => (
            <section key={step.id} className="scroll-mt-32" id={step.id}>
              <div className="border-b border-gray-200 pb-4 mb-8 flex items-baseline gap-4">
                <h2 className="text-3xl font-display font-bold text-primary-900">{step.title}</h2>
                <span className="text-sm font-sans font-medium text-gray-400 uppercase tracking-widest hidden sm:block">{step.process}</span>
              </div>
              <div className={`grid gap-8 ${step.groups.length >= 3 ? 'md:grid-cols-4' : 'md:grid-cols-2'}`}>
                <div>
                  {step.intro.map((paragraph) => (
                    <p key={paragraph} className="text-sm text-gray-600 leading-relaxed mb-4 last:mb-0">
                      {paragraph}
                    </p>
                  ))}
                </div>
                {step.groups.map((group) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary-900 mb-4">{group.title}</h3>
                    <ul className="space-y-3">
                      {group.items.map((item) => (
                        <li key={item} className="flex items-start gap-3 text-gray-600 text-sm">
                          <Check className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>
          ))}
        </div>
      </div>
    </div>
  );
}
