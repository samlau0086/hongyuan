import { Link } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { useState } from 'react';
import { cn } from '../lib/utils';
import { motion, AnimatePresence } from 'motion/react';
import { localeNames, locales, useLocale, useSiteCopy } from '../i18n';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const { barePath, localizedPath, switchPath, locale } = useLocale();
  const copy = useSiteCopy();
  const navLinks = [
    { name: copy.nav.home, path: '/' },
    { name: copy.nav.about, path: '/about' },
    { name: copy.nav.capabilities, path: '/capabilities' },
    { name: copy.nav.quality, path: '/quality' },
    { name: copy.nav.blog, path: '/blog' },
    { name: copy.nav.contact, path: '/contact' },
  ];

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className="sticky top-0 z-50 w-full border-b border-gray-200 bg-white/80 backdrop-blur-md">
      <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 lg:px-8">
        <div className="flex bg-transparent h-20 items-center justify-between">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center gap-2">
            <Link to={localizedPath('/')} className="flex items-center gap-2">
              <span className="font-extrabold italic text-blue-700 text-[28px] tracking-tighter pr-1">HY</span>
              <div className="flex flex-col justify-center border-l-2 border-slate-200 pl-3 leading-none">
                <span className="font-black text-[22px] text-slate-900 tracking-wide mb-1">HONGYUAN</span>
                <span className="font-bold text-[10px] text-slate-500 tracking-[0.25em]">PRECISION</span>
              </div>
            </Link>
          </div>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-4 lg:gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.path}
                to={localizedPath(link.path)}
                className={cn(
                  "text-sm font-medium transition-colors hover:text-accent relative py-2 whitespace-nowrap",
                  barePath === link.path ? "text-accent" : "text-gray-600"
                )}
              >
                {link.name}
                {barePath === link.path && (
                  <motion.div
                    layoutId="navbar-indicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-accent"
                    initial={false}
                  />
                )}
              </Link>
            ))}
          </nav>

          {/* Desktop CTA */}
          <div className="hidden md:block">
            <Link
              to={localizedPath('/contact')}
              className="bg-blue-700 text-white px-4 lg:px-6 py-2.5 text-xs lg:text-sm font-semibold rounded-sm shadow-sm hover:bg-blue-800 transition-colors whitespace-nowrap"
            >
              {copy.nav.cta}
            </Link>
          </div>

          <div className="hidden md:flex items-center gap-1 border-l border-gray-200 pl-4">
            {locales.map((item) => (
              <Link
                key={item}
                to={switchPath(item)}
                className={cn(
                  'px-2 py-1 text-xs font-semibold transition-colors',
                  item === locale ? 'text-blue-700' : 'text-gray-500 hover:text-gray-900',
                )}
                aria-label={localeNames[item]}
              >
                {item.toUpperCase()}
              </Link>
            ))}
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMenu}
              className="inline-flex items-center justify-center p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 focus:outline-none"
            >
              <span className="sr-only">{copy.nav.menu}</span>
              {isOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Nav */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="md:hidden border-b border-gray-200 bg-white"
          >
            <div className="px-4 pt-2 pb-6 space-y-1 sm:px-6">
              {navLinks.map((link) => (
                <Link
                  key={link.path}
                  to={localizedPath(link.path)}
                  onClick={() => setIsOpen(false)}
                  className={cn(
                    "block px-3 py-3 rounded-md text-base font-medium",
                    barePath === link.path
                      ? "bg-gray-50 text-accent"
                      : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                  )}
                >
                  {link.name}
                </Link>
              ))}
              <div className="mt-6">
                <Link
                  to={localizedPath('/contact')}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center w-full px-6 py-3 text-base font-semibold text-white transition-colors bg-primary-900 hover:bg-primary-800"
                >
                  {copy.nav.mobileCta}
                </Link>
              </div>
              <div className="flex items-center gap-2 px-3 pt-3">
                {locales.map((item) => (
                  <Link
                    key={item}
                    to={switchPath(item)}
                    onClick={() => setIsOpen(false)}
                    className={cn(
                      'px-2 py-1 text-xs font-semibold',
                      item === locale ? 'bg-blue-50 text-blue-700' : 'text-gray-500',
                    )}
                  >
                    {localeNames[item]}
                  </Link>
                ))}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
