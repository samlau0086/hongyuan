import React, { useState } from 'react';
import { Mail, Phone, UploadCloud, MapPin, Send } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 1500);
  };

  return (
    <div className="bg-primary-50">
      <SEO 
        title="Contact Us & RFQ" 
        description="Request a quote for precision machining. Upload your drawings and technical requirements for a professional manufacturability review and quotation." 
        keywords="Request a Quote, Precision Machining RFQ, Upload Drawings, Contact Machining Supplier" 
      />
      {/* Header */}
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">Request a Quote</h1>
          <p className="text-xl text-gray-400 max-w-2xl">Send us your drawings and technical requirements for a professional manufacturability review and quotation.</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            
            {/* Contact Info Sidebar */}
            <div className="lg:col-span-1 space-y-12">
              <div>
                <h2 className="text-2xl font-display font-bold text-primary-900 mb-6">Send Us Your Drawings</h2>
                <div className="prose text-gray-600 text-sm leading-relaxed mb-8">
                  <p>
                    Send us your drawing files and technical requirements. We will review manufacturability, tolerance feasibility and lead time support.
                  </p>
                  <p>
                    Our engineering team will check your drawings and provide feedback on material, machining process, surface treatment, heat treatment and delivery schedule.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary-900 mb-4">Contact Information</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200">
                      <Mail className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Email</p>
                      <a href="mailto:sales@yourdomain.com" className="text-sm text-primary-900 hover:text-accent font-medium">sales@yourdomain.com</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">WhatsApp / Phone</p>
                      <p className="text-sm text-primary-900 font-medium">+86-XXXXXXXXXXX</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-sm text-primary-900 font-medium">Precision Manufacturing Hub<br/>China</p>
                    </div>
                  </li>
                </ul>
              </div>
            </div>

            {/* RFQ Form */}
            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 border border-gray-200 shadow-sm">
                {isSubmitted ? (
                  <div className="text-center py-16">
                     <div className="mx-auto w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mb-6">
                        <Send className="h-6 w-6 text-green-600 ml-1" />
                     </div>
                     <h2 className="text-2xl font-display font-bold text-primary-900 mb-4">RFQ Submitted Successfully</h2>
                     <p className="text-gray-600 mb-8 max-w-md mx-auto">
                       Thank you for reaching out. Our engineering team will review your requirements and provide a quotation shortly.
                     </p>
                     <button 
                       onClick={() => setIsSubmitted(false)}
                       className="text-accent font-semibold text-sm hover:underline"
                     >
                       Submit another request
                     </button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name *</label>
                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Company *</label>
                        <input required type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                        <input required type="email" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone / WhatsApp</label>
                        <input type="tel" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Country</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Industry</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                    </div>

                    <hr className="border-gray-100" />

                    {/* Part Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Part Name</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Quantity</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Material</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Tolerance Req (e.g. ±0.01mm)</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Surface Treatment</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Heat Treatment</label>
                        <input type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Expected Delivery Date</label>
                      <input type="text" placeholder="e.g. 2 weeks, specific date..." className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Additional Technical Requirements</label>
                      <textarea rows={4} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"></textarea>
                    </div>

                    {/* File Upload Placeholder */}
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Upload Drawing (2D/3D)</label>
                      <div className="border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-8 text-center cursor-pointer">
                        <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-primary-900 mb-1">Click to upload or drag and drop</p>
                        <p className="text-xs text-gray-500">Supported formats: PDF, STEP, IGES, DWG, DXF (Max 20MB)</p>
                      </div>
                    </div>

                    <div className="pt-4">
                      <button 
                        type="submit" 
                        disabled={isSubmitting}
                        className="w-full flex items-center justify-center px-8 py-4 text-sm font-semibold text-white transition-colors bg-primary-900 hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed"
                      >
                        {isSubmitting ? 'Submitting...' : 'Upload Drawings & Request Quote'}
                      </button>
                      <p className="text-center text-xs text-gray-500 mt-4">
                        We respect your privacy. Your drawings are kept strictly confidential.
                      </p>
                    </div>
                  </form>
                )}
              </div>
            </div>

          </div>
        </div>
      </section>
    </div>
  );
}
