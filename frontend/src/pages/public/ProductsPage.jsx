import { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { productService } from '../../services/productService';
import { categoryService } from '../../services/categoryService';
import { HiOutlineSearch, HiOutlineCube } from 'react-icons/hi';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import Pagination from '../../components/common/Pagination';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import { FadeIn, StaggerChildren, StaggerItem, BlurReveal, TiltCard } from '../../components/animations/AnimatedComponents';
import ContentImage from '../../components/common/ContentImage';
import { productsIntro } from '../../data/siteContent';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('');
  const { page, limit, goToPage, setPage } = usePagination(1, 12);
  const debouncedSearch = useDebounce(search);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (categoryFilter) params.category = categoryFilter;
      const { data } = await productService.getPublic(params);
      setProducts(data.data || []);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  }, [page, limit, debouncedSearch, categoryFilter]);

  useEffect(() => {
    categoryService.getPublic().then(({ data }) => setCategories(data.data || [])).catch(() => {});
  }, []);

  useEffect(() => { fetchProducts(); }, [fetchProducts]);
  useEffect(() => { setPage(1); }, [debouncedSearch, categoryFilter, setPage]);

  return (
    <div className="overflow-x-hidden">
      <section className="relative min-h-[40vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-black">
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top,rgba(59,130,246,0.1),transparent_70%)]" />
        </div>
        <div className="relative z-10 w-full max-w-7xl mx-auto px-6 py-20">
          <BlurReveal>
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-white/10 bg-white/5 text-sm text-blue-400 mb-6">
              Our Products
            </div>
          </BlurReveal>
          <BlurReveal delay={0.15}>
            <h1 className="text-5xl md:text-7xl font-bold tracking-tight leading-[1.05] mb-6">
              Explore Our <span className="gradient-text">Range</span>
            </h1>
          </BlurReveal>
          <FadeIn delay={0.3}>
            <p className="text-xl text-gray-400 max-w-2xl">
              Complete range of graphite and PTFE-based corrosion-resistant process equipment
            </p>
          </FadeIn>
        </div>
      </section>

      {/* Products intro — from original hexacarb.com */}
      <section className="py-16 bg-black border-b border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <FadeIn>
              <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{productsIntro.title}</h2>
              <p className="text-gray-400 leading-relaxed mb-4">{productsIntro.description}</p>
              <p className="text-gray-500 text-sm leading-relaxed">{productsIntro.extendedDescription}</p>
              <div className="flex flex-wrap gap-2 mt-6">
                {productsIntro.categories.map((cat) => (
                  <span key={cat} className="px-3 py-1.5 rounded-lg bg-white/5 border border-white/10 text-xs text-gray-300">
                    {cat}
                  </span>
                ))}
              </div>
            </FadeIn>
            <FadeIn delay={0.2}>
              <ContentImage
                src={productsIntro.image}
                alt="Graphite process equipment"
                className="w-full aspect-[2/1] object-cover rounded-2xl"
                fallbackLabel="Products Intro"
              />
            </FadeIn>
          </div>
        </div>
      </section>

      <section className="py-16 bg-gradient-to-b from-black to-gray-950 min-h-[60vh]">
        <div className="max-w-7xl mx-auto px-6">
          <FadeIn>
            <div className="flex flex-col sm:flex-row gap-4 mb-10">
              <div className="relative flex-1 max-w-sm">
                <HiOutlineSearch className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Search products..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-white/5 border border-white/10 rounded-xl text-sm text-white placeholder-gray-500 focus:ring-2 focus:ring-blue-500 outline-none transition-all"
                />
              </div>
              <select
                value={categoryFilter}
                onChange={(e) => setCategoryFilter(e.target.value)}
                className="bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-sm text-gray-300 focus:ring-2 focus:ring-blue-500 outline-none"
              >
                <option value="">All Categories</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>{cat.name}</option>
                ))}
              </select>
            </div>
          </FadeIn>

          {loading ? (
            <Loader />
          ) : products.length === 0 ? (
            <EmptyState message="No products found" icon={HiOutlineCube} />
          ) : (
            <>
              <StaggerChildren className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                  <StaggerItem key={product._id}>
                    <TiltCard>
                      <Link to={`/products/${product.slug}`} className="block glass-hover overflow-hidden group">
                        <div className="aspect-[4/3] bg-gradient-to-br from-gray-900 to-black flex items-center justify-center overflow-hidden">
                          {product.images?.[0]?.url ? (
                            <motion.img
                              src={product.images[0].url}
                              alt={product.name}
                              className="w-full h-full object-cover"
                              whileHover={{ scale: 1.1 }}
                              transition={{ duration: 0.6 }}
                            />
                          ) : (
                            <HiOutlineCube className="w-16 h-16 text-gray-700" />
                          )}
                        </div>
                        <div className="p-5">
                          <span className="text-xs text-blue-400 font-medium">{product.category?.name}</span>
                          <h3 className="font-semibold text-white mt-1.5 group-hover:text-blue-400 transition-colors">
                            {product.name}
                          </h3>
                          <p className="text-sm text-gray-500 mt-1.5 line-clamp-2">{product.shortDescription}</p>
                          <span className="inline-flex items-center gap-1 mt-4 text-sm font-medium text-blue-400">
                            View Details →
                          </span>
                        </div>
                      </Link>
                    </TiltCard>
                  </StaggerItem>
                ))}
              </StaggerChildren>
              {pagination && <div className="mt-12"><Pagination pagination={pagination} onPageChange={goToPage} /></div>}
            </>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductsPage;
