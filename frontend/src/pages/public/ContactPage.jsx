import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { motion } from 'framer-motion';
import { contactService } from '../../services/contactService';
import toast from 'react-hot-toast';
import {
  HiOutlineMail, HiOutlinePhone, HiOutlineLocationMarker,
  HiOutlinePaperAirplane,
} from 'react-icons/hi';
import {
  FadeIn, BlurReveal, SlideInLeft, SlideInRight,
} from '../../components/animations/AnimatedComponents';
import { contact, company } from '../../data/siteContent';

const ContactPage = () => {
  const [submitting, setSubmitting] = useState(false);
  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  const onSubmit = async (data) => {
    setSubmitting(true);
    try {
      await contactService.submit(data);
      toast.success('Your message has been sent! We will get back to you soon.');
      reset();
    } catch {
      toast.error('Failed to send message. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.08),transparent_70%)]" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
          <BlurReveal><div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-6">Get In Touch</div></BlurReveal>
          <BlurReveal delay={0.15}><h1 className="text-5xl md:text-7xl font-bold tracking-tight mb-6">Let's <span className="gradient-text">Talk</span></h1></BlurReveal>
          <FadeIn delay={0.3}><p className="text-xl text-gray-400 max-w-2xl">Have a question or need a quote? We'd love to hear from you.</p></FadeIn>
        </div>
      </section>

      <section className="py-24 bg-gradient-to-b from-black to-gray-950">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16">
            <SlideInLeft>
              <div>
                <h2 className="text-3xl font-bold mb-8">Contact <span className="gradient-text">Information</span></h2>
                <div className="space-y-6">
                  {[
                    { icon: HiOutlineLocationMarker, title: 'Address', content: contact.address },
                    { icon: HiOutlineMail, title: 'Email', content: contact.email },
                    { icon: HiOutlinePhone, title: 'Phone', content: contact.phone },
                  ].map((item, i) => (
                    <FadeIn key={item.title} delay={i * 0.15}>
                      <div className="glass-hover p-5 flex items-start gap-4 group">
                        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/20 flex items-center justify-center flex-shrink-0 group-hover:scale-110 transition-transform">
                          <item.icon className="w-6 h-6 text-blue-400" />
                        </div>
                        <div>
                          <h3 className="font-medium">{item.title}</h3>
                          <p className="text-sm text-gray-400 whitespace-pre-line mt-1">{item.content}</p>
                        </div>
                      </div>
                    </FadeIn>
                  ))}
                </div>
              </div>
            </SlideInLeft>

            <SlideInRight>
              <div className="glass p-8">
                <h2 className="text-2xl font-bold mb-6">Send a <span className="gradient-text">Message</span></h2>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Name *</label>
                      <input {...register('name', { required: 'Name is required' })} placeholder="Your name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      {errors.name && <p className="text-red-400 text-xs mt-1">{errors.name.message}</p>}
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Email *</label>
                      <input type="email" {...register('email', { required: 'Email is required' })} placeholder="your@email.com" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                      {errors.email && <p className="text-red-400 text-xs mt-1">{errors.email.message}</p>}
                    </div>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Phone</label>
                      <input {...register('phone')} placeholder={company.phone} className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-1.5">Company</label>
                      <input {...register('company')} placeholder="Company name" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Subject *</label>
                    <input {...register('subject', { required: 'Subject is required' })} placeholder="What is this about?" className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all" />
                    {errors.subject && <p className="text-red-400 text-xs mt-1">{errors.subject.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-300 mb-1.5">Message *</label>
                    <textarea {...register('message', { required: 'Message is required' })} rows={5} placeholder="Tell us about your requirements..." className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all resize-none" />
                    {errors.message && <p className="text-red-400 text-xs mt-1">{errors.message.message}</p>}
                  </div>
                  <motion.button
                    type="submit"
                    disabled={submitting}
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.98 }}
                    className="inline-flex items-center gap-2 px-8 py-3.5 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-medium text-sm disabled:opacity-50 transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)] w-full justify-center"
                  >
                    {submitting ? (
                      <><div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> Sending...</>
                    ) : (
                      <><HiOutlinePaperAirplane className="w-5 h-5" /> Send Message</>
                    )}
                  </motion.button>
                </form>
              </div>
            </SlideInRight>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ContactPage;
