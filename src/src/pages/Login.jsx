import { useState } from 'react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';
import { Link } from 'react-router-dom';
import Icon from '../components/Icon';
import { vegetableImages } from '../utils/visuals';

export default function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { login } = useAuth();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError('');
    setIsSubmitting(true);
    try {
      const response = await axios.post('http://localhost:8080/api/auth/login', { email, password });
      window.setTimeout(() => login(response.data.token, response.data.role), 480);
    } catch (err) {
      setIsSubmitting(false);
      setError(err.response?.data || 'Invalid email or password.');
    }
  };

  return (
    <div className="relative min-h-screen overflow-hidden bg-[#f3f7ef] px-4 py-6 sm:px-8">
      <div className="absolute inset-0 overflow-hidden">
        <img src={vegetableImages.market} alt="" className="absolute inset-0 h-full w-full object-cover opacity-55 blur-2xl scale-110" />
        <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(232,243,223,.96),rgba(239,247,236,.82),rgba(206,227,196,.72))]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(255,255,255,.7),transparent_25%),radial-gradient(circle_at_80%_75%,rgba(183,223,88,.2),transparent_25%)]" />
      </div>

      <Link to="/" className="relative z-20 mx-auto flex w-fit items-center gap-3 rounded-2xl border border-white/70 bg-white/50 px-4 py-2 backdrop-blur-xl">
        <div className="h-10 w-10 overflow-hidden rounded-xl bg-[#eef7e8] p-1.5"><img src={vegetableImages.mixed} alt="FreshVeggie" className="h-full w-full rounded-lg object-cover" /></div>
        <div><div className="text-[10px] font-black uppercase tracking-[.18em] text-[#769080]">Fresh marketplace</div><div className="font-black tracking-tight text-[#18302a]">FreshVeggie</div></div>
      </Link>

      {[
        [vegetableImages.tomatoes, 'left-[5%] top-[22%]', 'float-slow', 'h-28 w-28 lg:h-40 lg:w-40'],
        [vegetableImages.carrots, 'right-[6%] top-[16%]', 'float-slower', 'h-32 w-32 lg:h-44 lg:w-44'],
        [vegetableImages.broccoli, 'left-[8%] bottom-[12%]', 'float-slower', 'h-32 w-32 lg:h-48 lg:w-48'],
        [vegetableImages.peppers, 'right-[5%] bottom-[9%]', 'float-spin', 'h-28 w-28 lg:h-40 lg:w-40'],
      ].map(([src, position, animation, size], index) => (
        <div key={index} className={`absolute ${position} ${animation} ${size} overflow-hidden rounded-[30px] border border-white/80 bg-white/25 p-2 shadow-[0_24px_60px_rgba(51,93,65,.13)] backdrop-blur-xl`}>
          <img src={src} alt="" className="h-full w-full rounded-[23px] object-cover" />
        </div>
      ))}

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-84px)] max-w-7xl items-center gap-10 lg:grid-cols-[1.05fr_.95fr]">
        <div className="hidden lg:block">
          <div className="max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-white/60 px-3 py-2 text-[11px] font-black uppercase tracking-[.2em] text-[#527166] shadow-sm backdrop-blur">A better basket starts here</div>
            <h1 className="mt-6 text-6xl font-black leading-[1.02] tracking-[-.05em] text-[#18302a]">Fresh food should feel <span className="text-[#1f7a55]">good to shop.</span></h1>
            <p className="mt-6 max-w-lg text-lg leading-8 text-[#64756d]">Sign in to save your basket, move through checkout faster, and keep every order in one polished place.</p>
            <div className="mt-8 flex gap-3">
              <div className="glass rounded-2xl px-4 py-3"><div className="text-xs font-black">Fresh-first</div><div className="mt-1 text-[11px] text-[#7e8e86]">Thoughtful produce selection</div></div>
              <div className="glass rounded-2xl px-4 py-3"><div className="text-xs font-black">Smooth flow</div><div className="mt-1 text-[11px] text-[#7e8e86]">Fast shopping experience</div></div>
            </div>
          </div>
        </div>

        <div className="mx-auto w-full max-w-md">
          <div className="glass rounded-[34px] p-6 shadow-[0_35px_90px_rgba(44,91,65,.17)] sm:p-8">
            <div className="mb-7">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-2xl bg-[#173e2d] text-[#d3f16d]"><Icon name="leaf" size={23} /></div>
              <h2 className="text-3xl font-black tracking-tight text-[#18302a]">Welcome back</h2>
              <p className="mt-2 text-sm leading-6 text-[#74827b]">Sign in to continue to your fresh basket.</p>
            </div>

            {error && <div className="mb-5 rounded-2xl border border-[#e2bcb7] bg-[#fff3f1] px-4 py-3 text-sm font-semibold text-[#a04e46]">{error}</div>}

            <form onSubmit={handleLogin} className="space-y-4">
              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">Email</span>
                <div className="input-shell flex items-center gap-3 rounded-2xl border border-black/7 bg-white/72 px-4 py-3">
                  <Icon name="user" size={19} className="text-[#86a095]" />
                  <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" />
                </div>
              </label>

              <label className="block">
                <span className="mb-2 block text-xs font-black uppercase tracking-[.14em] text-[#71847a]">Password</span>
                <div className="input-shell flex items-center gap-3 rounded-2xl border border-black/7 bg-white/72 px-4 py-3">
                  <Icon name="lock" size={19} className="text-[#86a095]" />
                  <input type={showPassword ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} placeholder="Enter your password" className="w-full bg-transparent text-sm outline-none placeholder:text-[#a0ada6]" />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="text-[#72847b] hover:text-[#18302a]" aria-label={showPassword ? 'Hide password' : 'Show password'}><Icon name={showPassword ? 'eyeOff' : 'eye'} size={18} /></button>
                </div>
              </label>

              <div className="flex items-center justify-between pt-1 text-xs">
                <label className="flex items-center gap-2 font-semibold text-[#72847b]"><input type="checkbox" className="h-4 w-4 rounded border-black/15 accent-[#1f7a55]" /> Keep me signed in</label>
                <Link to="/forgot-password" className="font-bold text-[#1f7a55] hover:underline">Forgot password?</Link>
              </div>

              <button type="submit" disabled={isSubmitting} className={`mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-5 py-4 text-sm font-black text-white shadow-[0_15px_35px_rgba(23,62,45,.2)] transition hover:-translate-y-0.5 hover:bg-[#0d3020] disabled:cursor-wait ${isSubmitting ? 'login-transition' : ''}`}>
                {isSubmitting ? <><Icon name="spark" size={18} /> Entering FreshVeggie</> : <>Sign in <Icon name="arrowRight" size={18} /></>}
              </button>
            </form>

            <div className="my-6 flex items-center gap-3"><div className="h-px flex-1 bg-black/7" /><span className="text-[10px] font-black uppercase tracking-[.18em] text-[#9aaa9f]">New here</span><div className="h-px flex-1 bg-black/7" /></div>
            <Link to="/register" className="flex items-center justify-center rounded-2xl border border-[#1f7a55]/12 bg-white/70 px-4 py-3.5 text-sm font-black text-[#355e4d] transition hover:bg-white">Create your account</Link>
          </div>
        </div>
      </div>
    </div>
  );
}
