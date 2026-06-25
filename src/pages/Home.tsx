import { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  UploadCloud,
  Award,
  Target,
  Zap,
  Package,
  ShieldCheck,
  UserCheck,
  Cpu,
  Bot,
  Car,
  Utensils,
  Key,
  FileText,
  Search,
  Shield,
  Wrench,
} from 'lucide-react';
import SEO from '../components/SEO';
import { BlogSummary, useBlogInitialData } from '../blogInitialData';
import { Locale, useLocale } from '../i18n';

const icons = {
  features: [Award, Target, Zap, Package, ShieldCheck, UserCheck],
  industries: [Cpu, Bot, Car, Utensils, Key, Wrench],
  quality: [Search, Shield, FileText],
};

const content: Record<Locale, any> = {
  en: {
    seo: {
      title: 'Home',
      description:
        'Reliable CNC machining, turning, grinding and one-stop manufacturing support for demanding industrial parts. We help engineers control quality from prototype to batch production.',
      keywords: 'Precision Machining, CNC Machining, Japanese Quality Discipline, Aluminum, Carbon Steel',
    },
    hero: {
      title: 'Your Reliable Machining Partner for Custom Parts\nJapanese Quality. Shenzhen Speed.',
      subtitle: 'Tight tolerance machining, full inspection, and reliable delivery for automation, and robotics industries.',
      primary: 'Upload Your Drawing',
      primarySub: 'Get Quote in 24 Hours',
      secondary: 'View Capabilities',
    },
    featuresTitle: 'Why Engineering Teams Choose Us',
    features: [
      ['1. Japanese Manufacturing Experience', '15 years serving Japanese automotive, automation and industrial equipment manufacturers.'],
      ['2. Tight Tolerance Capability', 'Grinding and precision machining capability within +/-0.01 mm.'],
      ['3. Rapid Prototype & Small Batch Support', 'Fast quotation, rapid prototyping and flexible low-volume production.'],
      ['4. One-Stop Manufacturing', 'Material sourcing, machining, heat treatment and surface finishing.'],
      ['5. Stable Quality & Delivery Control', 'Disciplined production management with proactive progress updates.'],
      ['6. Customer-Oriented Engineering Support', 'Helping customers reduce manufacturing costs through engineering optimization.'],
    ],
    industriesTitle: 'Industries We Serve',
    industries: [
      ['Semiconductor\nEquipment', '/industries/semiconductor equipment.jpg', ['Wafer Handling', 'Inspection Equipment', 'Vacuum Systems', 'Fixture Components']],
      ['Automation &\nRobotics', '/industries/automation & robotics.jpg', ['Robot Components', 'End Effectors', 'Motion Systems', 'Assembly Equipment']],
      ['Automotive\nEquipment', '/industries/automotive equipment.jpg', ['Production Line Parts', 'Jigs & Fixtures', 'Testing Equipment', 'Precision Components']],
      ['Food Processing\nEquipment', '/industries/food &packaging equipment.jpg', ['Conveyor Parts', 'Filling Machines', 'Cutting Components', 'Hygienic Equipment']],
      ['Handling and\nTurnkey Equipment', '/industries/Handling and turnkey equipment.jpg', ['Pick-and-Place Systems', 'Conveyor & Transfer Systems', 'Assembly Stations', 'Material Feeding Units']],
      ['Jigs &\nFixtures', '/industries/jigs&Fixtures.jpg', ['Assembly Jigs', 'Inspection Fixtures', 'Machining Fixtures', 'Welding Jigs']],
    ],
    capabilitiesTitle: 'Our Core Capabilities',
    capabilities: [
      ['CNC Milling', '/capabilities/cnc-miling.jpg', ['3/4/5-Axis Milling', 'Aluminum, Steel', 'Stainless, Plastics', 'Tolerance +/-0.01 mm']],
      ['CNC Turning', '/capabilities/cnc-turning.jpg', ['Precision Turning', 'Shafts, Bushings, Pins', 'Tight Concentricity', 'Tolerance +/-0.01 mm']],
      ['Surface Grinding', '/capabilities/Grinding.jpg', ['Flatness Control', 'Parallelism Control', 'Surface Finish Ra 0.2', 'Tolerance +/-0.01 mm']],
      ['EDM & Wire EDM', '/capabilities/edm.jpg', ['Complex Profiles', 'Hardened Materials', 'Precision Slots', 'High Accuracy']],
      ['Materials', '/capabilities/materials.jpg', ['Aluminum, Stainless Steel', 'Carbon Steel, Brass', 'Copper, Titanium', 'Engineering Plastics']],
      ['Secondary Processes', '/capabilities/secondary-process.jpg', ['Anodizing, Plating', 'Heat Treatment', 'Laser Marking', 'And More']],
    ],
    viewAllCapabilities: 'View All Capabilities',
    qualityTitle: 'Quality Built Into Every Step',
    qualityItems: [
      ['Advanced Inspection Equipment', 'CMM, Height Gauge, Profile Projector, Micrometer and more.'],
      ['Strict Process Control', 'Incoming, In-Process and Final Inspection to ensure consistent quality.'],
      ['Full Traceability', 'Material certificates, inspection reports and calibration records available.'],
    ],
    inspection: ['Inspection Item', 'Inspection Method'],
    inspectionRows: [
      ['Hole Diameter', 'Pin Gauge Inspection'],
      ['OD', 'Micrometer'],
      ['Thread', 'Thread Gauge Inspection'],
      ['Hardness', 'Hardness Inspection (HRC/HB)'],
      ['Gloss', 'Surface Gloss Inspection'],
      ['Position', 'CMM Inspection'],
      ['Flatness', 'Surface Plate & Height Gauge'],
    ],
    qualityLink: 'Learn More About Quality',
    latestTitle: 'Latest Insights',
    viewArticles: 'View All Articles',
    fallbackPosts: [
      ['How to Control Position Tolerance in CNC Machining', 'May 20, 2024'],
      ['Japanese Drawing vs ISO Drawing', 'May 10, 2024'],
      ['Maintaining +/-0.01 mm Grinding Tolerance', 'Apr 25, 2024'],
      ['How We Inspect Tight-Tolerance Parts', 'Apr 05, 2024'],
    ],
    cta: {
      title: 'Ready to Start Your Project?',
      body: 'Upload your drawing and get a quotation within 24 hours.',
      drop: 'Drop files here or click to upload',
      formats: 'PDF, STEP, IGES, DWG up to 50MB',
      contact: 'Contact Us',
    },
  },
  ja: {
    seo: {
      title: 'ホーム',
      description: '高精度CNC加工、旋盤、研削、二次加工まで、試作から量産まで品質を安定させる製造サポートを提供します。',
      keywords: '精密加工, CNC加工, 日本品質, 深セン製造',
    },
    hero: {
      title: 'カスタム部品の信頼できる加工パートナー\n日本品質。深センのスピード。',
      subtitle: '自動化・ロボット業界向けに、厳しい公差加工、全数検査、安定納期を提供します。',
      primary: '図面をアップロード',
      primarySub: '24時間以内に見積回答',
      secondary: '加工能力を見る',
    },
    featuresTitle: 'エンジニアリングチームに選ばれる理由',
    features: [
      ['1. 日本向け製造経験', '15年以上にわたり、日本の自動車・自動化・産業設備メーカー向け部品を供給。'],
      ['2. 高精度公差対応', '研削と精密加工により +/-0.01 mm レベルの寸法管理に対応。'],
      ['3. 試作・小ロット対応', '迅速な見積、短納期試作、柔軟な小ロット生産。'],
      ['4. ワンストップ製造', '材料調達、加工、熱処理、表面処理まで一括対応。'],
      ['5. 安定した品質と納期管理', '規律ある生産管理と進捗共有で安定した納品を支援。'],
      ['6. 顧客志向の技術サポート', '製造性改善により加工コスト低減を支援。'],
    ],
    industriesTitle: '対応業界',
    industries: [
      ['半導体\n装置', '/industries/semiconductor equipment.jpg', ['ウェハ搬送', '検査装置', '真空システム', '治具部品']],
      ['自動化・\nロボット', '/industries/automation & robotics.jpg', ['ロボット部品', 'エンドエフェクタ', 'モーション部品', '組立設備']],
      ['自動車\n設備', '/industries/automotive equipment.jpg', ['生産ライン部品', '治具・固定具', '検査設備', '精密部品']],
      ['食品加工\n設備', '/industries/food &packaging equipment.jpg', ['コンベヤ部品', '充填機部品', '切削部品', '衛生設備部品']],
      ['搬送・\nターンキー設備', '/industries/Handling and turnkey equipment.jpg', ['ピック&プレース', 'コンベヤ・搬送', '組立ステーション', '材料供給ユニット']],
      ['治具・\n固定具', '/industries/jigs&Fixtures.jpg', ['組立治具', '検査治具', '加工治具', '溶接治具']],
    ],
    capabilitiesTitle: '主要加工能力',
    capabilities: [
      ['CNCフライス', '/capabilities/cnc-miling.jpg', ['3/4/5軸加工', 'アルミ・鋼材', 'ステンレス・樹脂', '公差 +/-0.01 mm']],
      ['CNC旋盤', '/capabilities/cnc-turning.jpg', ['精密旋削', 'シャフト・ブッシュ・ピン', '同芯度管理', '公差 +/-0.01 mm']],
      ['平面研削', '/capabilities/Grinding.jpg', ['平面度管理', '平行度管理', '面粗度 Ra 0.2', '公差 +/-0.01 mm']],
      ['EDM・ワイヤーカット', '/capabilities/edm.jpg', ['複雑形状', '焼入れ材', '精密スロット', '高精度加工']],
      ['材料', '/capabilities/materials.jpg', ['アルミ・ステンレス', '炭素鋼・真鍮', '銅・チタン', 'エンジニアリング樹脂']],
      ['二次加工', '/capabilities/secondary-process.jpg', ['アルマイト・メッキ', '熱処理', 'レーザーマーキング', 'その他']],
    ],
    viewAllCapabilities: 'すべての加工能力を見る',
    qualityTitle: '各工程に組み込まれた品質管理',
    qualityItems: [
      ['高度な検査設備', 'CMM、高さゲージ、投影機、マイクロメータなどを使用。'],
      ['厳格な工程管理', '受入、工程内、最終検査により安定品質を確保。'],
      ['完全なトレーサビリティ', '材料証明、検査レポート、校正記録を提供可能。'],
    ],
    inspection: ['検査項目', '検査方法'],
    inspectionRows: [
      ['穴径', 'ピンゲージ検査'],
      ['外径', 'マイクロメータ'],
      ['ねじ', 'ねじゲージ検査'],
      ['硬度', '硬度検査 (HRC/HB)'],
      ['光沢', '表面光沢検査'],
      ['位置', 'CMM検査'],
      ['平面度', '定盤・高さゲージ'],
    ],
    qualityLink: '品質管理を見る',
    latestTitle: '最新記事',
    viewArticles: 'すべての記事を見る',
    fallbackPosts: [
      ['CNC加工における位置公差の管理方法', '2024年5月20日'],
      ['日本図面とISO図面の違い', '2024年5月10日'],
      ['+/-0.01 mm 研削公差を安定させる方法', '2024年4月25日'],
      ['高精度部品の検査方法', '2024年4月5日'],
    ],
    cta: {
      title: 'プロジェクトを始めませんか？',
      body: '図面をアップロードいただければ、通常24時間以内に見積回答します。',
      drop: 'ファイルを選択またはアップロード',
      formats: 'PDF, STEP, IGES, DWG 最大50MB',
      contact: 'お問い合わせ',
    },
  },
  zh: {
    seo: {
      title: '首页',
      description: '为高要求工业零件提供可靠的CNC加工、车削、研磨及一站式制造支持，帮助工程团队从样件到批量生产稳定控制品质。',
      keywords: '精密加工, CNC加工, 日本品质, 深圳制造',
    },
    hero: {
      title: '您可靠的定制零件加工伙伴\n日本品质。深圳速度。',
      subtitle: '为自动化和机器人行业提供严公差加工、全检和可靠交付。',
      primary: '上传图纸',
      primarySub: '24小时内获取报价',
      secondary: '查看加工能力',
    },
    featuresTitle: '为什么工程团队选择我们',
    features: [
      ['1. 日本客户制造经验', '15年服务日本汽车、自动化和工业设备制造客户。'],
      ['2. 严公差加工能力', '具备研磨和精密加工能力，可实现 +/-0.01 mm 尺寸控制。'],
      ['3. 快速样件和小批量支持', '快速报价、快速打样、灵活小批量生产。'],
      ['4. 一站式制造支持', '材料采购、机加工、热处理和表面处理协同支持。'],
      ['5. 稳定品质与交期控制', '规范生产管理，并主动同步项目进度。'],
      ['6. 客户导向工程支持', '通过工程优化帮助客户降低制造成本。'],
    ],
    industriesTitle: '服务行业',
    industries: [
      ['半导体\n设备', '/industries/semiconductor equipment.jpg', ['晶圆搬运', '检测设备', '真空系统', '治具部件']],
      ['自动化与\n机器人', '/industries/automation & robotics.jpg', ['机器人部件', '末端执行器', '运动系统', '组装设备']],
      ['汽车\n设备', '/industries/automotive equipment.jpg', ['产线零件', '工装夹具', '测试设备', '精密部件']],
      ['食品加工\n设备', '/industries/food &packaging equipment.jpg', ['输送部件', '灌装设备', '切割部件', '卫生设备']],
      ['搬运与\n整线设备', '/industries/Handling and turnkey equipment.jpg', ['Pick-and-Place系统', '输送与移载系统', '装配工站', '物料供给单元']],
      ['工装与\n夹具', '/industries/jigs&Fixtures.jpg', ['装配治具', '检测夹具', '加工夹具', '焊接治具']],
    ],
    capabilitiesTitle: '核心加工能力',
    capabilities: [
      ['CNC铣削', '/capabilities/cnc-miling.jpg', ['3/4/5轴铣削', '铝、钢材', '不锈钢、塑料', '公差 +/-0.01 mm']],
      ['CNC车削', '/capabilities/cnc-turning.jpg', ['精密车削', '轴、衬套、销', '同心度控制', '公差 +/-0.01 mm']],
      ['平面研磨', '/capabilities/Grinding.jpg', ['平面度控制', '平行度控制', '表面粗糙度 Ra 0.2', '公差 +/-0.01 mm']],
      ['EDM与线切割', '/capabilities/edm.jpg', ['复杂轮廓', '淬硬材料', '精密槽位', '高精度']],
      ['材料', '/capabilities/materials.jpg', ['铝、不锈钢', '碳钢、黄铜', '铜、钛', '工程塑料']],
      ['二次加工', '/capabilities/secondary-process.jpg', ['阳极、镀层', '热处理', '激光打标', '更多工艺']],
    ],
    viewAllCapabilities: '查看全部能力',
    qualityTitle: '品质贯穿每一个步骤',
    qualityItems: [
      ['先进检测设备', 'CMM、高度规、投影仪、千分尺等。'],
      ['严格过程控制', '来料、过程和最终检验确保品质稳定。'],
      ['完整追溯资料', '可提供材料证明、检验报告和校准记录。'],
    ],
    inspection: ['检测项目', '检测方法'],
    inspectionRows: [
      ['孔径', '针规检测'],
      ['外径', '千分尺'],
      ['螺纹', '螺纹规检测'],
      ['硬度', '硬度检测 (HRC/HB)'],
      ['光泽', '表面光泽检测'],
      ['位置', 'CMM检测'],
      ['平面度', '平台与高度规'],
    ],
    qualityLink: '了解品质管理',
    latestTitle: '最新文章',
    viewArticles: '查看全部文章',
    fallbackPosts: [
      ['如何控制CNC加工中的位置公差', '2024年5月20日'],
      ['日本图纸与ISO图纸差异', '2024年5月10日'],
      ['如何稳定 +/-0.01 mm 研磨公差', '2024年4月25日'],
      ['严公差零件如何检测', '2024年4月5日'],
    ],
    cta: {
      title: '准备开始您的项目？',
      body: '上传图纸，通常24小时内获取报价。',
      drop: '拖放文件或点击上传',
      formats: 'PDF, STEP, IGES, DWG 最大50MB',
      contact: '联系我们',
    },
  },
};

const fallbackImages = [
  'https://images.unsplash.com/photo-1537462715879-360eeb61a0ad?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1541888081691-10c0e815610e?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?q=80&w=2070&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1581092335397-9583eb92d232?q=80&w=2070&auto=format&fit=crop',
];

export default function Home() {
  const { locale, localizedPath } = useLocale();
  const copy = content[locale];
  const initialBlogData = useBlogInitialData();
  const initialPosts = useMemo(() => formatLatestPosts(initialBlogData.posts || [], locale), [initialBlogData.posts, locale]);
  const [latestPosts, setLatestPosts] = useState<any[]>(initialPosts);
  const [postsLoading, setPostsLoading] = useState(!initialBlogData.posts);

  useEffect(() => {
    const fetchLatestPosts = async () => {
      try {
        setPostsLoading(true);
        const response = await fetch(`/api/blog/posts?lang=${locale}`);
        if (response.ok) {
          const data = await response.json();
          setLatestPosts(formatLatestPosts(data, locale));
        }
      } catch (error) {
        console.error('Failed to fetch latest posts:', error);
      } finally {
        setPostsLoading(false);
      }
    };

    fetchLatestPosts();
  }, [locale]);

  return (
    <div className="bg-white">
      <SEO title={copy.seo.title} description={copy.seo.description} keywords={copy.seo.keywords} />

      <section className="relative overflow-hidden bg-slate-900 text-white pt-32 pb-24 lg:pt-40 lg:pb-32">
        <div className="absolute inset-0 opacity-100">
          <img src="/home-banner.jpg" alt="CNC Machining Banner" className="w-full h-full object-cover" />
        </div>
        <div className="absolute inset-0 bg-slate-900/70"></div>
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold leading-tight mb-6 text-white whitespace-pre-line">{copy.hero.title}</h1>
            <p className="text-lg md:text-xl text-slate-300 mb-10 leading-relaxed max-w-2xl">{copy.hero.subtitle}</p>

            <div className="flex flex-col sm:flex-row gap-4 mb-12">
              <Link to={localizedPath('/contact')} className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-sm transition-colors group">
                <UploadCloud className="mr-3 h-6 w-6" />
                <div className="text-left">
                  <div className="leading-snug text-base text-white">{copy.hero.primary}</div>
                  <div className="text-[10px] font-normal opacity-80 text-white">{copy.hero.primarySub}</div>
                </div>
              </Link>
              <Link to={localizedPath('/capabilities')} className="inline-flex items-center justify-center px-8 py-4 text-sm font-bold border border-slate-500 hover:border-white text-white rounded-sm transition-colors">
                {copy.hero.secondary}
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white border-b border-slate-100">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{copy.featuresTitle}</h2>
          </div>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-8 text-center">
            {copy.features.map(([title, desc]: string[], idx: number) => {
              const Icon = icons.features[idx];
              return (
                <div key={title} className="flex flex-col items-center">
                  <div className="w-16 h-16 rounded-full border-2 border-blue-100 bg-blue-50/50 flex items-center justify-center mb-6">
                    <Icon className="h-8 w-8 text-blue-700 stroke-[1.5]" />
                  </div>
                  <h3 className="font-bold text-slate-900 mb-3 text-sm leading-tight">{title}</h3>
                  <p className="text-xs text-slate-500 leading-relaxed px-2">{desc}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-b border-slate-200">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{copy.industriesTitle}</h2>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6">
            {copy.industries.map(([title, img, items]: [string, string, string[]], idx: number) => {
              const Icon = icons.industries[idx];
              return (
                <div key={title} className="bg-white border border-slate-200">
                  <div className="h-32 bg-slate-200 w-full overflow-hidden">
                    <img src={img} alt={title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-300" referrerPolicy="no-referrer" />
                  </div>
                  <div className="p-5">
                    <div className="flex items-center gap-3 mb-4 border-b border-slate-100 pb-4">
                      <Icon className="h-6 w-6 text-blue-700 shrink-0" />
                      <h3 className="font-bold text-sm text-slate-900 whitespace-pre-line leading-tight">{title}</h3>
                    </div>
                    <ul className="space-y-2">
                      {items.map((item) => (
                        <li key={item} className="text-xs text-slate-600 flex items-start gap-2">
                          <span className="text-blue-700 mt-0.5">-</span>
                          {item}
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-900 text-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-white">{copy.capabilitiesTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-6 gap-4 lg:gap-6">
            {copy.capabilities.map(([title, img, items]: [string, string, string[]]) => (
              <div key={title} className="border border-slate-800 flex flex-col text-center hover:bg-slate-800 transition-colors overflow-hidden group">
                <div className="h-32 w-full bg-slate-800 overflow-hidden">
                  <img src={img} alt={title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-80 group-hover:opacity-100" />
                </div>
                <div className="p-6 flex-1 flex flex-col">
                  <h3 className="font-bold border-b border-slate-700 pb-4 mb-4 text-sm whitespace-pre-line">{title}</h3>
                  <ul className="space-y-2 flex-1">
                    {items.map((item) => (
                      <li key={item} className="text-xs text-slate-400">{item}</li>
                    ))}
                  </ul>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link to={localizedPath('/capabilities')} className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-sm transition-colors shadow-sm">
              {copy.viewAllCapabilities}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{copy.qualityTitle}</h2>
          </div>
          <div className="grid lg:grid-cols-3 gap-12 items-center">
            <div className="space-y-10">
              {copy.qualityItems.map(([title, desc]: string[], idx: number) => {
                const Icon = icons.quality[idx];
                return (
                  <div key={title} className="flex gap-4">
                    <div className="shrink-0">
                      <div className="p-3 bg-white border border-slate-200 rounded-sm">
                        <Icon className="h-6 w-6 text-blue-700 stroke-[1.5]" />
                      </div>
                    </div>
                    <div>
                      <h3 className="font-bold text-slate-900 mb-2 text-sm">{title}</h3>
                      <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
            <div className="h-64 lg:h-[400px] w-full bg-slate-200 p-2 bg-white border border-slate-200 shadow-sm">
              <div className="w-full h-full bg-slate-100 overflow-hidden relative">
                <img src="/home/quality.jpg" alt="Quality Inspection" className="w-full h-full object-cover hover:scale-105 transition-transform duration-700" />
              </div>
            </div>
            <div>
              <div className="bg-white border border-slate-200 overflow-hidden text-sm shadow-sm">
                <table className="w-full text-left">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-4 py-3 font-bold text-slate-900 text-xs uppercase tracking-widest whitespace-nowrap">{copy.inspection[0]}</th>
                      <th className="px-4 py-3 font-bold text-slate-900 text-xs uppercase tracking-widest border-l border-slate-200">{copy.inspection[1]}</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {copy.inspectionRows.map((row: string[]) => (
                      <tr key={row[0]} className="hover:bg-slate-50 transition-colors">
                        <td className="px-4 py-3 text-slate-600 font-medium whitespace-nowrap">{row[0]}</td>
                        <td className="px-4 py-3 text-slate-500 border-l border-slate-200">{row[1]}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
          <div className="text-center mt-12">
            <Link to={localizedPath('/quality')} className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold bg-blue-700 hover:bg-blue-600 text-white rounded-sm transition-colors shadow-sm">
              {copy.qualityLink}
            </Link>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900">{copy.latestTitle}</h2>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {postsLoading ? (
              Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="bg-gray-200 h-48 rounded-sm mb-5 border border-slate-200"></div>
                  <div className="h-4 bg-gray-200 rounded w-full mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-2/3 mb-4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/3"></div>
                </div>
              ))
            ) : latestPosts.length > 0 ? (
              latestPosts.map((post) => (
                <Link to={post.slug ? localizedPath(`/blog/${post.slug}`) : localizedPath('/blog')} key={post.slug || post.title} className="group flex flex-col">
                  <PostCard post={post} />
                </Link>
              ))
            ) : (
              copy.fallbackPosts.map(([title, date]: string[], idx: number) => (
                <Link to={localizedPath('/blog')} key={title} className="group flex flex-col">
                  <PostCard post={{ img: fallbackImages[idx], title, date }} />
                </Link>
              ))
            )}
          </div>
          <div className="text-center mt-12">
            <Link to={localizedPath('/blog')} className="inline-flex items-center justify-center px-8 py-3 text-sm font-bold border border-slate-300 hover:border-slate-400 text-slate-700 rounded-sm transition-colors">
              {copy.viewArticles}
            </Link>
          </div>
        </div>
      </section>

      <section className="bg-blue-700 text-white py-12 border-b-4 border-blue-900">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 flex flex-col lg:flex-row items-center justify-between gap-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold mb-3">{copy.cta.title}</h2>
            <p className="text-blue-100 text-sm">{copy.cta.body}</p>
          </div>
          <div className="flex flex-col sm:flex-row items-center gap-4 w-full lg:w-auto">
            <Link to={localizedPath('/contact')} className="w-full sm:w-auto inline-flex items-center gap-4 border-2 border-dashed border-blue-400 hover:border-white bg-blue-800/40 hover:bg-blue-800 px-6 py-4 rounded-sm transition-colors">
              <UploadCloud className="h-8 w-8 text-blue-200 shrink-0" />
              <div className="text-left">
                <div className="text-sm font-bold text-white">{copy.cta.drop}</div>
                <div className="text-[10px] text-blue-200 uppercase tracking-widest mt-1">{copy.cta.formats}</div>
              </div>
            </Link>
            <Link to={localizedPath('/contact')} className="w-full sm:w-auto inline-flex items-center justify-center px-8 py-5 text-sm font-bold bg-white text-blue-700 hover:bg-slate-50 rounded-sm transition-colors shadow-sm">
              {copy.cta.contact}
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

function PostCard({ post }: { post: { img: string; title: string; date: string } }) {
  return (
    <>
      <div className="h-48 bg-slate-200 mb-5 overflow-hidden rounded-sm border border-slate-200">
        <img src={post.img} alt={post.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 grayscale opacity-90 group-hover:grayscale-0 group-hover:opacity-100" referrerPolicy="no-referrer" />
      </div>
      <h3 className="font-bold text-sm text-slate-900 mb-3 leading-relaxed group-hover:text-blue-700 transition-colors line-clamp-2">{post.title}</h3>
      <p className="text-[11px] text-slate-400 font-bold tracking-widest uppercase mt-auto">{post.date}</p>
    </>
  );
}

function formatLatestPosts(posts: BlogSummary[], locale: Locale) {
  return posts.slice(0, 4).map((post) => ({
    title: post.title,
    date: new Date(post.date).toLocaleDateString(locale === 'en' ? 'en-US' : locale === 'ja' ? 'ja-JP' : 'zh-CN', {
      month: 'short',
      day: '2-digit',
      year: 'numeric',
    }),
    img: post.img || '/home-banner.jpg',
    slug: post.slug,
  }));
}
