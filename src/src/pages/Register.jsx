import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { vegetableImages } from '../utils/visuals';

export default function Register() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      await axios.post('http://localhost:8080/api/auth/register', { name, email, password });
      navigate('/login');
    } catch (err) {
      setError(err.response?.data || 'Registration failed.');
      setIsSubmitting(false);
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f7ef] px-4 py-6 sm:px-8">
      <img src={vegetableImages.market} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 blur-3xl scale-110" />
      <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(239,247,236,.95),rgba(231,241,225,.85))]" />
      <Link to="/" className="relative z-10 mx-auto flex w-fit items-center gap-3 rounded-2xl bg-white/60 px-4 py-2 backdrop-blur-xl">
        <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-[#173e2d] text-[#c9ef5d]"><Icon name="leaf" size={20} /></div>
        <div><div className="text-[10px] font-black uppercase tracking-[.18em] text-[#769080]">Fresh marketplace</div><div className="font-black text-[#18302a]">FreshVeggie</div></div>
      </Link>

      <div className="relative z-10 mx-auto flex min-h-[calc(100vh-84px)] max-w-lg items-center justify-center py-10">
        <div className="glass w-full rounded-[34px] p-7 sm:p-9">
          <div className="mb-7"><div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173e2d] text-[#d3f16d]"><Icon name="spark" size={22} /></div><h1 className="text-3xl font-black tracking-tight">Create your FreshVeggie account</h1><p className="mt-2 text-sm leading-6 text-[#74827b]">A smoother basket, saved details, and a polished checkout from your first order.</p></div>
          {error && <div className="mb-5 rounded-2xl bg-[#fff3f1] px-4 py-3 text-sm font-semibold text-[#a04e46]">{error}</div>}
          <form onSubmit={handleRegister} className="space-y-4">
            {[
              ['Full name', name, setName, 'text', 'Your name'],
              ['Email', email, setEmail, 'email', 'you@example.com'],
              ['Password', password, setPassword, 'password', 'At least 6 characters'],
            ].map(([label, value, setter, type, placeholder]) => (
              <label key={label} className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">{label}</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><input required minLength={label === 'Password' ? 6 : undefined} type={type} value={value} onChange={(e) => setter(e.target.value)} placeholder={placeholder} className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" /></div></label>
            ))}
            <button disabled={isSubmitting} className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-4 text-sm font-black text-white transition hover:-translate-y-0.5 disabled:opacity-60">{isSubmitting ? 'Creating account' : 'Create account'} <Icon name="arrowRight" size={17} /></button>
          </form>
          <p className="mt-6 text-center text-sm text-[#73827b]">Already have an account? <Link to="/login" className="font-black text-[#1f7a55]">Sign in</Link></p>
        </div>
      </div>
    </div>
  );
}
