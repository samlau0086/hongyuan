import { Factory, Cpu, Car, Layers, Box, Wrench } from 'lucide-react';
import SEO from '../components/SEO';
import { Locale, useLocale } from '../i18n';

const icons = [Car, Cpu, Layers, Factory, Box, Wrench];

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

const content: Record<Locale, any> = {
  en: {
    seo: {
      title: 'About Us',
      description:
        'We are a professional precision machining manufacturer focused on CNC milling, CNC turning, precision grinding, EDM, heat treatment, surface finishing and assembly support.',
      keywords: 'Precision Machining, CNC Machining, About Precision Japan Manufacturing, Machining Supplier',
    },
    header: ['About Us', 'Japanese Quality Standards, Shenzhen Manufacturing Speed.'],
    companyTitle: 'About Our Company',
    company: [
      'Hongyuan Machinery Limited is a precision machining partner based in Shenzhen, China - one of the world’s most dynamic manufacturing hubs.',
      'For over 15 years, we have supplied custom machined parts to Japanese customers in the automotive and automation industries, building strong expertise in strict tolerance control, quality management, and on-time delivery. Over the years, our customer base has expanded from Japan to Europe and North America, serving customers across a wider range of industries.',
      'Located in Shenzhen, we benefit from a highly developed manufacturing ecosystem and extensive supplier network. This allows us to offer flexible support beyond machining, including grinding, heat treatment, surface finishing, and other secondary processes.',
      'We specialize in custom parts based on customer drawings, supporting both fast prototypes and small-to-medium batch production.',
    ],
    companyLead:
      'At Hongyuan Precision, we do more than make parts - we help customers solve manufacturing challenges with precision, responsiveness, and reliability.',
    industriesTitle: 'Industries We Serve',
    industries: [
      ['Automotive Industry', 'Precision components for fixtures, jigs, inspection tools, automation modules and production equipment.'],
      ['Semiconductor Equipment', 'Precision structural parts, custom brackets, tooling components and high-accuracy machined parts.'],
      ['Automation Equipment', 'Components for automated assembly lines, robotic systems, motion modules and custom production equipment.'],
      ['Turnkey Equipment', 'We support machine builders with one-stop machining, surface finishing and assembly-ready parts.'],
      ['Food Machinery', 'Stainless steel parts, shafts, brackets and custom components for food processing and packaging machinery.'],
      ['Jigs & Fixtures', 'Custom assembly jigs, inspection fixtures, holding clamps, and precision functional tooling bases.'],
    ],
    trustedTitle: 'Trusted by Industry Leaders',
    trusted: [
      'Our precision machined components support supply chains serving leading global manufacturers in automotive, automation, and industrial equipment.',
      'Our customers provide parts and systems to internationally recognized companies such as:',
      'Through years of reliable manufacturing support, we have helped our customers meet strict requirements for quality, precision, and delivery.',
    ],
    showcaseTitle: 'Precision Parts Showcase',
    showcaseSubtitle: 'Examples of custom precision parts we manufacture based on customer drawings.',
  },
  ja: {
    seo: {
      title: '会社概要',
      description: 'CNCフライス、CNC旋盤、精密研削、EDM、熱処理、表面処理、組立支援に対応する精密加工パートナーです。',
      keywords: '精密加工, CNC加工, 会社概要, 日本品質, 深セン製造',
    },
    header: ['会社概要', '日本品質基準、深センの製造スピード。'],
    companyTitle: '会社について',
    company: [
      'Hongyuan Machinery Limited は、中国・深センを拠点とする精密加工パートナーです。深センは世界でも有数の活発な製造拠点の一つです。',
      '15年以上にわたり、自動車・自動化分野の日本のお客様へカスタム加工部品を供給し、厳しい公差管理、品質管理、納期対応の経験を蓄積してきました。現在は日本から欧州、北米へと顧客基盤を広げ、より幅広い業界に対応しています。',
      '深センの発達した製造エコシステムと広いサプライヤーネットワークを活かし、加工だけでなく研削、熱処理、表面処理、その他二次加工まで柔軟に支援できます。',
      'お客様の図面に基づくカスタム部品を専門とし、短納期試作から小中ロット生産まで対応します。',
    ],
    companyLead: 'Hongyuan Precision は単に部品を作るだけでなく、精度、対応力、信頼性でお客様の製造課題を解決します。',
    industriesTitle: '対応業界',
    industries: [
      ['自動車産業', '治具、検査工具、自動化モジュール、生産設備向けの精密部品。'],
      ['半導体装置', '精密構造部品、特注ブラケット、治工具部品、高精度加工部品。'],
      ['自動化設備', '自動組立ライン、ロボットシステム、モーションモジュール、専用設備向け部品。'],
      ['ターンキー設備', '機械メーカー向けに加工、表面処理、組立対応部品を一括支援。'],
      ['食品機械', '食品加工・包装機械向けステンレス部品、シャフト、ブラケット、特注部品。'],
      ['治具・固定具', '組立治具、検査治具、保持クランプ、精密機能ベース。'],
    ],
    trustedTitle: '業界リーダーからの信頼',
    trusted: [
      '当社の精密加工部品は、自動車、自動化、産業設備分野のグローバルメーカーを支えるサプライチェーンで使用されています。',
      '当社のお客様は、以下のような国際的に認知された企業へ部品やシステムを供給しています。',
      '長年の安定した製造支援を通じて、品質、精度、納期に関する厳しい要求達成を支えてきました。',
    ],
    showcaseTitle: '精密部品ショーケース',
    showcaseSubtitle: 'お客様の図面に基づいて製作するカスタム精密部品の例です。',
  },
  zh: {
    seo: {
      title: '关于我们',
      description: '我们是一家专业精密加工制造商，专注CNC铣削、CNC车削、精密研磨、EDM、热处理、表面处理和装配支持。',
      keywords: '精密加工, CNC加工, 关于我们, 日本品质, 深圳制造',
    },
    header: ['关于我们', '日本品质标准，深圳制造速度。'],
    companyTitle: '关于公司',
    company: [
      'Hongyuan Machinery Limited 是一家位于中国深圳的精密加工合作伙伴。深圳是全球最具活力的制造中心之一。',
      '15年以上来，我们为日本汽车和自动化行业客户供应定制加工零件，积累了严格公差控制、品质管理和准时交付方面的经验。随着发展，我们的客户群已从日本扩展至欧洲和北美，服务更广泛的行业。',
      '位于深圳，我们受益于成熟的制造生态和广泛的供应商网络。因此，除机加工外，我们还可以灵活支持研磨、热处理、表面处理及其他二次工艺。',
      '我们专注于基于客户图纸的定制零件，支持快速样件和中小批量生产。',
    ],
    companyLead: '在 Hongyuan Precision，我们不只是制造零件，更以精度、响应速度和可靠性帮助客户解决制造挑战。',
    industriesTitle: '服务行业',
    industries: [
      ['汽车行业', '用于治具、夹具、检测工具、自动化模块和生产设备的精密部件。'],
      ['半导体设备', '精密结构件、定制支架、工装部件和高精度加工件。'],
      ['自动化设备', '自动装配线、机器人系统、运动模块和定制生产设备部件。'],
      ['整线设备', '为设备制造商提供机加工、表面处理和装配就绪零件的一站式支持。'],
      ['食品机械', '用于食品加工和包装机械的不锈钢零件、轴类、支架和定制部件。'],
      ['工装夹具', '定制装配治具、检测夹具、夹持工装和精密功能底座。'],
    ],
    trustedTitle: '受到行业领先企业信赖',
    trusted: [
      '我们的精密加工零件支持服务于汽车、自动化和工业设备领域全球领先制造商的供应链。',
      '我们的客户向以下国际知名企业提供零件和系统：',
      '通过多年可靠的制造支持，我们帮助客户满足品质、精度和交付方面的严格要求。',
    ],
    showcaseTitle: '精密零件展示',
    showcaseSubtitle: '展示我们根据客户图纸制造的定制精密零件示例。',
  },
};

export default function About() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <div className="bg-white">
      <SEO title={copy.seo.title} description={copy.seo.description} keywords={copy.seo.keywords} />

      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">{copy.header[0]}</h1>
          <p className="text-xl text-gray-400 max-w-2xl">{copy.header[1]}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">{copy.companyTitle}</h2>
              <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
                {copy.company.map((paragraph: string) => (
                  <p key={paragraph} className="mb-6">{paragraph}</p>
                ))}
                <p className="font-medium text-primary-900 border-l-2 border-accent pl-4">{copy.companyLead}</p>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img src="/about-us/about-our-company.jpg" alt="Hongyuan precision machining workshop" className="h-full min-h-[360px] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-primary-900">{copy.industriesTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {copy.industries.map(([title, desc]: string[], idx: number) => {
              const Icon = icons[idx];
              return (
                <div key={title} className="bg-white p-8 border border-gray-200 shadow-sm flex flex-col items-start">
                  <div className="mb-6 p-3 bg-gray-50 border border-gray-100 rounded-sm">
                    <Icon className="h-6 w-6 text-primary-900" />
                  </div>
                  <h3 className="text-lg font-sans font-bold text-primary-900 mb-3">{title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">{copy.trustedTitle}</h2>
              <div className="prose prose-lg text-gray-600">
                <p className="mb-6">{copy.trusted[0]}</p>
                <p className="mb-6">{copy.trusted[1]}</p>
                <p className="mb-6 font-semibold tracking-wide text-primary-900">DENSO · TOYOTA · MAZDA · HIRATA · CHUHATSU · ASKA</p>
                <p>{copy.trusted[2]}</p>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img src="/about-us/trusted-by-industry-leaders.jpg" alt="Precision machining parts for industry leaders" className="h-full min-h-[360px] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-900 text-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="mb-12">
            <h2 className="text-3xl font-display font-bold mb-4">{copy.showcaseTitle}</h2>
            <p className="text-gray-400">{copy.showcaseSubtitle}</p>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {sampleParts.map((part) => (
              <div key={part.src} className="group overflow-hidden border border-gray-700/50 bg-primary-800">
                <div className="aspect-square overflow-hidden bg-primary-800">
                  <img src={part.src} alt={part.title} loading="lazy" className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105" />
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
