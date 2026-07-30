import { Link } from 'react-router-dom';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef } from 'react';
import { HiOutlineArrowRight } from 'react-icons/hi';
import {
  FadeIn,
  StaggerChildren,
  StaggerItem,
  BlurReveal,
  TiltCard,
} from '../../components/animations/AnimatedComponents';
import ContentImage from '../../components/common/ContentImage';
import { hero, stats, features, highlights, clients, industries } from '../../data/siteContent';

const HomePage = () => {
  const heroRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] });
  const heroY = useTransform(scrollYProgress, [0, 1], ['0%', '30%']);
  const heroOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section ref={heroRef} className="relative min-h-screen flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ContentImage
            src={hero.backgroundImage}
            alt="Hexacarb industrial facility"
            className="w-full h-full object-cover"
            fallbackLabel="Hero Background"
          />
          <div className="absolute inset-0 bg-black/70" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(59,130,246,0.15),transparent_50%)]" />
        </div>

        <div className="absolute inset-0 opacity-[0.03]" style={{
          backgroundImage: 'linear-gradient(rgba(255,255,255,0.1) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.1) 1px, transparent 1px)',
          backgroundSize: '60px 60px',
        }} />

        <motion.div style={{ y: heroY, opacity: heroOpacity }} className="relative z-10 w-full">
          <div className="max-w-7xl mx-auto px-6 py-20 lg:py-32">
            <div className="max-w-4xl">
              <BlurReveal>
                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-8">
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  {hero.badge}
                </div>
              </BlurReveal>

              <BlurReveal delay={0.2}>
                <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[1.05] tracking-tight mb-4 uppercase">
                  {hero.title}
                </h1>
              </BlurReveal>

              <BlurReveal delay={0.35}>
                <p className="text-xl md:text-2xl text-blue-300/90 font-medium mb-6 capitalize">
                  {hero.subtitle}
                </p>
              </BlurReveal>

              <FadeIn delay={0.5}>
                <p className="text-lg text-gray-300 max-w-2xl leading-relaxed mb-4">
                  {hero.description}
                </p>
                <p className="text-base text-gray-400 max-w-2xl leading-relaxed mb-10">
                  {hero.extendedDescription}
                </p>
              </FadeIn>

              <FadeIn delay={0.7}>
                <div className="flex flex-wrap gap-4">
                  <Link
                    to={hero.ctaPrimary.to}
                    className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
                  >
                    {hero.ctaPrimary.label}
                    <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    to={hero.ctaSecondary.to}
                    className="inline-flex items-center gap-2 px-8 py-4 border border-white/20 text-white rounded-xl font-semibold hover:bg-white/10 hover:border-white/30 transition-all duration-300"
                  >
                    {hero.ctaSecondary.label}
                  </Link>
                </div>
              </FadeIn>
            </div>
          </div>
        </motion.div>

        {/* Stats */}
        <div className="absolute bottom-0 left-0 right-0 z-10">
          <div className="max-w-7xl mx-auto px-6 pb-12">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {stats.map((stat, i) => (
                <FadeIn key={stat.label} delay={0.8 + i * 0.1}>
                  <div className="glass-hover p-6 text-center">
                    <div className="text-3xl font-bold gradient-text mb-1">{stat.value}</div>
                    <div className="text-sm text-gray-400">{stat.label}</div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Features with images — matches original site icons */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-bold mb-4 capitalize">
              {hero.subtitle}
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {features.map((f, i) => (
              <FadeIn key={f.title} delay={i * 0.1}>
                <TiltCard className="glass-hover overflow-hidden group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <ContentImage
                      src={f.image}
                      alt={f.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackLabel={f.title}
                    />
                  </div>
                  <div className="p-6 text-center">
                    <h3 className="font-semibold text-lg text-white mb-2">{f.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed">{f.description}</p>
                  </div>
                </TiltCard>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Events / Projects / Blog — from original homepage */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {highlights.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.15}>
                <div className="glass-hover overflow-hidden h-full flex flex-col group">
                  <div className="aspect-[16/10] overflow-hidden relative">
                    <ContentImage
                      src={item.image}
                      alt={item.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      fallbackLabel={item.title}
                    />
                    <span className="absolute top-4 left-4 px-3 py-1 rounded-full bg-blue-600/90 text-xs font-semibold uppercase tracking-wide">
                      {item.category}
                    </span>
                  </div>
                  <div className="p-6 flex flex-col flex-1">
                    <h3 className="font-bold text-xl text-white mb-2">{item.title}</h3>
                    <p className="text-sm text-gray-400 leading-relaxed flex-1">{item.description}</p>
                    <Link
                      to={item.link}
                      className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-blue-400 hover:text-blue-300 transition-colors"
                    >
                      {item.linkLabel}
                      <HiOutlineArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Industries */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-cyan-400 mb-4">
              Industries We Serve
            </div>
            <h2 className="text-4xl md:text-5xl font-bold mb-4">
              Trusted Across <span className="gradient-text">Industries</span>
            </h2>
          </FadeIn>

          <StaggerChildren stagger={0.05} className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {industries.map((ind) => (
              <StaggerItem key={ind}>
                <div className="glass-hover py-5 px-4 text-center text-sm font-medium text-gray-300 hover:text-white transition-colors rounded-xl">
                  {ind}
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Our Clients — from original site */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold uppercase tracking-wide mb-3">
              {clients.title}
            </h2>
            <p className="text-gray-400 max-w-2xl mx-auto">{clients.subtitle}</p>
          </FadeIn>

          <StaggerChildren stagger={0.05} className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-4">
            {clients.logos.map((logo, i) => (
              <StaggerItem key={logo}>
                <div className="glass-hover p-4 h-20 flex items-center justify-center">
                  <ContentImage
                    src={logo}
                    alt={`Client ${i + 1}`}
                    className="max-h-12 max-w-full object-contain opacity-70 hover:opacity-100 transition-opacity"
                    fallbackLabel={`Client ${i + 1}`}
                  />
                </div>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black to-cyan-900/20" />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/5 rounded-full blur-[150px]" />

        <FadeIn className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="glass p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Ready to discuss your{' '}
              <span className="gradient-text">requirements?</span>
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Get in touch with our engineering team for customized corrosion-resistant solutions.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            >
              Contact Us
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default HomePage;
