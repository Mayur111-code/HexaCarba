import { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { productService } from '../../services/productService';
import Loader from '../../components/common/Loader';
import { HiOutlineDownload, HiOutlineShare, HiOutlineCube, HiOutlineCheck } from 'react-icons/hi';
import { FadeIn, SlideInLeft, SlideInRight, StaggerChildren, StaggerItem, TiltCard } from '../../components/animations/AnimatedComponents';
import { resolveAssetUrl } from '../../utils/assets';
import toast from 'react-hot-toast';

const ProductDetailPage = () => {
  const { slug } = useParams();
  const [product, setProduct] = useState(null);
  const [related, setRelated] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeImage, setActiveImage] = useState(0);

  useEffect(() => {
    const fetch = async () => {
      setLoading(true);
      try {
        const { data } = await productService.getPublicBySlug(slug);
        setProduct(data.data.product);
        setRelated(data.data.relatedProducts || []);
        setActiveImage(0);
      } catch { toast.error('Product not found'); }
      finally { setLoading(false); }
    };
    fetch();
    window.scrollTo(0, 0);
  }, [slug]);

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try { await navigator.share({ title: product?.name, url }); } catch {}
    } else {
      await navigator.clipboard.writeText(url);
      toast.success('Link copied!');
    }
  };

  if (loading) return <Loader fullScreen />;
  if (!product) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center bg-black">
        <div className="text-center">
          <h2 className="text-2xl font-bold">Product Not Found</h2>
          <Link to="/products" className="text-blue-400 hover:underline mt-2 inline-block">← Back to Products</Link>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-black min-h-screen">
      {/* Breadcrumb */}
      <div className="border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6 py-3 text-sm text-gray-500">
          <Link to="/" className="hover:text-blue-400 transition-colors">Home</Link> /{' '}
          <Link to="/products" className="hover:text-blue-400 transition-colors">Products</Link> /{' '}
          <span className="text-white">{product.name}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-16">
          {/* Left — Animated Gallery */}
          <SlideInLeft>
            <div className="sticky top-24">
              <div className="glass overflow-hidden rounded-2xl mb-4">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={activeImage}
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: 0.3 }}
                    className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center"
                  >
                    {product.images?.[activeImage]?.url ? (
                      <img
                        src={resolveAssetUrl(product.images[activeImage].url)}
                        alt={product.name}
                        className="w-full h-full object-contain"
                      />
                    ) : (
                      <HiOutlineCube className="w-24 h-24 text-gray-700" />
                    )}
                  </motion.div>
                </AnimatePresence>
              </div>

              {product.images?.length > 1 && (
                <div className="flex gap-2 overflow-x-auto pb-2">
                  {product.images.map((img, i) => (
                    <motion.button
                      key={i}
                      onClick={() => setActiveImage(i)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`w-16 h-16 rounded-xl border-2 flex-shrink-0 overflow-hidden transition-all ${
                        i === activeImage ? 'border-blue-500 shadow-[0_0_15px_rgba(59,130,246,0.3)]' : 'border-white/10 hover:border-white/30'
                      }`}
                    >
                      <img src={resolveAssetUrl(img.url)} alt="" className="w-full h-full object-cover" />
                    </motion.button>
                  ))}
                </div>
              )}
            </div>
          </SlideInLeft>

          {/* Right — Details */}
          <SlideInRight>
            <span className="text-sm text-blue-400 font-medium tracking-wide">{product.category?.name}</span>
            <h1 className="text-3xl md:text-4xl font-bold mt-2 mb-4 leading-tight">{product.name}</h1>
            <p className="text-gray-400 leading-relaxed mb-8 text-lg">{product.shortDescription}</p>

            <div className="flex flex-wrap gap-3 mb-10">
              {product.productSheet?.url && (
                <motion.a
                  href={resolveAssetUrl(product.productSheet.url)}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 text-white rounded-xl hover:bg-blue-500 font-medium text-sm transition-all hover:shadow-[0_0_30px_rgba(59,130,246,0.3)]"
                >
                  <HiOutlineDownload className="w-4 h-4" /> Download Product Sheet
                </motion.a>
              )}
              <motion.button
                onClick={handleShare}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="inline-flex items-center gap-2 px-6 py-3 border border-white/20 text-gray-300 rounded-xl hover:bg-white/5 font-medium text-sm transition-all"
              >
                <HiOutlineShare className="w-4 h-4" /> Share
              </motion.button>
            </div>

            {/* Specs table */}
            {product.specifications?.length > 0 && (
              <div className="glass overflow-hidden mb-10">
                <h3 className="px-5 py-3 text-sm font-semibold text-blue-400 border-b border-white/10">Specifications</h3>
                <table className="w-full text-sm">
                  <tbody>
                    {product.specifications.map((spec, i) => (
                      <tr key={i} className={`${i % 2 === 0 ? 'bg-white/[0.02]' : ''} border-b border-white/5 last:border-0`}>
                        <td className="px-5 py-3 font-medium text-gray-300 w-2/5">{spec.label}</td>
                        <td className="px-5 py-3 text-gray-400">{spec.value}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </SlideInRight>
        </div>

        {/* Long description */}
        {product.longDescription && (
          <FadeIn className="mt-16 max-w-4xl glass p-8">
            <h2 className="text-xl font-bold mb-4">Description</h2>
            <div className="text-gray-400 leading-relaxed whitespace-pre-wrap">{product.longDescription}</div>
          </FadeIn>
        )}

        {/* Lists grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          {[
            { title: 'Features', items: product.features },
            { title: 'Applications', items: product.applications },
            { title: 'Industries', items: product.industries },
          ].filter(l => l.items?.length > 0).map((list) => (
            <FadeIn key={list.title}>
              <div className="glass p-6">
                <h3 className="font-semibold text-blue-400 mb-4">{list.title}</h3>
                <div className="space-y-2.5">
                  {list.items.map((item, i) => (
                    <div key={i} className="flex items-start gap-2.5 text-sm text-gray-400">
                      <HiOutlineCheck className="w-4 h-4 text-green-500 mt-0.5 flex-shrink-0" />
                      {item}
                    </div>
                  ))}
                </div>
              </div>
            </FadeIn>
          ))}
        </div>

        {/* Related Products */}
        {related.length > 0 && (
          <div className="mt-20">
            <FadeIn>
              <h2 className="text-2xl font-bold mb-8">
                Related <span className="gradient-text">Products</span>
              </h2>
            </FadeIn>
            <StaggerChildren className="grid grid-cols-2 md:grid-cols-4 gap-4">
              {related.map((rp) => (
                <StaggerItem key={rp._id}>
                  <TiltCard>
                    <Link to={`/products/${rp.slug}`} className="block glass-hover overflow-hidden group">
                      <div className="aspect-square bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
                        {rp.images?.[0]?.url ? (
                          <motion.img src={resolveAssetUrl(rp.images[0].url)} alt={rp.name} className="w-full h-full object-cover" whileHover={{ scale: 1.1 }} transition={{ duration: 0.4 }} />
                        ) : (
                          <HiOutlineCube className="w-10 h-10 text-gray-700" />
                        )}
                      </div>
                      <div className="p-4">
                        <h3 className="text-sm font-medium group-hover:text-blue-400 transition-colors">{rp.name}</h3>
                        <p className="text-xs text-gray-500 mt-1 line-clamp-2">{rp.shortDescription}</p>
                      </div>
                    </Link>
                  </TiltCard>
                </StaggerItem>
              ))}
            </StaggerChildren>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetailPage;
