import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Icon from '../components/Icon';
import { vegetableImages } from '../utils/visuals';

export default function Payment() {
  const location = useLocation();
  const navigate = useNavigate();
  const { cart, getCartTotal, clearCart } = useCart();
  const { user } = useAuth();
  const deliveryDetails = location.state?.deliveryDetails;
  const [isProcessing, setIsProcessing] = useState(false);

  if (!deliveryDetails) return <MissingDetails navigate={navigate} />;

  const handlePayment = async () => {
    if (!user) { navigate('/login'); return; }
    if (!cart.length) { navigate('/cart'); return; }
    setIsProcessing(true);
    const orderRequest = {
      items: cart.map(item => ({ productId: item.id, quantity: item.quantity })),
      deliveryName: deliveryDetails.fullName,
      deliveryContact: deliveryDetails.contactNumber,
      houseNumber: deliveryDetails.houseNumber,
      street: deliveryDetails.street,
      area: deliveryDetails.area,
      city: deliveryDetails.city,
      state: deliveryDetails.state,
      pincode: deliveryDetails.pincode,
      deliveryInstructions: deliveryDetails.instructions || ''
    };
    try {
      const response = await axios.post('http://localhost:8080/api/orders', orderRequest, { headers: { Authorization: `Bearer ${user.token}` } });
      clearCart();
      navigate('/order-confirmation', { state: { order: response.data } });
    } catch (error) {
      console.error('Payment/Order failed:', error);
      alert(error.response?.data || 'Payment failed. Please try again.');
    } finally { setIsProcessing(false); }
  };

  return <div className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8"><img src={vegetableImages.mixed} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.04] blur-3xl" /><div className="relative mx-auto max-w-6xl"><CheckoutSteps current={2} /><div className="mt-8 grid gap-6 lg:grid-cols-[1fr_380px]">
    <section className="glass soft-card rounded-[30px] p-7 sm:p-8">
      <div className="flex items-start justify-between gap-4"><div><div className="text-[11px] font-black uppercase tracking-[.2em] text-[#769080]">Final step</div><h1 className="mt-2 text-3xl font-black tracking-tight">Review and place your order</h1><p className="mt-2 text-sm leading-6 text-[#74827b]">Your backend order flow stays exactly the same; this screen simply gives it a premium finish.</p></div><div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#edf7e7] text-[#1f7a55]"><Icon name="shield" size={22} /></div></div>
      <div className="mt-7 rounded-3xl border border-[#dce9d6] bg-[#f3f8ef] p-5"><div className="flex items-start gap-4"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-white text-[#1f7a55] shadow-sm"><Icon name="package" size={21} /></div><div><div className="text-sm font-black">Online payment</div><div className="mt-1 text-xs leading-5 text-[#7c8b83]">Securely place the order using the existing backend integration.</div></div></div></div>
      <div className="mt-5 rounded-3xl border border-black/7 bg-white/60 p-5"><div className="mb-3 text-xs font-black uppercase tracking-[.14em] text-[#71847a]">Delivering to</div><div className="text-sm font-black">{deliveryDetails.fullName}</div><div className="mt-2 text-sm leading-6 text-[#6f7e77]">{deliveryDetails.contactNumber}<br />{deliveryDetails.houseNumber}, {deliveryDetails.street}<br />{deliveryDetails.area}, {deliveryDetails.city}<br />{deliveryDetails.state} — {deliveryDetails.pincode}</div>{deliveryDetails.instructions && <div className="mt-3 border-t border-black/7 pt-3 text-xs text-[#7b8982]"><span className="font-black">Instruction:</span> {deliveryDetails.instructions}</div>}</div>
      <button onClick={handlePayment} disabled={isProcessing} className="mt-6 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-4 text-sm font-black text-white shadow-xl shadow-[#173e2d]/10 transition hover:-translate-y-0.5 disabled:cursor-wait disabled:opacity-60">{isProcessing ? <><Icon name="spark" size={18} /> Processing your order</> : <>Place order · ₹{getCartTotal().toFixed(2)} <Icon name="arrowRight" size={17} /></>}</button>
      <button onClick={() => navigate('/delivery-details', { state: { deliveryDetails } })} className="mt-4 w-full text-center text-sm font-black text-[#1f7a55]">Edit delivery details</button>
    </section>

    <aside className="glass soft-card h-fit rounded-[30px] p-6"><div className="flex items-center justify-between"><h2 className="text-lg font-black">Order total</h2><span className="rounded-full bg-[#173e2d] px-2.5 py-1 text-[10px] font-black uppercase tracking-[.13em] text-white">Secure</span></div><div className="mt-6 space-y-3 border-b border-black/7 pb-5 text-sm"><div className="flex justify-between"><span className="text-[#7b8982]">Fresh produce</span><span className="font-bold">₹{getCartTotal().toFixed(2)}</span></div><div className="flex justify-between"><span className="text-[#7b8982]">Delivery</span><span className="font-bold text-[#1f7a55]">Free</span></div></div><div className="mt-5 flex items-end justify-between"><span className="text-sm font-bold text-[#7b8982]">Total</span><span className="text-3xl font-black text-[#18302a]">₹{getCartTotal().toFixed(2)}</span></div><div className="mt-6 rounded-2xl bg-[#edf7e7] p-4 text-xs leading-5 text-[#557363]"><div className="flex items-center gap-2 font-black text-[#355c4b]"><Icon name="shield" size={16} /> Protected order flow</div><div className="mt-2">Your existing authenticated API request remains in place.</div></div></aside>
  </div></div></div>;
}

function CheckoutSteps({ current }) { const steps = ['Basket', 'Delivery', 'Place order']; return <div className="glass mx-auto flex max-w-3xl items-center justify-between rounded-2xl px-4 py-3"><div className="flex w-full items-center justify-between">{steps.map((step, index) => <div key={step} className="flex items-center gap-3"><div className={`flex h-9 w-9 items-center justify-center rounded-full text-xs font-black ${index <= current ? 'bg-[#173e2d] text-white' : 'bg-[#edf2ec] text-[#8c9992]'}`}>{index < current ? <Icon name="check" size={15} /> : index + 1}</div><span className={`hidden text-xs font-black sm:block ${index <= current ? 'text-[#355c4b]' : 'text-[#98a39e]'}`}>{step}</span>{index < steps.length - 1 && <div className={`mx-1 h-px w-8 sm:w-24 ${index < current ? 'bg-[#9acb6a]' : 'bg-black/7'}`} />}</div>)}</div></div>; }
function MissingDetails({ navigate }) { return <div className="min-h-[70vh] flex items-center justify-center px-4"><div className="glass rounded-[30px] p-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-[#f5eee9] text-[#b16b40]"><Icon name="mapPin" size={23} /></div><h2 className="mt-5 text-2xl font-black">Delivery details are missing</h2><p className="mt-2 text-sm text-[#7b8982]">Please complete the delivery step before placing your order.</p><button onClick={() => navigate('/delivery-details')} className="mt-6 rounded-2xl bg-[#173e2d] px-5 py-3 text-sm font-black text-white">Enter delivery details</button></div></div>; }
