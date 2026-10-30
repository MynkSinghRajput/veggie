import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import axios from 'axios';
import Icon from '../components/Icon';
import { getProductImage, vegetableImages } from '../utils/visuals';

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState('products');
  const [orders, setOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const { user } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [formData, setFormData] = useState({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: '' });

  useEffect(() => {
    const load = async () => {
      if (activeTab === 'orders') {
        try {
          const response = await axios.get('http://localhost:8080/api/orders/all', { headers: { Authorization: `Bearer ${user.token}` } });
          setOrders(response.data || []);
        } catch (error) {
          console.error('Failed to fetch orders', error);
        }
      } else {
        try {
          const [productResponse, categoryResponse] = await Promise.all([
            axios.get('http://localhost:8080/api/products'),
            axios.get('http://localhost:8080/api/categories')
          ]);
          setProducts(productResponse.data || []);
          setCategories(categoryResponse.data || []);
        } catch (error) {
          console.error('Failed to fetch catalogue data', error);
        }
      }
    };

    load();
  }, [activeTab, user.token]);

  const fetchProducts = async () => {
    try { const response = await axios.get('http://localhost:8080/api/products'); setProducts(response.data || []); }
    catch (error) { console.error('Failed to fetch products', error); }
  };
  const openModal = (product = null) => {
    if (product) {
      setEditingId(product.id);
      setFormData({ name: product.name, description: product.description, price: product.price, stockQuantity: product.stockQuantity, imageUrl: product.imageUrl, categoryId: product.category?.id || '' });
    } else {
      setEditingId(null);
      setFormData({ name: '', description: '', price: '', stockQuantity: '', imageUrl: '', categoryId: categories[0]?.id || '' });
    }
    setIsModalOpen(true);
  };
  const closeModal = () => { setIsModalOpen(false); setEditingId(null); };
  const handleInputChange = (e) => setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  const handleFormSubmit = async (e) => {
    e.preventDefault();
    try {
      const config = { headers: { Authorization: `Bearer ${user.token}` } };
      if (editingId) await axios.put(`http://localhost:8080/api/products/${editingId}`, formData, config);
      else await axios.post('http://localhost:8080/api/products', formData, config);
      await fetchProducts(); closeModal();
    } catch (error) { console.error('Failed to save product', error); alert('Error saving product. Make sure all fields are filled correctly.'); }
  };
  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return;
    try { await axios.delete(`http://localhost:8080/api/products/${id}`, { headers: { Authorization: `Bearer ${user.token}` } }); fetchProducts(); }
    catch (error) { console.error('Failed to delete product', error); alert('Cannot delete product because it is part of existing orders.'); }
  };

  const totalStock = useMemo(() => products.reduce((sum, p) => sum + Number(p.stockQuantity || 0), 0), [products]);
  const lowStock = useMemo(() => products.filter(p => Number(p.stockQuantity || 0) > 0 && Number(p.stockQuantity || 0) <= 5).length, [products]);
  const outOfStock = useMemo(() => products.filter(p => Number(p.stockQuantity || 0) <= 0).length, [products]);

  return <div className="relative overflow-hidden px-4 py-8 sm:px-6 lg:px-8"><img src={vegetableImages.market} alt="" className="pointer-events-none absolute inset-0 h-full w-full object-cover opacity-[.035] blur-3xl" /><div className="relative mx-auto max-w-7xl"><div className="mb-7 flex flex-col gap-5 lg:flex-row lg:items-end lg:justify-between"><div><div className="text-[11px] font-black uppercase tracking-[.2em] text-[#769080]">Control center</div><h1 className="mt-2 text-4xl font-black tracking-[-.04em]">Admin workspace</h1><p className="mt-2 text-sm text-[#74827b]">Manage your catalogue and inspect customer orders in the same premium visual language.</p></div><div className="flex items-center gap-2 rounded-2xl bg-white/70 p-2 shadow-sm ring-1 ring-black/5"><div className="flex h-9 w-9 items-center justify-center rounded-xl bg-[#173e2d] text-[#c9ef5d]"><Icon name="user" size={17} /></div><div><div className="text-xs font-black">Administrator</div><div className="text-[10px] text-[#84938c]">Role: {user?.role || 'ADMIN'}</div></div></div></div>
    <div className="grid gap-4 sm:grid-cols-3"><Stat label="Products" value={products.length} icon="leaf" /><Stat label="Units in stock" value={totalStock} icon="package" /><Stat label="Low / out" value={`${lowStock} / ${outOfStock}`} icon="spark" /></div>

    <div className="mt-6 grid gap-6 lg:grid-cols-[220px_1fr]">
      <aside className="glass soft-card h-fit rounded-[28px] p-3 lg:sticky lg:top-24"><div className="px-3 pb-3 pt-2 text-[10px] font-black uppercase tracking-[.17em] text-[#8a9992]">Workspace</div><button onClick={() => setActiveTab('products')} className={`mb-2 flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${activeTab === 'products' ? 'bg-[#173e2d] text-white shadow-lg' : 'text-[#5f7469] hover:bg-[#eff6e9]'}`}><Icon name="leaf" size={18} /> Products</button><button onClick={() => setActiveTab('orders')} className={`flex w-full items-center gap-3 rounded-2xl px-4 py-3 text-left text-sm font-black transition ${activeTab === 'orders' ? 'bg-[#173e2d] text-white shadow-lg' : 'text-[#5f7469] hover:bg-[#eff6e9]'}`}><Icon name="package" size={18} /> Orders</button></aside>

      <section className="glass soft-card min-w-0 rounded-[30px] p-5 sm:p-7">
        {activeTab === 'products' ? <ProductInventory products={products} onAdd={() => openModal()} onEdit={openModal} onDelete={handleDelete} /> : <OrderTable orders={orders} />}
      </section>
    </div>
  </div>

  {isModalOpen && <ProductModal formData={formData} categories={categories} editingId={editingId} onChange={handleInputChange} onClose={closeModal} onSubmit={handleFormSubmit} />}
  </div>;
}

function Stat({ label, value, icon }) { return <div className="glass soft-card rounded-[24px] p-5"><div className="flex items-center justify-between"><div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#edf7e7] text-[#1f7a55]"><Icon name={icon} size={19} /></div><div className="text-2xl font-black text-[#18302a]">{value}</div></div><div className="mt-4 text-xs font-black uppercase tracking-[.14em] text-[#84938c]">{label}</div></div>; }

function ProductInventory({ products, onAdd, onEdit, onDelete }) { return <div><div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"><div><div className="text-[11px] font-black uppercase tracking-[.18em] text-[#769080]">Catalogue</div><h2 className="mt-1 text-2xl font-black">Product inventory</h2></div><button onClick={onAdd} className="inline-flex items-center justify-center gap-2 rounded-2xl bg-[#173e2d] px-4 py-3 text-sm font-black text-white"><Icon name="plus" size={17} /> Add product</button></div><div className="overflow-x-auto rounded-2xl border border-black/5"><table className="min-w-[760px] w-full text-left"><thead className="bg-[#f1f6ee]"><tr><th className="px-4 py-3 text-[10px] font-black uppercase tracking-[.12em] text-[#7a8a82]">Product</th><th className="px-4 py-3 text-[10px] font-black uppercase tracking-[.12em] text-[#7a8a82]">Category</th><th className="px-4 py-3 text-[10px] font-black uppercase tracking-[.12em] text-[#7a8a82]">Price</th><th className="px-4 py-3 text-[10px] font-black uppercase tracking-[.12em] text-[#7a8a82]">Stock</th><th className="px-4 py-3 text-right text-[10px] font-black uppercase tracking-[.12em] text-[#7a8a82]">Actions</th></tr></thead><tbody>{products.map(product => <tr key={product.id} className="border-t border-black/5 hover:bg-white/50"><td className="px-4 py-4"><div className="flex items-center gap-3"><img src={getProductImage(product)} alt={product.name} className="h-12 w-12 rounded-xl object-cover" /><div><div className="font-black text-[#18302a]">{product.name}</div><div className="mt-0.5 max-w-[250px] truncate text-xs text-[#8b9892]">{product.description || 'Fresh produce'}</div></div></div></td><td className="px-4 py-4 text-sm font-semibold text-[#66776f]">{product.category?.name || 'N/A'}</td><td className="px-4 py-4 font-black text-[#18302a]">₹{Number(product.price || 0).toFixed(2)}</td><td className="px-4 py-4"><span className={`rounded-full px-2.5 py-1 text-[10px] font-black ${Number(product.stockQuantity || 0) > 5 ? 'bg-[#edf7e7] text-[#4d775a]' : Number(product.stockQuantity || 0) > 0 ? 'bg-[#fff4e8] text-[#a46535]' : 'bg-[#fff0ed] text-[#a24e43]'}`}>{Number(product.stockQuantity || 0) > 0 ? `${product.stockQuantity} in stock` : 'Out of stock'}</span></td><td className="px-4 py-4 text-right"><div className="flex justify-end gap-2"><button onClick={() => onEdit(product)} className="rounded-xl bg-[#eef5ec] px-3 py-2 text-xs font-black text-[#39624f]">Edit</button><button onClick={() => onDelete(product.id)} className="rounded-xl bg-[#fff1ef] px-3 py-2 text-xs font-black text-[#a04e46]">Delete</button></div></td></tr>)}</tbody></table></div></div>; }

function OrderTable({ orders }) { return <div><div className="mb-6"><div className="text-[11px] font-black uppercase tracking-[.18em] text-[#769080]">Customer activity</div><h2 className="mt-1 text-2xl font-black">Orders & payments</h2><p className="mt-2 text-sm text-[#74827b]">A responsive view of customer, delivery, payment, and order status data.</p></div>{orders.length === 0 ? <div className="rounded-3xl bg-[#f1f6ee] p-10 text-center"><div className="mx-auto flex h-14 w-14 items-center justify-center rounded-2xl bg-white text-[#1f7a55]"><Icon name="package" size={23} /></div><div className="mt-4 font-black">No orders yet</div><p className="mt-2 text-sm text-[#7c8b83]">Placed customer orders will appear here.</p></div> : <div className="overflow-x-auto rounded-2xl border border-black/5"><table className="min-w-[1100px] w-full text-left"><thead className="bg-[#f1f6ee]"><tr>{['Order', 'Customer', 'Items', 'Delivery', 'Total', 'Payment', 'Status'].map(label => <th key={label} className="px-4 py-3 text-[10px] font-black uppercase tracking-[.12em] text-[#7a8a82]">{label}</th>)}</tr></thead><tbody>{orders.map(order => <tr key={order.id} className="border-t border-black/5 align-top hover:bg-white/45"><td className="px-4 py-4 font-black">#{order.id}</td><td className="px-4 py-4 text-sm"><div className="font-black">{order.deliveryName || order.user?.email || 'Guest'}</div><div className="mt-1 text-[#7c8b83]">{order.deliveryContact || 'No contact'}</div><div className="text-[#7c8b83]">{order.user?.email || 'No email'}</div></td><td className="px-4 py-4 text-sm">{order.orderItems?.length ? order.orderItems.map(item => <div key={item.id} className="mb-2 last:mb-0"><div className="font-bold">{item.product?.name || 'Unknown'}</div><div className="text-[#7c8b83]">Qty {item.quantity} · ₹{Number(item.priceAtPurchase || 0).toFixed(2)}</div></div>) : 'No items'}</td><td className="max-w-[240px] px-4 py-4 text-sm leading-5 text-[#6f7e77]">{order.houseNumber}, {order.street}<br />{order.area}, {order.city}<br />{order.state} — {order.pincode}{order.deliveryInstructions && <div className="mt-2"><span className="font-black text-[#18302a]">Note:</span> {order.deliveryInstructions}</div>}</td><td className="px-4 py-4 font-black">₹{Number(order.totalAmount || 0).toFixed(2)}</td><td className="px-4 py-4 text-sm">{order.payment ? <><div><span className="font-black">{order.payment.status}</span></div><div className="mt-1 break-all text-[#7c8b83]">{order.payment.transactionId}</div><div className="mt-1 text-[#7c8b83]">₹{Number(order.payment.amount || 0).toFixed(2)}</div></> : <span className="text-[#8b9892]">No payment data</span>}</td><td className="px-4 py-4"><span className="rounded-full bg-[#edf7e7] px-2.5 py-1 text-[10px] font-black text-[#4d775a]">{order.status}</span></td></tr>)}</tbody></table></div>}</div>; }

function ProductModal({ formData, categories, editingId, onChange, onClose, onSubmit }) { return <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#10271dcc] p-4 backdrop-blur-sm"><div className="glass max-h-[92vh] w-full max-w-xl overflow-y-auto rounded-[30px] p-6 sm:p-8"><div className="flex items-start justify-between"><div><div className="text-[10px] font-black uppercase tracking-[.17em] text-[#789083]">Catalogue editor</div><h2 className="mt-1 text-2xl font-black">{editingId ? 'Edit product' : 'Add new product'}</h2></div><button onClick={onClose} className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-[#6d7d75]"><Icon name="close" size={18} /></button></div><form onSubmit={onSubmit} className="mt-6 space-y-4"><Field label="Name" name="name" value={formData.name} onChange={onChange} required /><div className="grid grid-cols-2 gap-4"><Field label="Price (₹)" name="price" type="number" step="0.01" value={formData.price} onChange={onChange} required /><Field label="Stock quantity" name="stockQuantity" type="number" value={formData.stockQuantity} onChange={onChange} required /></div><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-[#71847a]">Category</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><select name="categoryId" value={formData.categoryId} onChange={onChange} required className="w-full bg-transparent text-sm outline-none"><option value="" disabled>Select a category</option>{categories.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}</select></div></label><Field label="Image URL" name="imageUrl" value={formData.imageUrl} onChange={onChange} required /><label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-[#71847a]">Description</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><textarea name="description" value={formData.description} onChange={onChange} required rows="4" className="w-full resize-none bg-transparent text-sm outline-none" /></div></label><div className="flex justify-end gap-2 border-t border-black/7 pt-4"><button type="button" onClick={onClose} className="rounded-2xl bg-white px-4 py-3 text-sm font-black text-[#5f7469]">Cancel</button><button type="submit" className="rounded-2xl bg-[#173e2d] px-5 py-3 text-sm font-black text-white">{editingId ? 'Update product' : 'Save product'}</button></div></form></div></div>; }
function Field({ label, name, type = 'text', step, value, onChange, required }) { return <label className="block"><span className="mb-2 block text-xs font-black uppercase tracking-[.12em] text-[#71847a]">{label}</span><div className="input-shell rounded-2xl border border-black/7 bg-white/72 px-4 py-3"><input name={name} type={type} step={step} value={value} onChange={onChange} required={required} className="w-full bg-transparent text-sm outline-none" /></div></label>; }
