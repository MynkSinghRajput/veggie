import { useState } from 'react';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { getProductImage, vegetableImages } from '../utils/visuals';

const steps = ['Basket', 'Delivery', 'Place order'];

export default function DeliveryDetails() {
  const { cart, getCartTotal } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({ fullName: '', contactNumber: '', houseNumber: '', street: '', area: '', city: '', state: '', pincode: '', instructions: '' });

  const handleChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!user) { navigate('/login'); return; }
    if (!cart.length) { navigate('/cart'); return; }
    navigate('/payment', { state: { deliveryDetails: formData } });
  };

  if (!cart.length) return <EmptyCheckout navigate={navigate} />;

  return <CheckoutShell current={1}>
    <div className="grid gap-6 lg:grid-cols-[1fr_350px]">
      <div className="glass soft-card rounded-[30px] p-6 sm:p-8">
        <div className="mb-7"><div className="text-[11px] font-black uppercase tracking-[.2em] text-[#769080]">Delivery details</div><h1 className="mt-2 text-3xl font-black tracking-tight">Where should we bring your basket?</h1><p className="mt-2 text-sm leading-6 text-[#74827b]">Tell us exactly where the fresh produce should land. Your details stay attached to this order.</p></div>
        <form onSubmit={handleSubmit} className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <Field label="Full name" name="fullName" value={formData.fullName} onChange={handleChange} placeholder="Your full name" />
          <Field label="Contact number" name="contactNumber" value={formData.contactNumber} onChange={handleChange} placeholder="10 digit mobile number" type="tel" maxLength="10" />
          <Field label="House / flat number" name="houseNumber" value={formData.houseNumber} onChange={handleChange} placeholder="House, flat or building" />
          <Field label="Street / road" name="street" value={formData.street} onChange={handleChange} placeholder="Street or road" />
          <Field label="Area / locality" name="area" value={formData.area} onChange={handleChange} placeholder="Area or locality" />
          <Field label="City" name="city" value={formData.city} onChange={handleChange} placeholder="City" />
          <Field label="State" name="state" value={formData.state} onChange={handleChange} placeholder="State" />
          <Field label="PIN code" name="pincode" value={formData.pincode} onChange={handleChange} placeholder="6 digit PIN" maxLength="6" />
          <label className="sm:col-span-2"><span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">Delivery instructions <span className="normal-case tracking-normal text-[#9aa59f]">optional</span></span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><textarea name="instructions" value={formData.instructions} onChange={handleChange} rows="4" placeholder="Call before delivery, leave at the gate, or share anything helpful." className="w-full resize-none bg-transparent text-sm leading-6 outline-none placeholder:text-[#a0ada6]" /></div></label>
          <div className="sm:col-span-2 flex items-center justify-between gap-4 border-t border-black/7 pt-5"><button type="button" onClick={() => navigate('/cart')} className="inline-flex items-center gap-2 text-sm font-black text-[#1f7a55]"><Icon name="arrowLeft" size={16} /> Back to basket</button><button type="submit" className="inline-flex items-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-3.5 text-sm font-black text-white">Continue <Icon name="arrowRight" size={17} /></button></div>
        </form>
      </div>
      <OrderMiniSummary cart={cart} total={getCartTotal()} />
    </div>
  </CheckoutShell>;
}

function Field({ label, name, value, onChange, placeholder, type = 'text', maxLength }) { return <label><span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">{label}</span><div className="input-shell flex items-center rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><input type={type} name={name} value={value} onChange={onChange} required maxLength={maxLength} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" /></div></label>; }

function CheckoutShell({ current, children }) { return <div className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8"><img src={vegetableImages.market} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.04] blur-3xl" /><div className="relative mx-auto max-w-6xl"><CheckoutSteps current={current} /><div className="mt-8">{children}</div></div></div>; }
function CheckoutSteps({ current }) { return <div className="glass mx-auto flex max-w-3xl items-center justify-between rounded-2xl px-4 py-3"><div className="flex w-full items-center justify-between">{steps.map((step, index) => <div key={step} className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${index <= current ? 'bg-[#173e2d] text-white' : 'bg-[#edf2ec] text-[#8c9992]'}`}>{index < current ? <Icon name="check" size={15} /> : index + 1}</div><span className={`hidden text-xs font-black sm:block ${index <= current ? 'text-[#355c4b]' : 'text-[#98a39e]'}`}>{step}</span>{index < steps.length - 1 && <div className={`mx-1 h-px w-8 sm:w-24 ${index < current ? 'bg-[#9acb6a]' : 'bg-black/7'}`} />}</div>)}</div></div>; }
function OrderMiniSummary({ cart, total }) { return <aside className="glass soft-card h-fit rounded-[30px] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black">Your basket</h2><Icon name="cart" size={19} className="text-[#1f7a55]" /></div><div className="mt-5 space-y-3">{cart.map(item => <div key={item.id} className="flex items-center gap-3"><img src={getProductImage(item)} alt={item.name} className="h-12 w-12 rounded-xl object-cover" /><div className="min-w-0 flex-1"><div className="truncate text-sm font-bold">{item.name}</div><div className="text-xs text-[#8b9892]">Qty {item.quantity}</div></div><div className="text-sm font-black">₹{(item.price * item.quantity).toFixed(0)}</div></div>)}</div><div className="mt-5 flex items-center justify-between border-t border-black/7 pt-4"><span className="text-sm text-[#7b8982]">Total</span><span className="text-xl font-black text-[#1f7a55]">₹{total.toFixed(2)}</span></div></aside>; }
function EmptyCheckout({ navigate }) { return <div className="min-h-[70vh] px-4 flex items-center justify-center"><div className="glass rounded-[30px] p-10 text-center"><div className="text-2xl font-black">Your basket is empty</div><button onClick={() => navigate('/')} className="mt-5 rounded-2xl bg-[#173e2d] px-5 py-3 font-black text-white">Continue shopping</button></div></div>; }
