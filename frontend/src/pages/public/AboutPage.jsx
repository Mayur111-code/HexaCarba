import { useRef } from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { Link } from 'react-router-dom';
import {
  HiOutlineBadgeCheck, HiOutlineLightBulb, HiOutlineUsers, HiOutlineGlobe,
  HiOutlinePlay, HiOutlineArrowRight, HiOutlineStar, HiOutlineShieldCheck,
  HiOutlineCube, HiOutlineSupport, HiOutlineSparkles, HiOutlineFlag, HiOutlineEye,
} from 'react-icons/hi';
import {
  FadeIn, SlideInLeft, SlideInRight, BlurReveal, StaggerChildren, StaggerItem,
  FloatingElement, TiltCard,
} from '../../components/animations/AnimatedComponents';
import ContentImage from '../../components/common/ContentImage';
import { about as aboutContent } from '../../data/siteContent';

const whyUs = [
  { icon: HiOutlineBadgeCheck, title: 'High Quality', desc: 'ISO-certified manufacturing with rigorous quality checks at every stage.' },
  { icon: HiOutlineUsers, title: 'Expert Team', desc: '15+ years of domain expertise in graphite and corrosion engineering.' },
  { icon: HiOutlineStar, title: 'Trusted Clients', desc: '200+ satisfied clients across pharmaceutical and chemical industries.' },
  { icon: HiOutlineCube, title: 'Advanced Mfg', desc: 'State-of-the-art facility with precision CNC and testing equipment.' },
  { icon: HiOutlineGlobe, title: 'Global Standards', desc: 'Products designed to ASME, TEMA, and international standards.' },
  { icon: HiOutlineSupport, title: 'Fast Support', desc: 'Dedicated after-sales team providing rapid technical assistance.' },
];

const processSteps = [
  { icon: HiOutlineLightBulb, title: 'Engineering', desc: 'Design & analysis of custom solutions' },
  { icon: HiOutlineCube, title: 'Manufacturing', desc: 'Precision fabrication with quality control' },
  { icon: HiOutlineShieldCheck, title: 'Inspection', desc: 'Rigorous testing & certification' },
  { icon: HiOutlineSparkles, title: 'Delivery', desc: 'Safe packaging & on-time dispatch' },
];

const pillars = [
  { icon: HiOutlineFlag, ...aboutContent.commitment },
  { icon: HiOutlineLightBulb, ...aboutContent.mission },
  { icon: HiOutlineEye, ...aboutContent.vision },
];

const AboutPage = () => {
  const videoRef = useRef(null);
  const { scrollYProgress } = useScroll({ target: videoRef, offset: ['start end', 'end start'] });
  const videoScale = useTransform(scrollYProgress, [0, 1], [0.85, 1.1]);

  return (
    <div className="overflow-x-hidden">
      {/* Hero */}
      <section className="relative min-h-[60vh] flex items-center overflow-hidden">
        <div className="absolute inset-0">
          <ContentImage
            src={aboutContent.intro.image}
            alt="About Hexacarb"
            className="w-full h-full object-cover"
            fallbackLabel="About Hero"
          />
          <div className="absolute inset-0 bg-black/75" />
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>

        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
          <BlurReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-6">
              {aboutContent.hero.badge}
            </div>
          </BlurReveal>
          <BlurReveal delay={0.15}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6 uppercase">
              {aboutContent.hero.title}
            </h1>
          </BlurReveal>
          <FadeIn delay={0.3}>
            <p className="text-lg text-blue-300/80 italic max-w-2xl mb-4">{aboutContent.hero.quote}</p>
            <p className="text-xl text-gray-300 max-w-2xl leading-relaxed">{aboutContent.hero.description}</p>
          </FadeIn>
        </div>
      </section>

      {/* Introduction */}
      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideInLeft>
              <h2 className="text-3xl md:text-4xl font-bold mb-6 leading-tight">
                {aboutContent.intro.title}
              </h2>
              <div className="space-y-4 text-gray-400 leading-relaxed">
                {aboutContent.intro.paragraphs.map((p) => (
                  <p key={p.slice(0, 40)}>{p}</p>
                ))}
              </div>
            </SlideInLeft>

            <SlideInRight>
              <div className="relative">
                <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
                <div className="relative glass p-1 rounded-2xl overflow-hidden">
                  <ContentImage
                    src={aboutContent.intro.image}
                    alt={aboutContent.intro.title}
                    className="w-full aspect-[4/3] object-cover rounded-xl"
                    fallbackLabel="About Intro"
                  />
                </div>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Mission / Vision / Commitment */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {pillars.map((item, i) => (
              <FadeIn key={item.title} delay={i * 0.1}>
                <TiltCard className="glass-hover p-8 h-full">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center mb-4">
                    <item.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 uppercase tracking-wide">{item.title}</h3>
                  <p className="text-sm text-gray-400 leading-relaxed">{item.text}</p>
                </TiltCard>
              </FadeIn>
            ))}
          </div>

          <FadeIn delay={0.4} className="mt-12">
            <div className="glass p-8 md:p-10 text-center max-w-4xl mx-auto">
              <h3 className="text-2xl font-bold gradient-text mb-4">{aboutContent.quality.title}</h3>
              <p className="text-gray-400 leading-relaxed">{aboutContent.quality.text}</p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Video Section */}
      <section ref={videoRef} className="py-24 bg-black">
        <div className="max-w-5xl mx-auto px-6">
          <FadeIn className="text-center mb-12">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              {aboutContent.facility.title.split(' ').slice(0, 2).join(' ')}{' '}
              <span className="gradient-text">{aboutContent.facility.title.split(' ').slice(2).join(' ')}</span>
            </h2>
          </FadeIn>

          <motion.div style={{ scale: videoScale }} className="relative group">
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-500/20 to-cyan-500/20 rounded-2xl blur-lg" />
            <div className="relative glass overflow-hidden rounded-2xl aspect-video">
              <ContentImage
                src={aboutContent.facility.videoPoster}
                alt={aboutContent.facility.caption}
                className="absolute inset-0 w-full h-full object-cover"
                fallbackLabel="Video Poster"
              />
              <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                <div className="w-20 h-20 rounded-full bg-blue-600 flex items-center justify-center shadow-[0_0_40px_rgba(59,130,246,0.5)]">
                  <HiOutlinePlay className="w-8 h-8 text-white ml-1" />
                </div>
              </div>
              <p className="absolute bottom-6 left-1/2 -translate-x-1/2 text-sm text-gray-200 font-medium bg-black/40 px-4 py-1.5 rounded-full backdrop-blur-md">
                {aboutContent.facility.caption}
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Director Section */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <SlideInLeft>
              <div className="relative">
                <FloatingElement amplitude={8} duration={4}>
                  <div className="absolute -inset-4 bg-gradient-to-br from-blue-500/10 to-cyan-500/10 rounded-3xl blur-xl" />
                </FloatingElement>
                <div className="relative glass p-1 rounded-2xl overflow-hidden">
                  <ContentImage
                    src={aboutContent.director.image}
                    alt={aboutContent.director.name}
                    className="w-full aspect-[3/4] object-cover rounded-xl"
                    fallbackLabel="Director Photo"
                  />
                </div>
              </div>
            </SlideInLeft>

            <SlideInRight>
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-4">
                Director&apos;s Message
              </div>
              <h2 className="text-3xl md:text-4xl font-bold mb-2">
                {aboutContent.director.name}
              </h2>
              <p className="text-lg text-blue-400 font-medium mb-6">{aboutContent.director.title}</p>

              <div className="glass p-8 space-y-4 text-gray-400 leading-relaxed">
                {aboutContent.director.message.map((p) => (
                  <p key={p.slice(0, 50)}>{p}</p>
                ))}
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>

      {/* Timeline */}
      <section className="py-24 bg-black">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Our <span className="gradient-text">Journey</span>
            </h2>
          </FadeIn>

          <div className="relative">
            <div className="absolute left-[19px] top-0 bottom-0 w-px bg-gradient-to-b from-blue-500/50 via-cyan-500/30 to-transparent" />
            <div className="space-y-12">
              {aboutContent.timeline.map((item, i) => (
                <FadeIn key={item.year} delay={i * 0.1}>
                  <div className="flex gap-6">
                    <div className="relative z-10 w-10 h-10 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center flex-shrink-0 shadow-lg shadow-blue-500/25">
                      <div className="w-2.5 h-2.5 rounded-full bg-white" />
                    </div>
                    <div className="glass-hover p-6 flex-1">
                      <span className="text-sm text-blue-400 font-mono">{item.year}</span>
                      <h3 className="text-xl font-bold mt-1 mb-2">{item.title}</h3>
                      <p className="text-gray-400 text-sm">{item.desc}</p>
                    </div>
                  </div>
                </FadeIn>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Why Choose Us */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              What Sets Us <span className="gradient-text">Apart</span>
            </h2>
          </FadeIn>

          <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {whyUs.map((item) => (
              <StaggerItem key={item.title}>
                <TiltCard className="glass-hover p-8 text-center group">
                  <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mb-5 group-hover:scale-110 transition-all duration-500">
                    <item.icon className="w-7 h-7 text-blue-400" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{item.title}</h3>
                  <p className="text-sm text-gray-400">{item.desc}</p>
                </TiltCard>
              </StaggerItem>
            ))}
          </StaggerChildren>
        </div>
      </section>

      {/* Certifications */}
      <section className="py-24 bg-black">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Quality <span className="gradient-text">Assured</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {aboutContent.certificates.map((cert, i) => (
              <FadeIn key={cert} delay={i * 0.1}>
                <div className="glass-hover p-4 overflow-hidden">
                  <ContentImage
                    src={cert}
                    alt={`Certificate ${i + 1}`}
                    className="w-full aspect-[3/2] object-cover rounded-lg"
                    fallbackLabel={`Certificate ${i + 1}`}
                  />
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* Manufacturing Process */}
      <section className="py-24 bg-gray-950">
        <div className="max-w-4xl mx-auto px-6">
          <FadeIn className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold">
              Manufacturing <span className="gradient-text">Process</span>
            </h2>
          </FadeIn>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {processSteps.map((step, i) => (
              <FadeIn key={step.title} delay={i * 0.15}>
                <div className="glass-hover p-6 text-center relative">
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-gradient-to-br from-blue-600 to-cyan-500 flex items-center justify-center text-sm font-bold">
                    {i + 1}
                  </div>
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center mx-auto mt-3 mb-3">
                    <step.icon className="w-6 h-6 text-blue-400" />
                  </div>
                  <h3 className="font-semibold mb-1">{step.title}</h3>
                  <p className="text-xs text-gray-400">{step.desc}</p>
                </div>
              </FadeIn>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black to-cyan-900/20" />
        <FadeIn className="relative z-10 max-w-3xl mx-auto px-6 text-center">
          <div className="glass p-12 md:p-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4">
              Let&apos;s Build Something <span className="gradient-text">Great</span> Together
            </h2>
            <p className="text-gray-400 mb-8 max-w-xl mx-auto">
              Partner with us for world-class graphite and corrosion-resistant process equipment.
            </p>
            <Link
              to="/contact"
              className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]"
            >
              Get In Touch
              <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        </FadeIn>
      </section>
    </div>
  );
};

export default AboutPage;
