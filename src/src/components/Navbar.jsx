import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import Icon from './Icon';
import logo from '../assets/logo.png';

export default function Navbar() {
  const { user, logout } = useAuth();
  const { cart } = useCart();
  const navigate = useNavigate();
  const [searchKeyword, setSearchKeyword] = useState('');
  const [open, setOpen] = useState(false);
  const [cartBump, setCartBump] = useState(false);
  const cartItemCount = cart.reduce((total, item) => total + item.quantity, 0);

  useEffect(() => {
    const handleBump = () => {
      setCartBump(true);
      window.setTimeout(() => setCartBump(false), 420);
    };
    window.addEventListener('veggie-cart-added', handleBump);
    return () => window.removeEventListener('veggie-cart-added', handleBump);
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    const query = searchKeyword.trim();
    navigate(query ? `/?search=${encodeURIComponent(query)}` : '/');
    setOpen(false);
  };

  return (
    <header className="sticky top-0 z-50 px-3 pt-3 sm:px-5">
      <nav className="glass mx-auto flex max-w-7xl items-center gap-3 rounded-2xl px-3 py-3 sm:px-5">
        <Link to="/" className="flex min-w-fit items-center gap-3" onClick={() => setOpen(false)}>
          <div className="flex h-11 w-11 items-center justify-center overflow-hidden rounded-xl bg-[#eff7e8] p-1.5 shadow-inner">
            <img src={logo} alt="FreshVeggie" className="h-full w-full object-contain" />
          </div>
          <div className="hidden sm:block">
            <div className="text-[11px] font-semibold uppercase tracking-[.24em] text-[#6a7d71]">Fresh marketplace</div>
            <div className="text-lg font-black tracking-tight text-[#18302a]">FreshVeggie</div>
          </div>
        </Link>

        <form onSubmit={handleSearch} className="mx-1 hidden min-w-0 flex-1 md:block">
          <div className="input-shell flex items-center gap-2 rounded-xl border border-black/5 bg-white/78 px-3.5 py-2.5">
            <Icon name="search" size={19} className="text-[#719083]" />
            <input
              aria-label="Search vegetables"
              value={searchKeyword}
              onChange={(e) => setSearchKeyword(e.target.value)}
              placeholder="Search fresh vegetables"
              className="w-full bg-transparent text-sm text-[#18302a] outline-none placeholder:text-[#9aa9a1]"
            />
            <kbd className="hidden rounded-md border border-black/5 bg-white px-1.5 py-0.5 text-[10px] font-semibold text-[#8a9a93] lg:inline">/</kbd>
          </div>
        </form>

        <div className="ml-auto hidden items-center gap-1.5 sm:flex">
          <Link to="/" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#53675e] transition hover:bg-[#eef5ea] hover:text-[#18302a]">Shop</Link>
          {user?.role === 'ADMIN' && (
            <Link to="/admin" className="rounded-xl px-3 py-2 text-sm font-semibold text-[#53675e] transition hover:bg-[#eef5ea] hover:text-[#18302a]">Admin</Link>
          )}
          <Link
            id="cart-target"
            to="/cart"
            className={`relative flex items-center gap-2 rounded-xl bg-[#173e2d] px-3.5 py-2.5 text-sm font-semibold text-white transition hover:bg-[#0f3122] ${cartBump ? 'cart-bump' : ''}`}
          >
            <Icon name="cart" size={18} />
            <span className="hidden lg:inline">Cart</span>
            {cartItemCount > 0 && (
              <span className="absolute -right-2 -top-2 flex h-5 min-w-5 items-center justify-center rounded-full bg-[#c9ef5d] px-1 text-[10px] font-black text-[#173e2d] shadow">{cartItemCount}</span>
            )}
          </Link>
          {user ? (
            <button onClick={logout} className="ml-1 flex items-center gap-2 rounded-xl border border-black/8 bg-white/70 px-3.5 py-2.5 text-sm font-semibold text-[#486057] transition hover:bg-white">
              <Icon name="user" size={17} />
              Sign out
            </button>
          ) : (
            <Link to="/login" className="ml-1 rounded-xl border border-[#1f7a55]/15 bg-[#eef7ef] px-3.5 py-2.5 text-sm font-semibold text-[#1f7a55] transition hover:bg-[#e4f3e7]">Login</Link>
          )}
        </div>

        <button
          onClick={() => setOpen((value) => !value)}
          className="flex h-11 w-11 items-center justify-center rounded-xl border border-black/8 bg-white/72 text-[#24473a] sm:hidden"
          aria-label="Open menu"
        >
          <Icon name={open ? 'close' : 'menu'} size={20} />
        </button>
      </nav>

      {open && (
        <div className="glass mx-auto mt-2 max-w-7xl rounded-2xl p-3 sm:hidden">
          <form onSubmit={handleSearch} className="mb-3">
            <div className="input-shell flex items-center gap-2 rounded-xl border border-black/5 bg-white/80 px-3 py-2.5">
              <Icon name="search" size={18} className="text-[#719083]" />
              <input value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} placeholder="Search vegetables" className="w-full bg-transparent text-sm outline-none" />
            </div>
          </form>
          <div className="grid grid-cols-2 gap-2">
            <Link to="/" onClick={() => setOpen(false)} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold">Shop</Link>
            <Link to="/cart" onClick={() => setOpen(false)} className="rounded-xl bg-[#173e2d] px-4 py-3 text-sm font-semibold text-white">Cart ({cartItemCount})</Link>
            {user?.role === 'ADMIN' && <Link to="/admin" onClick={() => setOpen(false)} className="rounded-xl bg-white px-4 py-3 text-sm font-semibold">Admin</Link>}
            {user ? (
              <button onClick={() => { logout(); setOpen(false); }} className="rounded-xl bg-white px-4 py-3 text-left text-sm font-semibold">Sign out</button>
            ) : (
              <Link to="/login" onClick={() => setOpen(false)} className="rounded-xl bg-[#eef7ef] px-4 py-3 text-sm font-semibold text-[#1f7a55]">Login</Link>
            )}
          </div>
        </div>
      )}
    </header>
  );
}
