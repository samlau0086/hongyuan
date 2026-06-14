import { Factory, Cpu, Car, Layers, Box, Wrench } from 'lucide-react';
import SEO from '../components/SEO';

export default function About() {
  const sampleParts = [
    { src: '/samples/IMG_1.jpg', title: 'CNC Milled Aluminum Parts' },
    { src: '/samples/IMG_2.jpg', title: 'Stainless Steel Precision Brackets' },
    { src: '/samples/IMG_3.jpg', title: 'Shaft Components' },
    { src: '/samples/IMG_4.jpg', title: 'Grinding Components' },
    { src: '/samples/IMG_5.jpg', title: 'EDM & Wire Cut Parts' },
    { src: '/samples/IMG_6.jpg', title: 'Surface-Treated Parts' },
    { src: '/samples/IMG_7.jpg', title: 'Assembly-Ready Mechanical Components' },
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
          <p className="text-xl text-gray-400 max-w-2xl">Understanding engineering intent, controlling process risk, and delivering stable parts.</p>
        </div>
      </section>

      {/* About Our Company */}
      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">About Our Company</h2>
            <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
              <p className="mb-6">
                We are a professional precision machining manufacturer focused on CNC milling, CNC turning, precision grinding, EDM, wire cutting, heat treatment, surface finishing and assembly support.
              </p>
              <p className="mb-6">
                For more than 15 years, we have supported customers in automotive manufacturing, semiconductor equipment, automation equipment, turnkey machinery and food machinery.
              </p>
              <p className="font-medium text-primary-900 border-l-2 border-accent pl-4">
                Our business philosophy is simple: understand the customer's engineering intent, control process risk and deliver stable parts with reliable quality.
              </p>
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
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">Customer Backing</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-6">
                  Our parts are used in projects related to Japanese automotive systems, factory automation, food machinery and industrial equipment manufacturing.
                </p>
                <p>
                  We understand that for equipment builders, one unstable component can delay the whole project. Therefore, we treat quality and delivery as a complete responsibility, not only a production task.
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
             <h2 className="text-3xl font-display font-bold mb-4">Typical Machined Parts</h2>
             <p className="text-gray-400">Examples of component categories we regularly produce.</p>
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
