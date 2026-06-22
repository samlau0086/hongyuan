import React, { useState } from 'react';
import { Mail, Phone, UploadCloud, MapPin, Send } from 'lucide-react';
import SEO from '../components/SEO';

export default function Contact() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState('');
  const [selectedFileName, setSelectedFileName] = useState('');

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const form = e.currentTarget;
    setIsSubmitting(true);
    setSubmitError('');

    try {
      const response = await fetch('/api/rfq', {
        method: 'POST',
        body: new FormData(form),
      });

      const result = await response.json().catch(() => ({}));
      if (!response.ok) {
        throw new Error(result.error || 'Failed to submit RFQ. Please try again.');
      }

      form.reset();
      setSelectedFileName('');
      setIsSubmitted(true);
    } catch (error: any) {
      setSubmitError(error.message || 'Failed to submit RFQ. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
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
                    Upload your drawings and requirements for a fast quotation.
                  </p>
                  <p>
                    Our engineering team will quickly review manufacturability, tolerance requirements, materials, and lead time - <span style={{ color: '#0000FF' }}>typically within 24 hours</span>.
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
                      <a href="mailto:lynn.lee@hongyuan-precision.com" className="text-sm text-primary-900 hover:text-accent font-medium">lynn.lee@hongyuan-precision.com</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200">
                      <Phone className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Tel</p>
                      <p className="text-sm text-primary-900 font-medium">0086-755-23059684</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200">
                      <svg className="h-5 w-5 text-accent" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/>
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">WhatsApp</p>
                      <a href="https://wa.me/8618926541701" target="_blank" rel="noreferrer" className="text-sm text-primary-900 hover:text-accent font-medium">+86 189 2654 1701</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200">
                      <MapPin className="h-5 w-5 text-accent" />
                    </div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Location</p>
                      <p className="text-sm text-primary-900 font-medium">Shajing, Bao'an District<br/>Shenzhen City, China</p>
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
                  <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
                    {/* Basic Info */}
                    <div className="grid md:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Name *</label>
                        <input required name="name" type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Company *</label>
                        <input required name="company" type="text" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Email *</label>
                        <input required name="email" type="email" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                      <div>
                        <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Phone / WhatsApp</label>
                        <input name="phone" type="tel" className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Expected Delivery Date</label>
                      <input name="deliveryDate" type="text" placeholder="e.g. 2 weeks, specific date..." className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Additional Technical Requirements</label>
                      <textarea name="requirements" rows={4} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">Upload Drawing (2D/3D)</label>
                      <label className="block border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-8 text-center cursor-pointer">
                        <input
                          name="drawing"
                          type="file"
                          multiple
                          className="sr-only"
                          accept=".pdf,.step,.stp,.iges,.igs,.dwg,.dxf,.zip,.rar,.7z"
                          onChange={(event) => {
                            const files = Array.from(event.currentTarget.files || []) as File[];
                            setSelectedFileName(files.length > 1 ? `${files.length} files selected` : files[0]?.name || '');
                          }}
                        />
                        <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-primary-900 mb-1">{selectedFileName || 'Click to upload'}</p>
                        <p className="text-xs text-gray-500">Supported formats: PDF, STEP, IGES, DWG, DXF (Max 20MB)</p>
                      </label>
                    </div>

                    <div className="pt-4">
                      {submitError && (
                        <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                          {submitError}
                        </p>
                      )}
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
