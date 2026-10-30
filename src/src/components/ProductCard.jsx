import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import Icon from './Icon';
import ScrollReveal from './ScrollReveal';
import { getProductImage } from '../utils/visuals';

export default function ProductCard({ product, index = 0 }) {
  const { cart, addToCart, updateQuantity } = useCart();
  const navigate = useNavigate();
  const [flying, setFlying] = useState(false);
  const cartItem = cart.find(item => item.id === product.id);
  const quantityInCart = cartItem?.quantity || 0;
  const remainingStock = Math.max(0, Number(product.stockQuantity || 0) - quantityInCart);
  const isOutOfStock = Number(product.stockQuantity || 0) <= 0;
  const isCartLimitReached = quantityInCart >= Number(product.stockQuantity || 0);
  const imageUrl = getProductImage(product);
  const rating = Number(product.rating || 4.8);

  const flyToCart = () => {
    const button = document.getElementById(`add-${product.id}`);
    const target = document.getElementById('cart-target');
    if (!button || !target) return;
    const from = button.getBoundingClientRect();
    const to = target.getBoundingClientRect();
    const ghost = document.createElement('img');
    ghost.src = imageUrl;
    ghost.alt = '';
    ghost.className = 'fly-to-cart';
    ghost.style.left = `${from.left + from.width / 2 - 23}px`;
    ghost.style.top = `${from.top + from.height / 2 - 23}px`;
    ghost.style.setProperty('--fly-x', `${to.left + to.width / 2 - (from.left + from.width / 2)}px`);
    ghost.style.setProperty('--fly-y', `${to.top + to.height / 2 - (from.top + from.height / 2)}px`);
    document.body.appendChild(ghost);
    ghost.addEventListener('animationend', () => ghost.remove());
  };

  const handleAdd = () => {
    if (isOutOfStock || isCartLimitReached) return;
    addToCart(product);
    setFlying(true);
    flyToCart();
    window.dispatchEvent(new CustomEvent('veggie-cart-added'));
    window.setTimeout(() => setFlying(false), 520);
  };

  const handleBuyNow = () => {
    if (quantityInCart === 0) addToCart(product);
    navigate('/cart');
  };

  return (
    <ScrollReveal delay={Math.min(index * 45, 220)} className="h-full">
      <article className="product-card soft-card flex h-full flex-col overflow-hidden rounded-[28px] bg-white/82 backdrop-blur">
        <div className="relative overflow-hidden bg-[#eff6e9] p-3">
          <div className="absolute left-5 top-5 z-10 rounded-full border border-white/70 bg-white/85 px-3 py-1 text-[10px] font-black uppercase tracking-[.16em] text-[#5b7268] shadow-sm">Fresh pick</div>
          <div className="aspect-[4/3] overflow-hidden rounded-[22px]">
            <img src={imageUrl} alt={product.name} className="product-card-image h-full w-full object-cover" />
          </div>
          <div className="absolute bottom-5 right-5 flex items-center gap-1 rounded-full bg-[#173e2d]/90 px-2.5 py-1.5 text-[11px] font-bold text-white backdrop-blur">
            <Icon name="star" size={12} className="text-[#d3f169]" />
            {rating.toFixed(1)}
          </div>
        </div>

        <div className="flex flex-1 flex-col p-5">
          <div className="mb-2 flex items-start justify-between gap-3">
            <div>
              <h3 className="text-lg font-black tracking-tight text-[#18302a]">{product.name}</h3>
              <p className="mt-1 text-xs font-semibold uppercase tracking-[.14em] text-[#8a9d94]">{product.category?.name || 'Seasonal vegetable'}</p>
            </div>
            <div className="text-right">
              <div className="text-lg font-black text-[#1f7a55]">₹{Number(product.price || 0).toFixed(0)}</div>
              <div className="text-[11px] font-semibold text-[#84948d]">per unit</div>
            </div>
          </div>

          <p className="mb-4 line-clamp-2 text-sm leading-6 text-[#6f7e77]">
            {product.description || 'Freshly sourced, carefully selected, and packed for everyday cooking.'}
          </p>

          <div className="mt-auto">
            {isOutOfStock ? (
              <div className="mb-3 rounded-xl bg-[#f8eceb] px-3 py-2 text-center text-xs font-bold text-[#a45046]">Currently unavailable</div>
            ) : (
              <div className="mb-3 flex items-center justify-between text-[11px] font-bold uppercase tracking-[.12em] text-[#7f9188]">
                <span>{quantityInCart ? `${quantityInCart} in cart` : `${remainingStock} available`}</span>
                {remainingStock <= 5 && <span className="text-[#b05f35]">Limited stock</span>}
              </div>
            )}

            {quantityInCart > 0 ? (
              <div className="grid grid-cols-[48px_1fr_48px] items-center gap-2 rounded-2xl bg-[#eff6e9] p-2">
                <button onClick={() => updateQuantity(product.id, quantityInCart - 1)} className="flex h-11 items-center justify-center rounded-xl bg-white text-[#23463a] shadow-sm transition hover:bg-[#173e2d] hover:text-white"><Icon name="minus" size={18} /></button>
                <div className="text-center">
                  <div className="text-lg font-black text-[#18302a]">{quantityInCart}</div>
                  <div className="text-[9px] font-bold uppercase tracking-[.15em] text-[#8c9b94]">In cart</div>
                </div>
                <button disabled={isCartLimitReached} onClick={() => updateQuantity(product.id, quantityInCart + 1)} className="flex h-11 items-center justify-center rounded-xl bg-white text-[#23463a] shadow-sm transition hover:bg-[#173e2d] hover:text-white disabled:cursor-not-allowed disabled:opacity-35"><Icon name="plus" size={18} /></button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-2">
                <button id={`add-${product.id}`} onClick={handleAdd} disabled={isOutOfStock} className={`flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-sm font-black text-white transition ${flying ? 'scale-95' : ''} ${isOutOfStock ? 'cursor-not-allowed bg-[#b8c2bd]' : 'bg-[#173e2d] hover:-translate-y-0.5 hover:bg-[#0d3020]'}`}>
                  <Icon name="cart" size={17} />
                  Add to cart
                </button>
                <button onClick={handleBuyNow} disabled={isOutOfStock} className="rounded-2xl border border-[#1f7a55]/15 bg-[#eef7ef] px-3 py-3 text-sm font-black text-[#1f7a55] transition hover:-translate-y-0.5 hover:bg-[#e3f2e4] disabled:cursor-not-allowed disabled:opacity-50">Buy now</button>
              </div>
            )}
          </div>
        </div>
      </article>
    </ScrollReveal>
  );
}
