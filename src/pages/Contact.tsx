import React, { useState } from 'react';
import { Linkedin, Mail, Phone, Smartphone, UploadCloud, MapPin, Send } from 'lucide-react';
import SEO from '../components/SEO';
import { Locale, useLocale } from '../i18n';

const content: Record<Locale, any> = {
  en: {
    seo: {
      title: 'Contact Us & RFQ',
      description: 'Request a quote for precision machining. Upload your drawings and technical requirements for a professional manufacturability review and quotation.',
      keywords: 'Request a Quote, Precision Machining RFQ, Upload Drawings, Contact Machining Supplier',
    },
    header: ['Request a Quote', 'Send us your drawings and technical requirements for a professional manufacturability review and quotation.'],
    introTitle: 'Send Us Your Drawings',
    intro: ['Upload your drawings and requirements for a fast quotation.', 'Our engineering team will quickly review manufacturability, tolerance requirements, materials, and lead time - ', 'typically within 24 hours'],
    contactInfo: 'Contact Information',
    labels: {
      email: 'Email',
      tel: 'Tel',
      mobile: 'Mobile',
      location: 'Location',
      name: 'Name *',
      company: 'Company *',
      phone: 'Phone / WhatsApp',
      requirements: 'Additional Technical Requirements',
      upload: 'Upload Drawing (2D/3D)',
      uploadText: 'Click to upload',
      formats: 'Supported formats: PDF, STEP, IGES, DWG, DXF (Max 20MB)',
      submit: 'Upload Drawings & Request Quote',
      submitting: 'Submitting...',
      privacy: 'We respect your privacy. Your drawings are kept strictly confidential.',
      filesSelected: 'files selected',
    },
    success: {
      title: 'RFQ Submitted Successfully',
      body: 'Thank you for reaching out. Our engineering team will review your requirements and provide a quotation shortly.',
      again: 'Submit another request',
    },
    errors: {
      failed: 'Failed to submit RFQ. Please try again.',
    },
  },
  ja: {
    seo: {
      title: 'お問い合わせ・見積依頼',
      description: '精密加工の見積をご依頼ください。図面と技術要求をアップロードいただければ、製造性レビューと見積を行います。',
      keywords: '見積依頼, 精密加工 RFQ, 図面アップロード, 加工サプライヤー',
    },
    header: ['見積依頼', '図面と技術要求をお送りください。製造性、要求公差、納期を確認して見積します。'],
    introTitle: '図面をお送りください',
    intro: ['図面と要求事項をアップロードして、迅速な見積をご依頼ください。', '当社エンジニアが製造性、公差要求、材料、リードタイムを迅速に確認します - ', '通常24時間以内'],
    contactInfo: '連絡先情報',
    labels: {
      email: 'メール',
      tel: '電話',
      mobile: '携帯',
      location: '所在地',
      name: 'お名前 *',
      company: '会社名 *',
      phone: '電話 / WhatsApp',
      requirements: '追加技術要求',
      upload: '図面アップロード (2D/3D)',
      uploadText: 'クリックしてアップロード',
      formats: '対応形式: PDF, STEP, IGES, DWG, DXF (最大20MB)',
      submit: '図面をアップロードして見積依頼',
      submitting: '送信中...',
      privacy: '図面と情報は厳密に機密管理します。',
      filesSelected: '件のファイルを選択済み',
    },
    success: {
      title: 'RFQを送信しました',
      body: 'お問い合わせありがとうございます。エンジニアリングチームが内容を確認し、まもなく見積をご連絡します。',
      again: '別の依頼を送信',
    },
    errors: {
      failed: 'RFQの送信に失敗しました。もう一度お試しください。',
    },
  },
  zh: {
    seo: {
      title: '联系我们与询价',
      description: '提交精密加工报价请求。上传图纸和技术要求，我们将进行专业的可制造性评审并报价。',
      keywords: '请求报价, 精密加工询价, 上传图纸, 联系加工供应商',
    },
    header: ['请求报价', '发送您的图纸和技术要求，我们将进行专业的可制造性评审并报价。'],
    introTitle: '发送您的图纸',
    intro: ['上传图纸和要求，快速获取报价。', '我们的工程团队会快速评审可制造性、公差要求、材料和交期 - ', '通常24小时内'],
    contactInfo: '联系方式',
    labels: {
      email: '邮箱',
      tel: '电话',
      mobile: '手机',
      location: '地址',
      name: '姓名 *',
      company: '公司 *',
      phone: '电话 / WhatsApp',
      requirements: '其他技术要求',
      upload: '上传图纸 (2D/3D)',
      uploadText: '点击上传',
      formats: '支持格式: PDF, STEP, IGES, DWG, DXF (最大20MB)',
      submit: '上传图纸并请求报价',
      submitting: '提交中...',
      privacy: '我们尊重您的隐私，您的图纸将严格保密。',
      filesSelected: '个文件已选择',
    },
    success: {
      title: '询价提交成功',
      body: '感谢您的联系。我们的工程团队将评审您的要求，并尽快提供报价。',
      again: '提交另一个请求',
    },
    errors: {
      failed: '提交失败，请重试。',
    },
  },
};

export default function Contact() {
  const { locale } = useLocale();
  const copy = content[locale];
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
        throw new Error(result.error || copy.errors.failed);
      }

      form.reset();
      setSelectedFileName('');
      setIsSubmitted(true);
    } catch (error: any) {
      setSubmitError(error.message || copy.errors.failed);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-primary-50">
      <SEO title={copy.seo.title} description={copy.seo.description} keywords={copy.seo.keywords} />
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">{copy.header[0]}</h1>
          <p className="text-xl text-gray-400 max-w-2xl">{copy.header[1]}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-3 gap-16">
            <div className="lg:col-span-1 space-y-12">
              <div>
                <h2 className="text-2xl font-display font-bold text-primary-900 mb-6">{copy.introTitle}</h2>
                <div className="prose text-gray-600 text-sm leading-relaxed mb-8">
                  <p>{copy.intro[0]}</p>
                  <p>
                    {copy.intro[1]}<span style={{ color: '#0000FF' }}>{copy.intro[2]}</span>.
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary-900 mb-4">{copy.contactInfo}</h3>
                <ul className="space-y-6">
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200"><Mail className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{copy.labels.email}</p>
                      <a href="mailto:lynn.lee@hongyuan-precision.com" className="text-sm text-primary-900 hover:text-accent font-medium">lynn.lee@hongyuan-precision.com</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200"><Phone className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{copy.labels.tel}</p>
                      <p className="text-sm text-primary-900 font-medium">0086-755-23059684</p>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200"><Smartphone className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{copy.labels.mobile}</p>
                      <a href="tel:+8619162613785" className="text-sm text-primary-900 hover:text-accent font-medium">+8619162613785</a>
                    </div>
                  </li>
                  <li className="flex items-start gap-4">
                    <div className="bg-white p-3 border border-gray-200"><MapPin className="h-5 w-5 text-accent" /></div>
                    <div>
                      <p className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">{copy.labels.location}</p>
                      <p className="text-sm text-primary-900 font-medium">Shajing, Bao'an District<br />Shenzhen City, China</p>
                    </div>
                  </li>
                </ul>
                <div className="mt-8 flex items-center gap-3 border-t border-gray-200 pt-6">
                  <a href="https://wa.me/8618926541701" target="_blank" rel="noreferrer" aria-label="WhatsApp" className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-accent transition-colors hover:border-accent hover:bg-accent hover:text-white">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                    </svg>
                  </a>
                  <a href="https://linkedin.com/in/lee-lynn-b173a075" target="_blank" rel="noreferrer" aria-label="LinkedIn" className="flex h-10 w-10 items-center justify-center border border-gray-200 bg-white text-accent transition-colors hover:border-accent hover:bg-accent hover:text-white">
                    <Linkedin className="h-5 w-5" />
                  </a>
                </div>
              </div>
            </div>

            <div className="lg:col-span-2">
              <div className="bg-white p-8 md:p-12 border border-gray-200 shadow-sm">
                {isSubmitted ? (
                  <div className="text-center py-16">
                    <div className="mx-auto w-16 h-16 bg-green-50 border border-green-100 rounded-full flex items-center justify-center mb-6">
                      <Send className="h-6 w-6 text-green-600 ml-1" />
                    </div>
                    <h2 className="text-2xl font-display font-bold text-primary-900 mb-4">{copy.success.title}</h2>
                    <p className="text-gray-600 mb-8 max-w-md mx-auto">{copy.success.body}</p>
                    <button onClick={() => setIsSubmitted(false)} className="text-accent font-semibold text-sm hover:underline">{copy.success.again}</button>
                  </div>
                ) : (
                  <form onSubmit={handleSubmit} encType="multipart/form-data" className="space-y-8">
                    <div className="grid md:grid-cols-2 gap-6">
                      <TextField label={copy.labels.name} name="name" required />
                      <TextField label={copy.labels.company} name="company" required />
                      <TextField label={`${copy.labels.email} *`} name="email" type="email" required />
                      <TextField label={copy.labels.phone} name="phone" type="tel" />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{copy.labels.requirements}</label>
                      <textarea name="requirements" rows={4} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors"></textarea>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{copy.labels.upload}</label>
                      <label className="block border-2 border-dashed border-gray-200 bg-gray-50 hover:bg-gray-100 transition-colors p-8 text-center cursor-pointer">
                        <input
                          name="drawing"
                          type="file"
                          multiple
                          className="sr-only"
                          accept=".pdf,.step,.stp,.iges,.igs,.dwg,.dxf,.zip,.rar,.7z"
                          onChange={(event) => {
                            const files = Array.from(event.currentTarget.files || []) as File[];
                            const multi = locale === 'en' ? `${files.length} ${copy.labels.filesSelected}` : locale === 'ja' ? `${files.length}${copy.labels.filesSelected}` : `${files.length}${copy.labels.filesSelected}`;
                            setSelectedFileName(files.length > 1 ? multi : files[0]?.name || '');
                          }}
                        />
                        <UploadCloud className="h-8 w-8 text-gray-400 mx-auto mb-3" />
                        <p className="text-sm font-medium text-primary-900 mb-1">{selectedFileName || copy.labels.uploadText}</p>
                        <p className="text-xs text-gray-500">{copy.labels.formats}</p>
                      </label>
                    </div>

                    <div className="pt-4">
                      {submitError && <p className="mb-4 border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">{submitError}</p>}
                      <button type="submit" disabled={isSubmitting} className="w-full flex items-center justify-center px-8 py-4 text-sm font-semibold text-white transition-colors bg-primary-900 hover:bg-primary-800 disabled:opacity-70 disabled:cursor-not-allowed">
                        {isSubmitting ? copy.labels.submitting : copy.labels.submit}
                      </button>
                      <p className="text-center text-xs text-gray-500 mt-4">{copy.labels.privacy}</p>
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

function TextField({ label, name, type = 'text', required = false }: { label: string; name: string; type?: string; required?: boolean }) {
  return (
    <div>
      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-2">{label}</label>
      <input required={required} name={name} type={type} className="w-full bg-gray-50 border border-gray-200 px-4 py-3 text-sm focus:outline-none focus:border-accent focus:ring-1 focus:ring-accent transition-colors" />
    </div>
  );
}
