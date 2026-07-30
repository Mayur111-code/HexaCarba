import { HiOutlineDocumentText, HiOutlineDownload } from 'react-icons/hi';
import { FadeIn, BlurReveal, StaggerChildren, StaggerItem } from '../../components/animations/AnimatedComponents';

const downloads = [
  { name: 'Company Profile', desc: 'Complete company overview and capabilities', type: 'PDF' },
  { name: 'Heat Exchanger Brochure', desc: 'Graphite heat exchanger range and specifications', type: 'PDF' },
  { name: 'Graphite Equipment Catalog', desc: 'Full product catalog with technical details', type: 'PDF' },
  { name: 'Installation Guide', desc: 'Equipment installation and maintenance manual', type: 'PDF' },
];

const DownloadsPage = () => (
  <div className="overflow-x-hidden">
    <section className="relative min-h-[40vh] flex items-center overflow-hidden">
      <div className="absolute inset-0 bg-black">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_70%)]" />
      </div>
      <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
        <BlurReveal><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-6">Resources</div></BlurReveal>
        <BlurReveal delay={0.15}><h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6"><span className="gradient-text">Downloads</span></h1></BlurReveal>
        <FadeIn delay={0.3}><p className="text-xl text-gray-400 max-w-2xl">Access product brochures, technical documents, and company literature</p></FadeIn>
      </div>
    </section>

    <section className="py-24 bg-gradient-to-b from-black to-gray-950 min-h-[50vh]">
      <div className="max-w-4xl mx-auto px-6">
        <StaggerChildren className="space-y-3">
          {downloads.map((dl) => (
            <StaggerItem key={dl.name}>
              <div className="glass-hover p-5 flex items-center justify-between group">
                <div className="flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center group-hover:scale-110 transition-transform">
                    <HiOutlineDocumentText className="w-5 h-5 text-red-400" />
                  </div>
                  <div>
                    <h3 className="font-medium">{dl.name}</h3>
                    <p className="text-sm text-gray-500">{dl.desc}</p>
                  </div>
                </div>
                <button className="flex items-center gap-2 px-5 py-2.5 text-sm font-medium text-blue-400 border border-blue-500/20 rounded-xl hover:bg-blue-500/10 hover:border-blue-500/40 transition-all">
                  <HiOutlineDownload className="w-4 h-4" /> {dl.type}
                </button>
              </div>
            </StaggerItem>
          ))}
        </StaggerChildren>
      </div>
    </section>
  </div>
);

export default DownloadsPage;
