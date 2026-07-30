import { useState, useEffect } from 'react';
import { Link, Outlet, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { HiOutlineMenu, HiOutlineX, HiOutlinePhone, HiOutlineMail } from 'react-icons/hi';
import ScrollProgress from '../components/animations/ScrollProgress';
import ContentImage from '../components/common/ContentImage';
import { company } from '../data/siteContent';
import { images } from '../data/images';

const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About' },
  { to: '/products', label: 'Products' },
  { to: '/services', label: 'Services' },
  { to: '/downloads', label: 'Downloads' },
  { to: '/contact', label: 'Contact' },
];

const PublicLayout = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => { setMenuOpen(false); }, [location]);

  return (
    <div className="min-h-screen flex flex-col bg-black">
      <ScrollProgress />

      {/* Top bar */}
      <div className="bg-white/5 border-b border-white/5 text-xs text-gray-400 py-1.5">
        <div className="max-w-7xl mx-auto px-6 flex justify-between items-center">
          <div className="flex items-center gap-6">
            <span className="flex items-center gap-1.5"><HiOutlinePhone className="w-3.5 h-3.5 text-blue-400" /> {company.phone}</span>
            <span className="hidden sm:flex items-center gap-1.5"><HiOutlineMail className="w-3.5 h-3.5 text-blue-400" /> {company.email}</span>
          </div>
          <Link to="/admin/login" className="text-gray-500 hover:text-blue-400 transition-colors">Admin</Link>
        </div>
      </div>

      {/* Header */}
      <motion.header
        className={`sticky top-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-black/80 backdrop-blur-xl border-b border-white/10' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="flex items-center gap-3 group">
              <ContentImage
                src={images.logo}
                alt={company.name}
                className="h-10 w-auto max-w-[120px] object-contain"
                fallbackLabel={company.name}
              />
              <div className="hidden sm:block">
                <div className="font-bold text-base leading-tight text-white">{company.name}</div>
                <div className="text-[10px] text-gray-500 leading-tight tracking-wide uppercase">Engineers Pvt Ltd</div>
              </div>
            </Link>

            <nav className="hidden lg:flex items-center gap-1">
              {navLinks.map((link) => {
                const isActive = location.pathname === link.to || (link.to !== '/' && location.pathname.startsWith(link.to));
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`relative px-3 py-2 text-sm font-medium rounded-lg transition-all duration-300 ${
                      isActive ? 'text-white' : 'text-gray-400 hover:text-white'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <motion.div layoutId="nav-active" className="absolute inset-0 bg-white/10 rounded-lg" transition={{ type: 'spring', stiffness: 300, damping: 30 }} />
                    )}
                  </Link>
                );
              })}
            </nav>

            <button className="lg:hidden p-2 text-gray-400 hover:text-white" onClick={() => setMenuOpen(!menuOpen)}>
              {menuOpen ? <HiOutlineX className="w-6 h-6" /> : <HiOutlineMenu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="lg:hidden border-t border-white/10 bg-black/95 backdrop-blur-xl overflow-hidden"
            >
              <div className="max-w-7xl mx-auto px-6 py-4 space-y-1">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.to}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                  >
                    <Link
                      to={link.to}
                      className={`block px-4 py-2.5 rounded-lg text-sm font-medium transition-colors ${location.pathname === link.to ? 'bg-white/10 text-white' : 'text-gray-400 hover:text-white hover:bg-white/5'}`}
                    >
                      {link.label}
                    </Link>
                  </motion.div>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>

      <main className="flex-1">
        <Outlet />
      </main>

      {/* Footer */}
      <footer className="bg-gradient-to-b from-black to-gray-950 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <ContentImage
                  src={images.logo}
                  alt={company.name}
                  className="h-10 w-auto max-w-[120px] object-contain"
                  fallbackLabel={company.name}
                />
                <div>
                  <div className="font-bold text-white">{company.name}</div>
                  <div className="text-[10px] text-gray-500 uppercase">Engineers Pvt Ltd</div>
                </div>
              </div>
              <p className="text-sm text-gray-500 leading-relaxed">
                {company.tagline}. Your trusted partner for corrosion-resistant graphite equipment,
                heat exchangers, columns, reactors, and PTFE products — serving pharmaceutical,
                chemical, and dye industries for {company.experienceYears} years.
              </p>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Quick Links</h4>
              <div className="space-y-1.5 text-sm">
                {navLinks.map((link) => (
                  <Link key={link.to} to={link.to} className="block text-gray-500 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
            <div>
              <h4 className="text-white font-semibold mb-4">Contact</h4>
              <div className="text-sm text-gray-500 space-y-2">
                <p>📍 {company.address}</p>
                <p>📞 {company.phone}</p>
                <p>📧 {company.email}</p>
              </div>
            </div>
          </div>
          <div className="border-t border-white/5 mt-12 pt-8 text-center text-sm text-gray-600">
            &copy; {new Date().getFullYear()} {company.legalName}. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  );
};

export default PublicLayout;
