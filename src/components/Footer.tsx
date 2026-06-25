import { Link } from 'react-router-dom';
import { Mail, Phone, ExternalLink, MapPin } from 'lucide-react';
import { useLocale, useSiteCopy } from '../i18n';

export default function Footer() {
  const { localizedPath } = useLocale();
  const copy = useSiteCopy();

  return (
    <footer className="bg-slate-900 text-slate-300">
      <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-6">
            <Link to={localizedPath('/')} className="flex items-center gap-2">
              <span className="font-extrabold italic text-blue-500 text-[28px] tracking-tighter pr-1">HY</span>
              <div className="flex flex-col justify-center border-l-2 border-slate-700 pl-3 leading-none">
                <span className="font-black text-[22px] text-white tracking-wide mb-1">HONGYUAN</span>
                <span className="font-bold text-[10px] text-slate-400 tracking-[0.25em]">PRECISION</span>
              </div>
            </Link>
            <p className="text-sm leading-relaxed text-slate-400">
              {copy.footer.intro}
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-white font-sans font-bold tracking-wider uppercase mb-6 text-sm">{copy.footer.quickLinks}</h3>
            <ul className="space-y-4">
              <li><Link to={localizedPath('/about')} className="text-sm hover:text-white transition-colors">{copy.nav.about}</Link></li>
              <li><Link to={localizedPath('/capabilities')} className="text-sm hover:text-white transition-colors">{copy.nav.capabilities}</Link></li>
              <li><Link to={localizedPath('/quality')} className="text-sm hover:text-white transition-colors">{copy.footer.qualityControl}</Link></li>
              <li><Link to={localizedPath('/blog')} className="text-sm hover:text-white transition-colors">{copy.footer.technicalBlog}</Link></li>
            </ul>
          </div>

          {/* Services */}
          <div>
            <h3 className="text-white font-sans font-bold tracking-wider uppercase mb-6 text-sm">{copy.footer.capabilities}</h3>
            <ul className="space-y-4">
              <li className="text-sm text-slate-400">CNC Milling</li>
              <li className="text-sm text-slate-400">CNC Turning</li>
              <li className="text-sm text-slate-400">Precision Grinding</li>
              <li className="text-sm text-slate-400">EDM & Wire Cut</li>
              <li className="text-sm text-slate-400">Surface Finishing</li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-sans font-bold tracking-wider uppercase mb-6 text-sm">{copy.footer.contact}</h3>
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <Mail className="h-5 w-5 text-slate-500 shrink-0" />
                <a href="mailto:lynn.lee@hongyuan-precision.com" className="text-sm hover:text-white transition-colors">lynn.lee@hongyuan-precision.com</a>
              </li>
              <li className="flex items-start gap-3">
                <Phone className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="text-sm">0086-755-23059684 (Tel)</span>
              </li>
              <li className="flex items-start gap-3">
                <MapPin className="h-5 w-5 text-slate-500 shrink-0" />
                <span className="text-sm">Shajing, Bao'an District<br/>Shenzhen City, China</span>
              </li>
              <li className="flex items-center gap-4 mt-6 pt-4 border-t border-slate-800">
                <a href="https://linkedin.com/in/lee-lynn-b173a075" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-sm">
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
                <a href="https://wa.me/8618926541701" target="_blank" rel="noreferrer" className="text-slate-500 hover:text-white transition-colors flex items-center gap-1 text-sm">
                  WhatsApp <ExternalLink className="h-3 w-3" />
                </a>
              </li>
            </ul>
          </div>
        </div>
        
        <div className="mt-16 pt-8 border-t border-slate-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-500 tracking-widest uppercase">
            &copy; {new Date().getFullYear()} HONGYUAN MACHINERY LIMITED. All Rights Reserved.
          </p>
          <div className="flex gap-4 items-center text-xs text-slate-300 uppercase tracking-widest">
            <div className="w-2 h-2 rounded-full bg-green-500"></div>
            <span>{copy.footer.productionOnline}</span>
          </div>
        </div>
      </div>
      
      {/* Industries Banner */}
      <div className="bg-slate-100 border-t border-slate-200 py-4">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-center gap-2 md:gap-8 text-center md:text-left">
          <div className="text-[11px] font-bold text-slate-400 uppercase tracking-widest">{copy.footer.industriesServed}</div>
          <div className="flex flex-wrap justify-center gap-4 md:gap-6 text-[11px] font-semibold text-slate-600">
            {copy.footer.industries.map((industry) => (
              <span key={industry}>{industry}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
