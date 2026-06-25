import SEO from '../components/SEO';
import { Locale, useLocale } from '../i18n';

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

const content: Record<Locale, any> = {
  en: {
    seo: {
      title: 'Quality Control',
      description: 'Quality is built into the precision machining process. Learn about our inspection equipment, calibration, and delivery control systems.',
      keywords: 'Incoming Inspection, Quality Control, Measurement Traceability',
    },
    header: ['Quality Control', 'Quality is not just inspection at the end - it starts from drawing review, process control, and disciplined execution throughout production.'],
    commitmentTitle: 'Our Quality Commitment',
    commitment: ['100% inspection on critical dimensions', 'Full inspection report available upon request', '15 years of Japanese quality discipline'],
    processTitle: 'Quality Process',
    process: [
      ['Drawing Review', 'Critical tolerances, GD&T, and special requirements are reviewed before production.'],
      ['In-Process Inspection', 'Critical dimensions are checked during machining to prevent deviation.'],
      ['Final Inspection', 'Finished parts are inspected before shipment to ensure compliance.'],
      ['Inspection Report', 'Measurement reports can be provided for customer verification.'],
    ],
    equipmentTitle: 'Inspection Equipment',
    equipment: ['CMM', 'TESA height gauge', 'Profile projector', 'Hardness tester', 'Gloss meter', 'Micrometers', 'Calipers', 'Pin gauges', 'Thread gauges', 'Other precision tools'],
    deliveryTitle: 'Delivery Control',
    delivery: [
      'Production schedules and delivery milestones are continuously monitored to ensure stable lead time performance.',
      'We track material preparation, machining progress, outsourcing processes, inspection status and shipment readiness.',
      'Customers receive timely updates when required, especially for urgent projects or multi-process components.',
    ],
  },
  ja: {
    seo: {
      title: '品質管理',
      description: '品質は精密加工プロセスに組み込まれています。検査設備、校正、納期管理体制をご紹介します。',
      keywords: '受入検査, 品質管理, 測定トレーサビリティ',
    },
    header: ['品質管理', '品質は最終検査だけではありません。図面レビュー、工程管理、規律ある生産実行から始まります。'],
    commitmentTitle: '品質への取り組み',
    commitment: ['重要寸法は100%検査', 'ご要望に応じて全検査レポートを提供可能', '15年の日本品質管理経験'],
    processTitle: '品質プロセス',
    process: [
      ['図面レビュー', '重要公差、GD&T、特別要求を生産前に確認します。'],
      ['工程内検査', '加工中に重要寸法を確認し、寸法ズレを防ぎます。'],
      ['最終検査', '出荷前に完成品を検査し、要求仕様への適合を確認します。'],
      ['検査レポート', 'お客様の確認用に測定レポートを提供できます。'],
    ],
    equipmentTitle: '検査設備',
    equipment: ['CMM', 'TESA高さゲージ', '投影機', '硬度計', '光沢計', 'マイクロメータ', 'ノギス', 'ピンゲージ', 'ねじゲージ', 'その他精密測定工具'],
    deliveryTitle: '納期管理',
    delivery: [
      '生産スケジュールと納期マイルストーンを継続的に管理し、安定したリードタイムを確保します。',
      '材料準備、加工進捗、外注工程、検査状況、出荷準備を追跡します。',
      '緊急案件や複数工程部品では、必要に応じてタイムリーに進捗を共有します。',
    ],
  },
  zh: {
    seo: {
      title: '品质管理',
      description: '品质被构建进精密加工流程。了解我们的检测设备、校准和交期控制体系。',
      keywords: '来料检验, 品质管理, 测量追溯',
    },
    header: ['品质管理', '品质不只是最终检验，而是从图纸评审、过程控制和生产执行纪律开始。'],
    commitmentTitle: '我们的品质承诺',
    commitment: ['关键尺寸100%检测', '可按需提供完整检验报告', '15年日本品质管理经验'],
    processTitle: '品质流程',
    process: [
      ['图纸评审', '生产前评审关键公差、GD&T和特殊要求。'],
      ['过程检验', '加工过程中检查关键尺寸，防止偏差。'],
      ['最终检验', '出货前检查成品，确保符合要求。'],
      ['检验报告', '可提供测量报告供客户确认。'],
    ],
    equipmentTitle: '检测设备',
    equipment: ['CMM', 'TESA高度规', '投影仪', '硬度计', '光泽计', '千分尺', '卡尺', '针规', '螺纹规', '其他精密工具'],
    deliveryTitle: '交期控制',
    delivery: [
      '持续监控生产计划和交付节点，确保稳定交期表现。',
      '跟踪材料准备、加工进度、外协工艺、检验状态和出货准备。',
      '针对紧急项目或多工艺零件，我们会按需及时同步进度。',
    ],
  },
};

export default function Quality() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <div className="bg-white">
      <SEO title={copy.seo.title} description={copy.seo.description} keywords={copy.seo.keywords} />

      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">{copy.header[0]}</h1>
          <p className="text-xl text-gray-400 max-w-4xl">{copy.header[1]}</p>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-3xl font-display font-bold mb-6 text-primary-900">{copy.commitmentTitle}</h2>
              <div className="prose prose-lg text-gray-600 prose-p:leading-relaxed">
                <ul className="space-y-3 list-none pl-0">
                  {copy.commitment.map((item: string) => (
                    <li key={item} className="flex items-start gap-3 text-gray-600">
                      <span className="mt-2 h-1.5 w-1.5 bg-primary-900 shrink-0" />
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img src="/quality/inspect%20reporter.jpg" alt="Precision inspection report review" className="h-full min-h-[360px] w-full object-cover" />
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-50">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-display font-bold mb-12 text-primary-900">{copy.processTitle}</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {copy.process.map(([title, desc]: string[], idx: number) => (
              <div key={title} className="bg-white p-8 border border-gray-200 shadow-sm">
                <div className="h-8 text-primary-900 font-mono text-sm font-bold opacity-30 mb-2">0{idx + 1}</div>
                <h3 className="text-lg font-sans font-bold text-primary-900 mb-3">{title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-16">
            <div>
              <h2 className="text-3xl font-display font-bold mb-8 text-primary-900">{copy.equipmentTitle}</h2>
              <div className="bg-gray-50 border border-gray-200 p-8">
                <ul className="grid grid-cols-2 gap-y-4 gap-x-8">
                  {copy.equipment.map((item: string) => (
                    <li key={item} className="flex items-center gap-2 text-sm text-gray-600 font-medium">
                      <div className="w-1.5 h-1.5 rounded-none bg-primary-900"></div>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
              <img src="/quality/inspection-equipment.png" alt="Inspection equipment" className="h-full min-h-[360px] w-full object-cover" />
            </div>
          </div>

          <div className="mt-12 grid grid-cols-2 md:grid-cols-5 gap-4">
            {inspectionImages.map((image) => (
              <div key={image.src} className="overflow-hidden border border-gray-200 bg-gray-100 shadow-sm">
                <img src={image.src} alt={image.alt} loading="lazy" className="aspect-[4/3] w-full object-cover transition-transform duration-500 hover:scale-105" />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-primary-900 text-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl">
            <h2 className="text-3xl font-display font-bold mb-6">{copy.deliveryTitle}</h2>
            <div className="prose prose-lg text-gray-300 prose-p:leading-relaxed">
              {copy.delivery.map((paragraph: string) => (
                <p key={paragraph} className="mb-6 last:mb-0">{paragraph}</p>
              ))}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
