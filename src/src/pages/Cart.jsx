import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import ScrollReveal from '../components/ScrollReveal';
import { getProductImage, vegetableImages } from '../utils/visuals';

export default function Cart() {
  const { cart, removeFromCart, updateQuantity, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const subtotal = getCartTotal();
  const serviceFee = subtotal > 0 ? 0 : 0;
  const total = subtotal + serviceFee;

  const handleCheckout = () => {
    if (!user) { navigate('/login'); return; }
    if (!cart.length) return;
    navigate('/delivery-details');
  };

  if (!cart.length) {
    return <div className="relative min-h-[75vh] overflow-hidden px-4 py-14"><img src={vegetableImages.mixed} alt="" className="absolute inset-0 h-full w-full object-cover opacity-[.08] blur-2xl" /><div className="relative mx-auto flex min-h-[55vh] max-w-3xl items-center justify-center"><div className="glass w-full rounded-[34px] p-10 text-center"><div className="mx-auto flex h-16 w-16 items-center justify-center rounded-3xl bg-[#173e2d] text-[#c9ef5d]"><Icon name="cart" size={27} /></div><div className="mt-5 text-3xl font-black tracking-tight">Your basket is waiting</div><p className="mx-auto mt-3 max-w-md text-sm leading-6 text-[#74827b]">Add a few fresh vegetables and they will appear here with live quantity controls and a smooth checkout flow.</p><Link to="/" className="mt-7 inline-flex items-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-3.5 text-sm font-black text-white">Browse vegetables <Icon name="arrowRight" size={17} /></Link></div></div></div>;
  }

  return <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
    <ScrollReveal><div className="mb-8 flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-[11px] font-black uppercase tracking-[.2em] text-[#769080]">Your basket</div><h1 className="mt-2 text-4xl font-black tracking-[-.04em]">Everything looks fresh.</h1></div><Link to="/" className="inline-flex items-center gap-2 text-sm font-black text-[#1f7a55]"><Icon name="arrowLeft" size={16} /> Continue shopping</Link></div></ScrollReveal>
    <div className="grid gap-6 lg:grid-cols-[1fr_360px]">
      <div className="space-y-3">
        {cart.map((item, index) => (
          <ScrollReveal key={item.id} delay={index * 45}>
            <article className="glass soft-card flex flex-col gap-4 rounded-[28px] p-4 sm:flex-row sm:items-center sm:p-5">
              <div className="h-28 w-full shrink-0 overflow-hidden rounded-2xl bg-[#eff6e9] sm:h-28 sm:w-28"><img src={getProductImage(item)} alt={item.name} className="h-full w-full object-cover transition duration-500 hover:scale-105" /></div>
              <div className="min-w-0 flex-1">
                <div className="flex flex-col gap-2 sm:flex-row sm:items-start sm:justify-between">
                  <div><h3 className="text-xl font-black text-[#18302a]">{item.name}</h3><p className="mt-1 text-xs font-bold uppercase tracking-[.13em] text-[#92a099]">{item.category?.name || 'Fresh vegetable'}</p></div>
                  <div className="text-xl font-black text-[#1f7a55]">₹{(item.price * item.quantity).toFixed(2)}</div>
                </div>
                <p className="mt-2 text-sm text-[#78877f]">₹{Number(item.price).toFixed(2)} per unit</p>
                <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2 rounded-2xl bg-[#edf5e9] p-1.5"><button onClick={() => updateQuantity(item.id, item.quantity - 1)} disabled={item.quantity <= 1} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#284b3e] shadow-sm disabled:opacity-35"><Icon name="minus" size={16} /></button><div className="w-10 text-center text-sm font-black">{item.quantity}</div><button onClick={() => updateQuantity(item.id, item.quantity + 1)} disabled={item.quantity >= item.stockQuantity} className="flex h-9 w-9 items-center justify-center rounded-xl bg-white text-[#284b3e] shadow-sm disabled:opacity-35"><Icon name="plus" size={16} /></button></div>
                  <button onClick={() => removeFromCart(item.id)} className="inline-flex items-center gap-2 text-xs font-black uppercase tracking-[.12em] text-[#a04e46] hover:text-[#873b33]"><Icon name="trash" size={15} /> Remove</button>
                </div>
              </div>
            </article>
          </ScrollReveal>
        ))}
      </div>

      <ScrollReveal delay={100}>
        <aside className="glass soft-card sticky top-24 rounded-[30px] p-6">
          <div className="flex items-center justify-between"><h2 className="text-xl font-black">Order summary</h2><span className="rounded-full bg-[#edf7e7] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.13em] text-[#4e775d]">Ready</span></div>
          <div className="mt-6 space-y-3 border-b border-black/7 pb-5 text-sm"><div className="flex justify-between"><span className="text-[#7b8982]">Items</span><span className="font-bold">{cart.reduce((n, item) => n + item.quantity, 0)}</span></div><div className="flex justify-between"><span className="text-[#7b8982]">Subtotal</span><span className="font-bold">₹{subtotal.toFixed(2)}</span></div><div className="flex justify-between"><span className="text-[#7b8982]">Delivery</span><span className="font-bold text-[#1f7a55]">Free</span></div></div>
          <div className="mt-5 flex items-end justify-between"><div><div className="text-xs font-bold uppercase tracking-[.13em] text-[#89978f]">Total</div><div className="mt-1 text-3xl font-black">₹{total.toFixed(2)}</div></div><div className="rounded-xl bg-[#eff6e9] px-3 py-2 text-right text-[10px] font-bold text-[#557363]">Fresh basket<br />secured locally</div></div>
          <button onClick={handleCheckout} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-4 text-sm font-black text-white shadow-lg shadow-[#173e2d]/10 transition hover:-translate-y-0.5">Proceed to checkout <Icon name="arrowRight" size={17} /></button>
        </aside>
      </ScrollReveal>
    </div>
  </div>;
}
