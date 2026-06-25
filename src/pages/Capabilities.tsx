import { Check } from 'lucide-react';
import SEO from '../components/SEO';
import { Locale, useLocale } from '../i18n';

const content: Record<Locale, any> = {
  en: {
    seo: {
      title: 'Our Capabilities',
      description:
        'From prototype to production, we manufacture custom precision parts based on customer drawings, supporting prototypes, small batches, and stable production with flexible manufacturing resources.',
      keywords: 'CNC Milling, CNC Turning, Precision Grinding, EDM, Wire Cut, Tolerances, Materials',
    },
    header: [
      'Our Capabilities',
      'From Prototype to Production, Built Around Your Drawings',
      'We manufacture custom precision parts based on customer drawings, supporting prototypes, small batches, and stable production with flexible manufacturing resources.',
    ],
    steps: [
      {
        id: 'precision-machining',
        title: 'Precision Machining',
        process: '01',
        intro: ['We specialize in custom precision machined parts for automation, semiconductor equipment, robotics, and industrial machinery.'],
        groups: [{ title: 'Core Machining Capabilities', items: ['CNC Milling', 'CNC Turning', 'Swiss-Type Turning', 'Surface Grinding', 'Wire EDM'] }],
      },
      {
        id: 'tolerance-engineering',
        title: 'Tolerance & Engineering',
        process: '02',
        intro: ['We understand that precision is more than just machining - it directly affects fit, assembly, and product performance.'],
        groups: [{ title: 'Engineering Control', items: ['Tight tolerance machining (up to 0.01 mm)', 'GD&T interpretation', 'Critical dimension control', 'Surface finish requirements', 'Drawing-based manufacturability review'] }],
      },
      {
        id: 'one-stop-support',
        title: 'One-Stop Manufacturing Support',
        process: '03',
        intro: ['Based in Shenzhen, we benefit from a strong manufacturing ecosystem and extensive supplier network.', 'Beyond machining, we can coordinate additional processes including:'],
        groups: [{ title: 'Additional Processes', items: ['Heat Treatment', 'Anodizing', 'Plating', 'Sandblasting', 'Surface Coating', 'Sheet Metal Fabrication', 'Assembly Support'] }],
      },
      {
        id: 'flexible-production',
        title: 'Flexible Production Support',
        process: '04',
        intro: ['We support customers across different project stages:'],
        groups: [{ title: 'Production Stages', items: ['Fast Rapid Prototyping', 'T1 / Engineering Samples', 'Small-Batch Production', 'Stable Repeat Orders', 'Urgent Delivery Support'] }],
      },
      {
        id: 'materials',
        title: 'Materials We Machine',
        process: '05',
        intro: ['We work with a wide range of engineering materials for precision machining applications.', 'Material certificates and traceability documents can be provided.'],
        groups: [
          { title: 'Metals', items: ['Aluminum (2017, 6061, 6063, 5056, 7075)', 'Carbon Steel', 'Stainless Steel', 'Brass', 'Copper', 'Tool Steel', 'Titanium'] },
          { title: 'Engineering Plastics', items: ['POM (Delrin)', 'PTFE', 'Nylon', 'PEEK', 'Acrylic', 'UHMW'] },
          { title: 'Special Materials', items: ['Inconel', 'SKD11', 'A2', 'P20', 'Hardened Steel'] },
        ],
      },
      {
        id: 'heat-treatment-surface-finishing',
        title: 'Heat Treatment & Surface Finishing',
        process: '06',
        intro: ['Heat treatment and surface finishing are coordinated through our trusted partner network in Shenzhen, ensuring consistent quality and fast turnaround.'],
        groups: [{ title: 'Available Processes', items: ['Hardening', 'Anodizing', 'Plating', 'Sandblasting', 'Coating', 'And more'] }],
      },
    ],
  },
  ja: {
    seo: {
      title: '加工能力',
      description: '試作から量産まで、お客様の図面を基にカスタム精密部品を製造し、小ロットから安定生産まで柔軟に対応します。',
      keywords: 'CNCフライス, CNC旋盤, 精密研削, EDM, ワイヤーカット, 公差, 材料',
    },
    header: ['加工能力', '試作から量産まで、図面を中心に構築した製造体制', 'お客様の図面に基づいてカスタム精密部品を製造し、試作、小ロット、安定生産まで柔軟な製造リソースで対応します。'],
    steps: [
      {
        id: 'precision-machining',
        title: '精密加工',
        process: '01',
        intro: ['自動化、半導体装置、ロボット、産業機械向けのカスタム精密加工部品を得意としています。'],
        groups: [{ title: '主要加工能力', items: ['CNCフライス', 'CNC旋盤', 'スイス型旋盤', '平面研削', 'ワイヤーEDM'] }],
      },
      {
        id: 'tolerance-engineering',
        title: '公差・エンジニアリング',
        process: '02',
        intro: ['精度は単なる加工寸法ではなく、組付け、嵌合、製品性能に直接影響します。'],
        groups: [{ title: '技術管理', items: ['厳公差加工 (最大0.01 mm)', 'GD&T読解', '重要寸法管理', '表面粗さ要求', '図面ベースの製造性レビュー'] }],
      },
      {
        id: 'one-stop-support',
        title: 'ワンストップ製造支援',
        process: '03',
        intro: ['深センの強い製造エコシステムと広いサプライヤーネットワークを活用しています。', '加工以外にも以下の工程を調整できます。'],
        groups: [{ title: '追加工程', items: ['熱処理', 'アルマイト', 'メッキ', 'サンドブラスト', '表面コーティング', '板金加工', '組立支援'] }],
      },
      {
        id: 'flexible-production',
        title: '柔軟な生産支援',
        process: '04',
        intro: ['プロジェクトの各段階に対応します。'],
        groups: [{ title: '生産ステージ', items: ['短納期試作', 'T1 / エンジニアリングサンプル', '小ロット生産', '安定リピート品', '緊急納期対応'] }],
      },
      {
        id: 'materials',
        title: '加工対応材料',
        process: '05',
        intro: ['精密加工用途に向け、幅広いエンジニアリング材料に対応します。', '材料証明書やトレーサビリティ資料の提供も可能です。'],
        groups: [
          { title: '金属', items: ['アルミ (2017, 6061, 6063, 5056, 7075)', '炭素鋼', 'ステンレス鋼', '真鍮', '銅', '工具鋼', 'チタン'] },
          { title: 'エンジニアリング樹脂', items: ['POM (Delrin)', 'PTFE', 'ナイロン', 'PEEK', 'アクリル', 'UHMW'] },
          { title: '特殊材料', items: ['インコネル', 'SKD11', 'A2', 'P20', '焼入れ鋼'] },
        ],
      },
      {
        id: 'heat-treatment-surface-finishing',
        title: '熱処理・表面処理',
        process: '06',
        intro: ['深センの信頼できる協力会社ネットワークを通じ、熱処理と表面処理を調整し、品質と短納期を両立します。'],
        groups: [{ title: '対応工程', items: ['焼入れ', 'アルマイト', 'メッキ', 'サンドブラスト', 'コーティング', 'その他'] }],
      },
    ],
  },
  zh: {
    seo: {
      title: '加工能力',
      description: '从样件到量产，我们根据客户图纸制造定制精密零件，支持样件、小批量和稳定生产。',
      keywords: 'CNC铣削, CNC车削, 精密研磨, EDM, 线切割, 公差, 材料',
    },
    header: ['加工能力', '从样件到量产，围绕您的图纸构建制造支持', '我们根据客户图纸制造定制精密零件，支持样件、小批量和稳定生产，并提供灵活制造资源。'],
    steps: [
      {
        id: 'precision-machining',
        title: '精密加工',
        process: '01',
        intro: ['我们专注于为自动化、半导体设备、机器人和工业机械制造定制精密加工零件。'],
        groups: [{ title: '核心加工能力', items: ['CNC铣削', 'CNC车削', '走心机车削', '平面研磨', '线切割'] }],
      },
      {
        id: 'tolerance-engineering',
        title: '公差与工程支持',
        process: '02',
        intro: ['精密不只是加工尺寸，它直接影响装配、配合和产品性能。'],
        groups: [{ title: '工程控制', items: ['严公差加工 (可达0.01 mm)', 'GD&T图纸理解', '关键尺寸控制', '表面粗糙度要求', '基于图纸的可制造性评审'] }],
      },
      {
        id: 'one-stop-support',
        title: '一站式制造支持',
        process: '03',
        intro: ['依托深圳强大的制造生态和供应商网络，我们可以提供灵活协同支持。', '除机加工外，我们还可协调以下工艺：'],
        groups: [{ title: '附加工艺', items: ['热处理', '阳极氧化', '电镀', '喷砂', '表面涂层', '钣金加工', '装配支持'] }],
      },
      {
        id: 'flexible-production',
        title: '灵活生产支持',
        process: '04',
        intro: ['我们支持客户不同项目阶段的需求：'],
        groups: [{ title: '生产阶段', items: ['快速样件', 'T1 / 工程样品', '小批量生产', '稳定复购订单', '紧急交付支持'] }],
      },
      {
        id: 'materials',
        title: '可加工材料',
        process: '05',
        intro: ['我们可加工多种精密加工应用所需的工程材料。', '可按需提供材料证书和追溯文件。'],
        groups: [
          { title: '金属', items: ['铝 (2017, 6061, 6063, 5056, 7075)', '碳钢', '不锈钢', '黄铜', '铜', '工具钢', '钛'] },
          { title: '工程塑料', items: ['POM (Delrin)', 'PTFE', '尼龙', 'PEEK', '亚克力', 'UHMW'] },
          { title: '特殊材料', items: ['Inconel', 'SKD11', 'A2', 'P20', '淬硬钢'] },
        ],
      },
      {
        id: 'heat-treatment-surface-finishing',
        title: '热处理与表面处理',
        process: '06',
        intro: ['热处理和表面处理通过深圳可信赖的合作伙伴网络协调完成，确保稳定品质和快速周转。'],
        groups: [{ title: '可用工艺', items: ['淬火', '阳极氧化', '电镀', '喷砂', '涂层', '更多工艺'] }],
      },
    ],
  },
};

export default function Capabilities() {
  const { locale } = useLocale();
  const copy = content[locale];

  return (
    <div className="bg-white">
      <SEO title={copy.seo.title} description={copy.seo.description} keywords={copy.seo.keywords} />
      <section className="bg-primary-900 border-b border-gray-200 py-16">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <h1 className="text-4xl font-display font-bold text-white mb-4">{copy.header[0]}</h1>
          <p className="text-xl text-gray-300 max-w-3xl font-semibold mb-4">{copy.header[1]}</p>
          <p className="text-lg text-gray-400 max-w-4xl leading-relaxed">{copy.header[2]}</p>
        </div>
      </section>

      <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-24">
        <div className="space-y-32">
          {copy.steps.map((step: any) => (
            <section key={step.id} className="scroll-mt-32" id={step.id}>
              <div className="border-b border-gray-200 pb-4 mb-8 flex items-baseline gap-4">
                <h2 className="text-3xl font-display font-bold text-primary-900">{step.title}</h2>
                <span className="text-sm font-sans font-medium text-gray-400 uppercase tracking-widest hidden sm:block">{step.process}</span>
              </div>
              <div className={`grid gap-8 ${step.groups.length >= 3 ? 'md:grid-cols-4' : 'md:grid-cols-2'}`}>
                <div>
                  {step.intro.map((paragraph: string) => (
                    <p key={paragraph} className="text-sm text-gray-600 leading-relaxed mb-4 last:mb-0">{paragraph}</p>
                  ))}
                </div>
                {step.groups.map((group: any) => (
                  <div key={group.title}>
                    <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary-900 mb-4">{group.title}</h3>
                    <ul className="space-y-3">
                      {group.items.map((item: string) => (
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
