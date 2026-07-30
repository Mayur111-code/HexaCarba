import { Link } from 'react-router-dom';
import {
  HiOutlineCog, HiOutlineBeaker, HiOutlineClipboardCheck,
  HiOutlineLibrary, HiOutlineTrendingUp,
} from 'react-icons/hi';
import { HiOutlineWrenchScrewdriver } from 'react-icons/hi2';
import { HiOutlineArrowRight } from 'react-icons/hi';
import {
  FadeIn, BlurReveal, StaggerChildren, StaggerItem, TiltCard,
} from '../../components/animations/AnimatedComponents';

const services = [
  { icon: HiOutlineCog, title: 'Custom Equipment Design', desc: 'Tailor-made graphite and PTFE equipment designed to your exact process specifications and requirements.' },
  { icon: HiOutlineBeaker, title: 'Process Engineering', desc: 'Expert process analysis and optimization to maximize efficiency, yield, and product quality.' },
  { icon: HiOutlineWrenchScrewdriver, title: 'Installation & Commissioning', desc: 'Complete on-site installation, commissioning, and start-up assistance by experienced engineers.' },
  { icon: HiOutlineClipboardCheck, title: 'Equipment Audit', desc: 'Comprehensive inspection and audit of existing equipment to identify performance gaps.' },
  { icon: HiOutlineLibrary, title: 'After-Sales Support', desc: 'Dedicated after-sales service including maintenance, spare parts, and technical assistance.' },
  { icon: HiOutlineTrendingUp, title: 'Performance Optimization', desc: 'Data-driven analysis and modifications to enhance equipment performance and extend service life.' },
];

const ServicesPage = () => (
  <div className="overflow-x-hidden">
    <section className="relative min-h-[40vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_70%)]" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <BlurReveal><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-6">Our Services</div></BlurReveal>
        <BlurReveal delay={0.15}><h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Engineering <span className="gradient-text">Services</span></h1></BlurReveal>
        <FadeIn delay={0.3}><p className="text-xl text-gray-400 max-w-2xl">Comprehensive engineering services from design to after-sales support</p></FadeIn>
      </div>
    </section>

    <section className="py-24 bg-gradient-to-b from-black to-gray-950">
      <div className="max-w-7xl mx-auto px-6">
        <StaggerChildren className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((s) => (
            <StaggerItem key={s.title}>
              <TiltCard className="glass-hover p-8 group">
                <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center mb-5 group-hover:scale-110 group-hover:border-blue-500/40 transition-all duration-500">
                  <s.icon className="w-7 h-7 text-blue-400" />
                </div>
                <h3 className="font-semibold text-lg mb-2">{s.title}</h3>
                <p className="text-sm text-gray-400 leading-relaxed">{s.desc}</p>
              </TiltCard>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>

    <section className="py-24 relative overflow-hidden">
      <div className="absolute inset-0 bg-gradient-to-br from-blue-900/30 via-black to-cyan-900/20" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[600px] bg-blue-500/3 rounded-full blur-[150px]" />
      <FadeIn className="relative z-10 max-w-3xl mx-auto px-6 text-center">
        <div className="glass p-12 md:p-16">
          <h2 className="text-3xl md:text-5xl font-bold mb-4">Need a <span className="gradient-text">Custom Solution</span>?</h2>
          <p className="text-gray-400 mb-8 max-w-xl mx-auto">Our engineering team is ready to discuss your specific requirements.</p>
          <Link to="/contact" className="group inline-flex items-center gap-2 px-8 py-4 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-500 transition-all duration-300 hover:shadow-[0_0_40px_rgba(59,130,246,0.4)]">
            Get in Touch <HiOutlineArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>
      </FadeIn>
    </section>
  </div>
);

export default ServicesPage;
