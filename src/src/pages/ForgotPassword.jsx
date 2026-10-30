import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate } from 'react-router-dom';
import Icon from '../components/Icon';
import { vegetableImages } from '../utils/visuals';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    try {
      const response = await axios.post('http://localhost:8080/api/auth/forgot-password', { email });
      const token = response.data.replace('Password reset token generated: ', '').trim();
      if (!token) { setError('Unable to generate reset token.'); return; }
      navigate(`/reset-password?token=${encodeURIComponent(token)}`);
    } catch (err) { setError(err.response?.data || 'Something went wrong. Please try again.'); }
  };

  return <AuthUtilityShell title="Reset your password" text="Enter your registered email and we will start the secure reset flow." icon="lock" image={vegetableImages.leafy}>
    <form onSubmit={handleSubmit} className="space-y-4">
      <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">Email</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" required className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" /></div></label>
      <button className="flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-4 text-sm font-black text-white">Continue <Icon name="arrowRight" size={17} /></button>
    </form>
    {message && <Alert tone="success">{message}</Alert>}
    {error && <Alert tone="error">{error}</Alert>}
    <button onClick={() => navigate('/login')} className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-bold text-[#1f7a55]"><Icon name="arrowLeft" size={16} /> Back to login</button>
  </AuthUtilityShell>;
}

function Alert({ tone, children }) { return <div className={`mt-4 rounded-2xl px-4 py-3 text-sm font-semibold ${tone === 'success' ? 'bg-[#edf7e7] text-[#326241]' : 'bg-[#fff3f1] text-[#a04e46]'}`}>{children}</div>; }

function AuthUtilityShell({ title, text, icon, image, children }) {
  return <div className="relative min-h-screen overflow-hidden bg-[#f3f7ef] px-4 py-6 sm:px-8"><img src={image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-30 blur-3xl scale-110" /><div className="absolute inset-0 bg-[#edf6e8]/85" /><div className="relative z-10 flex min-h-[calc(100vh-84px)] items-center justify-center"><div className="glass w-full max-w-md rounded-[34px] p-7 sm:p-9"><Link to="/" className="mb-7 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173e2d] text-[#c9ef5d]"><Icon name="leaf" size={20} /></div><span className="font-black">FreshVeggie</span></Link><div className="mb-6 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7ef] text-[#1f7a55]"><Icon name={icon} size={22} /></div><h1 className="text-3xl font-black tracking-tight">{title}</h1><p className="mt-2 text-sm leading-6 text-[#74827b]">{text}</p><div className="mt-7">{children}</div></div></div></div>;
}
