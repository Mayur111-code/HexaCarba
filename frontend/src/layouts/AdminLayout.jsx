import { useState } from 'react';
import { Link, NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import {
  HiOutlineHome, HiOutlineUsers, HiOutlineCurrencyDollar, HiOutlineTag,
  HiOutlineCube, HiOutlineOfficeBuilding, HiOutlineMail, HiOutlineUserCircle,
  HiOutlineLogout, HiOutlineMenu, HiOutlineX, HiOutlineSparkles,
} from 'react-icons/hi';

const navItems = [
  { to: '/admin/dashboard', label: 'Dashboard', icon: HiOutlineHome },
  { to: '/admin/employees', label: 'Employees', icon: HiOutlineUsers },
  { to: '/admin/salaries', label: 'Salary', icon: HiOutlineCurrencyDollar },
  { to: '/admin/categories', label: 'Categories', icon: HiOutlineTag },
  { to: '/admin/products', label: 'Products', icon: HiOutlineCube },
  { to: '/admin/customers', label: 'Customers', icon: HiOutlineOfficeBuilding },
  { to: '/admin/contacts', label: 'Contacts', icon: HiOutlineMail },
];

const AdminLayout = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  return (
    <div className="admin-shell min-h-screen flex bg-slate-50 text-slate-900">
      {sidebarOpen && <div className="fixed inset-0 z-40 bg-slate-950/45 backdrop-blur-sm lg:hidden" onClick={() => setSidebarOpen(false)} />}

      <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-slate-950 text-white shadow-2xl transition-transform duration-300 lg:sticky lg:top-0 lg:h-screen lg:shadow-none ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}>
        <div className="flex h-20 items-center justify-between border-b border-white/10 px-6">
          <Link to="/admin/dashboard" className="flex items-center gap-3 font-bold tracking-tight">
            <span className="grid h-9 w-9 place-items-center rounded-xl bg-gradient-to-br from-blue-400 to-indigo-600 shadow-lg shadow-blue-900/40"><HiOutlineSparkles className="h-5 w-5" /></span>
            <span className="text-lg">HEXACARB<span className="text-blue-400">.</span></span>
          </Link>
          <button aria-label="Close navigation" className="rounded-lg p-2 hover:bg-white/10 lg:hidden" onClick={() => setSidebarOpen(false)}><HiOutlineX className="h-5 w-5" /></button>
        </div>

        <nav aria-label="Admin navigation" className="mt-7 space-y-1.5 px-4">
          <p className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.18em] text-slate-500">Workspace</p>
          {navItems.map((item) => (
            <NavLink key={item.to} to={item.to} onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3.5 py-3 text-sm font-medium transition-all ${isActive ? 'bg-blue-500 text-white shadow-lg shadow-blue-950/30' : 'text-slate-400 hover:bg-white/8 hover:text-white'}`}>
              <item.icon className="h-5 w-5" /> {item.label}
            </NavLink>
          ))}
        </nav>

        <div className="absolute bottom-0 left-0 right-0 border-t border-white/10 bg-slate-950 p-4">
          <NavLink to="/admin/profile" onClick={() => setSidebarOpen(false)} className={({ isActive }) => `flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${isActive ? 'bg-blue-500 text-white' : 'text-slate-400 hover:bg-white/8 hover:text-white'}`}>
            <HiOutlineUserCircle className="h-5 w-5" /> {user?.name || 'Profile'}
          </NavLink>
          <button onClick={handleLogout} className="mt-1 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-slate-400 transition-colors hover:bg-white/8 hover:text-white"><HiOutlineLogout className="h-5 w-5" /> Logout</button>
        </div>
      </aside>

      <div className="flex min-w-0 flex-1 flex-col">
        <header className="flex h-20 items-center justify-between border-b border-slate-200/80 bg-white/85 px-4 backdrop-blur-xl sm:px-6 lg:px-9">
          <button aria-label="Open navigation" className="rounded-lg p-2 text-slate-700 hover:bg-slate-100 lg:hidden" onClick={() => setSidebarOpen(true)}><HiOutlineMenu className="h-6 w-6" /></button>
          <div className="ml-auto flex items-center gap-3">
            <div className="hidden h-9 w-9 place-items-center rounded-full bg-blue-50 text-sm font-semibold text-blue-700 sm:grid">{user?.name?.charAt(0)?.toUpperCase() || 'A'}</div>
            <span className="hidden text-sm text-slate-600 sm:block"><span className="font-semibold text-slate-800">{user?.name || 'Administrator'}</span><span className="mx-1.5 text-slate-300">/</span><span className="capitalize">{user?.role || 'admin'}</span></span>
          </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 lg:p-9"><Outlet /></main>
      </div>
    </div>
  );
};

export default AdminLayout;
