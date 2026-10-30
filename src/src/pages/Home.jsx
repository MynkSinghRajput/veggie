import { useEffect, useMemo, useRef, useState } from 'react';
import axios from 'axios';
import { useSearchParams } from 'react-router-dom';
import ProductCard from '../components/ProductCard';
import ScrollReveal from '../components/ScrollReveal';
import Icon from '../components/Icon';
import { vegetableImages } from '../utils/visuals';

export default function Home() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchParams] = useSearchParams();
  const searchQuery = searchParams.get('search') || '';
  const [scrollY, setScrollY] = useState(0);
  const heroRef = useRef(null);

  useEffect(() => {
    axios.get('http://localhost:8080/api/products')
      .then(response => {
        setProducts(Array.isArray(response.data) ? response.data : []);
        setLoading(false);
      })
      .catch(err => {
        console.error('Error fetching products:', err);
        setError('Fresh produce could not be loaded. Please make sure the backend is running.');
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (ticking) return;
      ticking = true;
      window.requestAnimationFrame(() => {
        setScrollY(window.scrollY);
        ticking = false;
      });
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const categories = useMemo(() => ['All', ...new Set(products.map(p => p.category?.name).filter(Boolean))], [products]);
  const filteredProducts = useMemo(() => {
    const searchLower = searchQuery.toLowerCase();
    return products.filter(product => {
      const matchesCategory = selectedCategory === 'All' || product.category?.name === selectedCategory;
      const matchesSearch = product.name?.toLowerCase().includes(searchLower) || product.category?.name?.toLowerCase().includes(searchLower);
      return matchesCategory && matchesSearch;
    });
  }, [products, searchQuery, selectedCategory]);

  if (loading) {
    return (
      <div className="min-h-[75vh] px-4 py-10">
        <div className="mx-auto max-w-7xl animate-pulse">
          <div className="h-[440px] rounded-[34px] bg-[#e6eee1]" />
          <div className="mt-10 grid grid-cols-2 gap-5 lg:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => <div key={i} className="h-[360px] rounded-[28px] bg-[#e9efe6]" />)}
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex min-h-[70vh] items-center justify-center px-4">
        <div className="glass max-w-lg rounded-[30px] p-10 text-center">
          <div className="mx-auto mb-5 flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f7eceb] text-[#a45046]"><Icon name="refresh" size={24} /></div>
          <h1 className="text-2xl font-black text-[#18302a]">We could not load the harvest</h1>
          <p className="mt-3 text-sm leading-6 text-[#718079]">{error}</p>
          <button onClick={() => window.location.reload()} className="mt-6 rounded-2xl bg-[#173e2d] px-5 py-3 text-sm font-black text-white">Try again</button>
        </div>
      </div>
    );
  }

  return (
    <div ref={heroRef} className="pb-16">
      <section className="px-3 pb-6 pt-3 sm:px-5 lg:pt-5">
        <div className="hero-spotlight relative mx-auto max-w-7xl overflow-hidden rounded-[34px] bg-[#193e2f] shadow-[0_35px_90px_rgba(31,79,57,.18)]">
          <img src={vegetableImages.market} alt="Fresh vegetables" className="absolute inset-0 h-full w-full object-cover opacity-28 blur-[2px] scale-105" />
          <div className="absolute inset-0 bg-[linear-gradient(105deg,rgba(18,52,38,.97)_0%,rgba(18,52,38,.82)_42%,rgba(18,52,38,.38)_72%,rgba(18,52,38,.15)_100%)]" />

          <div className="relative grid min-h-[620px] items-center gap-10 px-6 py-10 sm:px-10 lg:grid-cols-[1.02fr_.98fr] lg:px-16 lg:py-12">
            <div className="max-w-xl">
              <div className="mb-5 inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-3 py-2 text-[11px] font-black uppercase tracking-[.2em] text-[#dcf2bb] backdrop-blur">
                <span className="h-2 w-2 rounded-full bg-[#c9ef5d] shadow-[0_0_0_5px_rgba(201,239,93,.1)]" />
                Farm-picked. Market-ready.
              </div>
              <h1 className="max-w-2xl text-4xl font-black leading-[1.02] tracking-[-.04em] text-white sm:text-6xl lg:text-7xl">
                Fresh vegetables, <span className="text-[#c9ef5d]">beautifully delivered.</span>
              </h1>
              <p className="mt-6 max-w-lg text-base leading-7 text-white/72 sm:text-lg">
                A premium, effortless way to fill your kitchen with crisp produce. Browse today's harvest, build your basket, and checkout in seconds.
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <a href="#shop" className="inline-flex items-center gap-2 rounded-2xl bg-[#c9ef5d] px-5 py-3.5 text-sm font-black text-[#173e2d] shadow-[0_15px_35px_rgba(201,239,93,.18)] transition hover:-translate-y-0.5 hover:bg-[#d5f67b]">
                  Shop the harvest <Icon name="arrowRight" size={17} />
                </a>
                <div className="inline-flex items-center gap-3 rounded-2xl border border-white/15 bg-white/8 px-4 py-3 text-sm font-semibold text-white/85 backdrop-blur">
                  <Icon name="shield" size={18} className="text-[#c9ef5d]" />
                  Freshness checked
                </div>
              </div>

              <div className="mt-10 grid max-w-xl grid-cols-3 gap-4 border-t border-white/10 pt-6">
                {[
                  ['01', 'Fresh daily', 'Curated produce'],
                  ['02', 'Simple checkout', 'Fast & secure'],
                  ['03', 'Easy tracking', 'Clear order flow'],
                ].map(([num, title, sub]) => (
                  <div key={num}>
                    <div className="text-[10px] font-black uppercase tracking-[.18em] text-white/40">{num}</div>
                    <div className="mt-2 text-sm font-bold text-white">{title}</div>
                    <div className="mt-1 text-xs text-white/45">{sub}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="relative mx-auto hidden h-[460px] w-full max-w-xl lg:block">
              <div className="absolute left-[8%] top-[10%] h-48 w-48 rounded-full bg-[#d0f36c]/10 blur-3xl" />
              <div className="absolute right-[2%] top-[18%] h-52 w-52 rounded-full bg-white/10 blur-3xl" />

              <div className="absolute left-[13%] top-[12%] h-44 w-44 overflow-hidden rounded-[34px] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl float-slower">
                <img src={vegetableImages.carrots} alt="Carrots" className="h-full w-full rounded-[28px] object-cover" style={{ transform: `translateY(${scrollY * 0.03}px)` }} />
              </div>
              <div className="absolute right-[5%] top-[3%] h-36 w-36 overflow-hidden rounded-[30px] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl float-slow">
                <img src={vegetableImages.tomatoes} alt="Tomatoes" className="h-full w-full rounded-[24px] object-cover" />
              </div>
              <div className="absolute bottom-[7%] left-[5%] h-40 w-40 overflow-hidden rounded-[32px] border border-white/15 bg-white/10 p-2 shadow-2xl backdrop-blur-xl float-spin">
                <img src={vegetableImages.broccoli} alt="Broccoli" className="h-full w-full rounded-[26px] object-cover" />
              </div>
              <div className="hero-parallax absolute bottom-[8%] right-[3%] h-64 w-64 overflow-hidden rounded-[42px] border border-white/20 bg-white/10 p-2 shadow-2xl backdrop-blur-2xl" style={{ '--parallax-y': `${Math.min(scrollY * 0.06, 34)}px` }}>
                <img src={vegetableImages.mixed} alt="Fresh mixed vegetables" className="h-full w-full rounded-[34px] object-cover" />
              </div>
              <div className="absolute left-[32%] top-[35%] z-10 flex items-center gap-3 rounded-2xl border border-white/15 bg-white/12 px-4 py-3 shadow-xl backdrop-blur-xl">
                <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#c9ef5d] text-[#173e2d]"><Icon name="leaf" size={20} /></div>
                <div>
                  <div className="text-xs font-black text-white">Today's harvest</div>
                  <div className="mt-0.5 text-[11px] text-white/55">Selected for freshness</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section id="shop" className="mx-auto max-w-7xl px-4 pt-10 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
            <div>
              <div className="mb-2 text-[11px] font-black uppercase tracking-[.2em] text-[#739080]">The weekly harvest</div>
              <h2 className="text-3xl font-black tracking-[-.03em] text-[#18302a] sm:text-4xl">Choose what looks freshest</h2>
              <p className="mt-2 max-w-2xl text-sm leading-6 text-[#74827b]">Scroll naturally through the collection. Cards glide into view, softly scale up, and ease away when you move on.</p>
            </div>
            <div className="flex items-center gap-2 rounded-2xl bg-white/75 p-1.5 shadow-sm ring-1 ring-black/5 backdrop-blur">
              <span className="px-2 text-[10px] font-black uppercase tracking-[.14em] text-[#8b9a92]">Filter</span>
              <div className="no-scrollbar flex max-w-[70vw] gap-1 overflow-x-auto">
                {categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`category-pill whitespace-nowrap rounded-xl px-3 py-2 text-xs font-black ${selectedCategory === category ? 'bg-[#173e2d] text-white shadow' : 'text-[#5f7469] hover:bg-[#eff6e9]'}`}
                  >
                    {category}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </ScrollReveal>

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-4">
          {filteredProducts.map((product, index) => <ProductCard key={product.id} product={product} index={index} />)}
        </div>

        {filteredProducts.length === 0 && (
          <div className="glass mt-8 rounded-[28px] p-12 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#eff6e9] text-[#1f7a55]"><Icon name="search" size={23} /></div>
            <h3 className="mt-4 text-xl font-black">No matching vegetables yet</h3>
            <p className="mt-2 text-sm text-[#74827b]">Try another search or choose a different category.</p>
          </div>
        )}
      </section>

      <section className="mx-auto max-w-7xl px-4 pt-20 sm:px-6 lg:px-8">
        <ScrollReveal>
          <div className="grid overflow-hidden rounded-[30px] border border-[#dce8d7] bg-[#eff6e9] md:grid-cols-3">
            {[
              ['leaf', 'Fresh-first sourcing', 'Produce is presented around quality, freshness, and simple everyday use.'],
              ['shield', 'Clear, secure flow', 'Your basket, delivery details, and order placement stay easy to understand.'],
              ['package', 'Premium packing', 'A polished shopping experience from first click to final confirmation.'],
            ].map(([icon, title, text], index) => (
              <div key={title} className={`p-7 ${index !== 2 ? 'border-b md:border-b-0 md:border-r border-[#d5e2cf]' : ''}`}>
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1f7a55] shadow-sm"><Icon name={icon} size={21} /></div>
                <h3 className="mt-5 text-lg font-black">{title}</h3>
                <p className="mt-2 text-sm leading-6 text-[#6d7e75]">{text}</p>
              </div>
            ))}
          </div>
        </ScrollReveal>
      </section>
    </div>
  );
}
