import { images } from './images';

export const company = {
  name: 'HEXACARB',
  legalName: 'Hexacarb Engineers Pvt Ltd',
  tagline: 'Corrosion-Resistant Solutions',
  foundedYear: 2005,
  experienceYears: '15+',
  email: 'info@hexacarb.com',
  phone: '+91-XXXXXXXXXX',
  address: 'Maharashtra, India',
  director: {
    name: 'Mr. Milind Sonawane',
    title: 'Founder & Managing Director',
  },
};

export const hero = {
  badge: 'Corrosion-Resistant Solutions',
  title: 'Engineered Solutions to Meet Your Demands',
  subtitle: 'Ensuring Energy Efficiency and Manage Resources',
  description:
    'Hexacarb Engineers Pvt Ltd helps customers build and sustain highly efficient plants by reducing waste, optimising process and energy efficiency, and complying with regulatory requirements. We work closely with businesses to build practical, long-term solutions to make their manufacturing practices more sustainable and environmentally responsible.',
  extendedDescription:
    'Our customers believe strongly in our technical capabilities through constant innovation and zeal in product optimization. Our process expertise comes useful in vast study fields such as pharmaceuticals, biotechnology, organics chemistry, dye industry and many more. Hexacarb brings orthodox yet innovative solutions with its 15+ years of experience in graphite heat exchangers.',
  backgroundImage: images.hero.background,
  ctaPrimary: { label: 'View Products', to: '/products' },
  ctaSecondary: { label: 'Contact Us', to: '/contact' },
};

export const stats = [
  { value: '15+', label: 'Years Experience' },
  { value: '200+', label: 'Clients in India' },
  { value: '500+', label: 'Projects Delivered' },
  { value: '50+', label: 'Product Types' },
];

export const features = [
  {
    title: 'Energy Efficiency',
    description: 'Optimise energy consumption and reduce operational costs across your plant.',
    image: images.features.energyEfficiency,
  },
  {
    title: 'Improved Process Uptime',
    description: 'Reliable graphite equipment ensuring maximum plant availability and continuity.',
    image: images.features.processUptime,
  },
  {
    title: 'Better Productivity',
    description: 'High-performance corrosion-resistant products that enhance manufacturing output.',
    image: images.features.productivity,
  },
  {
    title: 'Safety & Statutory Compliance',
    description: 'Equipment meeting stringent safety standards and regulatory requirements.',
    image: images.features.safetyCompliance,
  },
];

export const highlights = [
  {
    category: 'Events',
    title: 'Visit our Booth F-8',
    description: "Visit our stall at ChemTech World Expo 2024 from 4th–7th March'24",
    image: images.events.chemtechExpo,
    link: '/contact',
    linkLabel: 'View More',
  },
  {
    category: 'Projects',
    title: 'Acid Concentration System',
    description: 'Design and supplied two stage sulfuric acid concentration system for a dye manufacturing co.',
    image: images.projects.acidConcentration,
    link: '/products',
    linkLabel: 'View More',
  },
  {
    category: 'Blog',
    title: 'Water Jet System',
    description: 'Design of Water jet system with graphite cooler for scrubbing HCL vapors',
    image: images.blog.waterJetSystem,
    link: '/services',
    linkLabel: 'View More',
  },
];

export const clients = {
  title: 'Our Clients',
  subtitle: 'Trusted by leading pharmaceutical, chemical, and dye manufacturers across India',
  logos: images.clients,
};

export const industries = [
  'Pharmaceuticals',
  'Biotechnology',
  'Organics Chemistry',
  'Dye Industry',
  'Agrochemicals',
  'Petrochemicals',
  'Oil & Gas',
  'Metal Processing',
];

export const about = {
  hero: {
    badge: 'About Us',
    title: 'About Hexacarb',
    quote: '"It is from failure that most growth comes." — Dee Hock',
    description:
      'At Hexacarb, the drive for constant growth and innovation has been relentless. Looking back, the company started in 2005 with a vision to make itself a brand known for quality and reliability.',
  },
  intro: {
    title: "India's Trusted Graphite Equipment Manufacturer",
    paragraphs: [
      'The journey for Hexacarb had all the ups and downs but kept the team together working towards its focus. Today, we stand a reputed name in the field of chemical process equipment with a 200+ customers base in India.',
      'Hexacarb Engineers Pvt Ltd is a leading manufacturer and supplier of graphite process equipment, specializing in corrosion-resistant solutions for the chemical, pharmaceutical, and allied industries.',
      'With over 15 years of industry experience, we have established ourselves as a trusted partner for businesses seeking high-performance graphite heat exchangers, columns, reactors, PTFE-lined equipment, and custom process solutions.',
    ],
    image: images.about.intro,
  },
  commitment: {
    title: 'Commitment',
    text: 'To provide customized equipments achieving desired quality, traceability of material with timely deliverables ensuring your timely and efficient on-site project completion at modest cost.',
  },
  mission: {
    title: 'Mission',
    text: 'Committed to design & manufacture graphite equipment for Pharma, Chemical, Oil & Gas industry adhering to stringent quality standards & traceability of material.',
  },
  vision: {
    title: 'Vision',
    text: 'Aim to be the domestic leader in design & manufacturing of impervious Graphite Heat Exchanger with world class manufacturing setup by 2025.',
  },
  quality: {
    title: 'Our Priority — Quality',
    text: 'Operational Safety and ensuring critical quality parameters is given utmost priority at Hexacarb. Key Criteria Fulfillment points are followed which unifies complex processes running simultaneously reducing lead time and maintaining consistent records.',
  },
  director: {
    name: company.director.name,
    title: company.director.title,
    image: images.about.director,
    message: [
      'In 2005, I started out with Hexacarb Engineers as my first entrepreneurial hustle. Over the years, we have built a strong brand in the Corrosion-resistant equipment field and strengthened our core values and areas of expertise.',
      'I firmly believe that our products will be recognized globally as a mark of Quality & Reliability. Hexacarb will continue expanding in its graphite heat exchanger business along with new ventures in Metal Alloy pressure vessels, fluoropolymer solutions and Chemicals.',
      'Hexacarb is set on path to achieve numerous milestones in coming years...',
    ],
  },
  facility: {
    title: 'See Our Facility',
    videoPoster: images.about.videoPoster,
    videoSrc: '/assets/videos/company-video.mp4',
    caption: 'Manufacturing Facility Tour',
  },
  timeline: [
    { year: '2005', title: 'Company Founded', desc: 'Hexacarb Engineers established with a vision for quality and reliability in graphite equipment.' },
    { year: '2010', title: 'Growing Client Base', desc: 'Expanded customer base across pharmaceutical and chemical industries in India.' },
    { year: '2015', title: 'Manufacturing Expansion', desc: 'Advanced CNC and fabrication capabilities added to the manufacturing facility.' },
    { year: '2020', title: 'Product Innovation', desc: 'Launched PTFE-lined equipment and acid concentration systems.' },
    { year: '2024', title: 'Industry Leadership', desc: 'Recognized as a leading graphite process equipment manufacturer with 200+ clients.' },
  ],
  certificates: images.certificates,
};

export const productsIntro = {
  title: 'How can we solve the corrosion and fouling problems in your equipment?',
  description:
    'The serious effects of corrosion over periods of time have always challenged industries to come up with new technologies and methods. Corrosion is slow degradation of metal or for instance any material that decomposes due to environmental & process conditions. Impact of corrosion can lead to compromised life cycle of any equipment.',
  extendedDescription:
    'The need for corrosion-resistant solutions has grown increasingly as new innovation helps unlock new potentials to mankind. As we are forefront at implementing corrosion resistant solutions, graphite — non ferrous element & a carbon allotrope has proven to be one of those materials. Graphite exhibits excellent characteristics making it suitable for various applications in different industries. Another revolutionary invention by R.J Plunkett in 1938, The discovery of PTFE — Polytetrafluoroethylene has vast advantages over glass equipment in corrosion resistant applications.',
  image: images.products.intro,
  categories: [
    'Graphite Heat Ex — Series HCL',
    'Graphite Heat Ex — Series HCB',
    'Graphite Shell & Tube Heat Ex',
    'Column & Column Internals',
    'Rupture Disc — Series RD',
  ],
};

export const contact = {
  address: `${company.legalName}\n${company.address}`,
  email: company.email,
  phone: company.phone,
};

export default {
  company,
  hero,
  stats,
  features,
  highlights,
  clients,
  industries,
  about,
  productsIntro,
  contact,
};
