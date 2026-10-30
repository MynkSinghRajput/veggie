import { useState } from 'react';
import axios from 'axios';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import Icon from '../components/Icon';
import { vegetableImages } from '../utils/visuals';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const token = searchParams.get('token');

  const handleSubmit = async (e) => {
    e.preventDefault(); setMessage(''); setError('');
    if (password !== confirmPassword) { setError('Passwords do not match.'); return; }
    try {
      const response = await axios.post('http://localhost:8080/api/auth/reset-password', { token, newPassword: password });
      setMessage(response.data);
      setTimeout(() => navigate('/login'), 2000);
    } catch (err) { setError(err.response?.data || 'Unable to reset password. Please try again.'); }
  };

  return <div className="relative min-h-screen overflow-hidden bg-[#f3f7ef] px-4 py-6 sm:px-8"><img src={vegetableImages.peppers} alt="" className="absolute inset-0 h-full w-full object-cover opacity-26 blur-3xl scale-110" /><div className="absolute inset-0 bg-[#edf6e8]/88" /><div className="relative z-10 flex min-h-[calc(100vh-84px)] items-center justify-center"><div className="glass w-full max-w-md rounded-[34px] p-7 sm:p-9"><Link to="/" className="mb-7 flex items-center gap-3"><div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-[#173e2d] text-[#c9ef5d]"><Icon name="leaf" size={20} /></div><span className="font-black">FreshVeggie</span></Link><div className="mb-5 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#eef7ef] text-[#1f7a55]"><Icon name="lock" size={22} /></div><h1 className="text-3xl font-black tracking-tight">Create a new password</h1><p className="mt-2 text-sm leading-6 text-[#74827b]">Use a secure password you will remember. The old password will no longer work.</p><form onSubmit={handleSubmit} className="mt-7 space-y-4"><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">New password</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 6 characters" minLength={6} required className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" /></div></label><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">Confirm password</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><input type="password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Repeat your password" minLength={6} required className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" /></div></label><button className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-4 text-sm font-black text-white">Update password <Icon name="check" size={17} /></button></form>{message && <div className="mt-4 rounded-2xl bg-[#edf7e7] px-4 py-3 text-sm font-semibold text-[#326241]">{message}</div>}{error && <div className="mt-4 rounded-2xl bg-[#fff3f1] px-4 py-3 text-sm font-semibold text-[#a04e46]">{error}</div>}<button onClick={() => navigate('/login')} className="mt-5 flex w-full items-center justify-center gap-2 text-sm font-bold text-[#1f7a55]"><Icon name="arrowLeft" size={16} /> Back to login</button></div></div></div>;
}
