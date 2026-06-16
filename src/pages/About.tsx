import { Factory, Cpu, Car, Layers, Box, Wrench } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  const sampleParts = [
    { src: '/samples/Carbon%20Steel%20CNC%20Milled%20Parts.jpg', title: 'Carbon Steel CNC Milled Parts' },
    { src: '/samples/CNC%20Milled%20Aluminum%20Part%20with%20Clear%20Anodizing.jpg', title: 'CNC Milled Aluminum Part with Clear Anodizing' },
    { src: '/samples/CNC%20Turning%20Parts.jpg', title: 'CNC Turning Parts' },
    { src: '/samples/Metal%20Bellows%20Expansion%20Joint.jpg', title: 'Metal Bellows Expansion Joint' },
    { src: '/samples/Precision%20cam%20plate%20with%20tight%20tolerance%20control.jpg', title: 'Precision Cam Plate with Tight Tolerance Control' },
    { src: '/samples/Precision%20Machined%20Flange%20Housing.jpg', title: 'Precision Machined Flange Housing' },
    { src: '/samples/TiN%20Coated%20Precision%20Support%20Block.jpg', title: 'TiN Coated Precision Support Block' },
    { src: '/samples/Wire%20EDM%20Machined%20Gear%20with%20H7%20Inner%20Diameter%20Tolerance.jpg', title: 'Wire EDM Machined Gear with H7 Inner Diameter Tolerance' },
  ];

  return (
    <div className="bg-white">
      <SEO 
        title="About Us" 
        description="We are a professional precision machining manufacturer focused on CNC milling, CNC turning, precision grinding, EDM, heat treatment, surface finishing and assembly support." 
        keywords="Precision Machining, CNC Machining, About Precision Japan Manufacturing, Machining Supplier" 
      />
      {/* Header */}
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">About Us</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Japanese Quality Standards, Shenzhen Manufacturing Speed.</p>
        </div>
      </section>

      {/* About Our Company */}
      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">About Our Company</h2>
              <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
                <p className="mb-6">
                  Hongyuan Machinery Limited is a precision machining partner based in Shenzhen, China - one of the world's most dynamic manufacturing hubs.
                </p>
                <p className="mb-6">
                  For over 15 years, we have supplied custom machined parts to Japanese customers in the automotive and automation industries, building strong expertise in strict tolerance control, quality management, and on-time delivery. Over the years, our customer base has expanded from Japan to Europe and North America, serving customers across a wider range of industries.
                </p>
                <p className="mb-6">
                  Located in Shenzhen, we benefit from a highly developed manufacturing ecosystem and extensive supplier network. This allows us to offer flexible support beyond machining, including grinding, heat treatment, surface finishing, and other secondary processes.
                </p>
                <p className="mb-6">
                  We specialize in custom parts based on customer drawings, supporting both fast prototypes and small-to-medium batch production.
                </p>
                <p className="font-medium text-primary-900 border-l-2 border-accent pl-4">
                  At Hongyuan Precision, we do more than make parts - we help customers solve manufacturing challenges with precision, responsiveness, and reliability.
                </p>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img
                src="/about-us/about-our-company.jpg"
                alt="Hongyuan precision machining workshop"
                className="h-full min-h-[360px] w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Industries We Serve */}
      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-primary-900">Industries We Serve</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { title: 'Automotive Industry', icon: Car, desc: 'Precision components for fixtures, jigs, inspection tools, automation modules and production equipment.' },
              { title: 'Semiconductor Equipment', icon: Cpu, desc: 'Precision structural parts, custom brackets, tooling components and high-accuracy machined parts.' },
              { title: 'Automation Equipment', icon: Layers, desc: 'Components for automated assembly lines, robotic systems, motion modules and custom production equipment.' },
              { title: 'Turnkey Equipment', icon: Factory, desc: 'We support machine builders with one-stop machining, surface finishing and assembly-ready parts.' },
              { title: 'Food Machinery', icon: Box, desc: 'Stainless steel parts, shafts, brackets and custom components for food processing and packaging machinery.' },
              { title: 'Jigs & Fixtures', icon: Wrench, desc: 'Custom assembly jigs, inspection fixtures, holding clamps, and precision functional tooling bases.' },
            ].map((ind, idx) => (
              <div key={idx} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-start">
                 <div className="mb-6 p-3 bg-gray-50 border border-gray-100 rounded-sm">
                   <ind.icon className="h-6 w-6 text-primary-900" />
                 </div>
                 <h3 className="text-lg font-sans font-bold text-primary-900 mb-3">{ind.title}</h3>
                 <p className="text-sm text-gray-600 leading-relaxed">{ind.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Customer Backing */}
      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">Trusted by Industry Leaders</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-6">
                  Our precision machined components support supply chains serving leading global manufacturers in automotive, automation, and industrial equipment.
                </p>
                <p className="mb-6">
                  Our customers provide parts and systems to internationally recognized companies such as:
                </p>
                <p className="mb-6 font-semibold tracking-wide text-primary-900">
                  DENSO · TOYOTA · MAZDA · HIRATA · CHUHATSU · ASKA
                </p>
                <p>
                  Through years of reliable manufacturing support, we have helped our customers meet strict requirements for quality, precision, and delivery.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sample Parts */}
      <section className="py-24 bg-primary-900 text-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
           <div className="mb-12">
             <h2 className="text-3xl font-display font-bold mb-4">Precision Parts Showcase</h2>
             <p className="text-gray-400">Examples of custom precision parts we manufacture based on customer drawings.</p>
           </div>
           
           <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              {sampleParts.map((part) => (
                <div key={part.src} className="group overflow-hidden border border-gray-700/50 bg-primary-800">
                  <div className="aspect-square overflow-hidden bg-primary-800">
                    <img
                      src={part.src}
                      alt={part.title}
                      loading="lazy"
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <h3 className="px-4 py-3 text-sm font-medium text-gray-300 font-sans">{part.title}</h3>
                </div>
              ))}
           </div>
        </div>
      </section>

    </div>
  );
}
