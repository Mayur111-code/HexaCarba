import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { dashboardService } from '../../services/dashboardService';
import { HiOutlineUsers, HiOutlineTag, HiOutlineCube, HiOutlineOfficeBuilding, HiOutlineMail, HiOutlineCurrencyDollar, HiOutlineClock } from 'react-icons/hi';
import Loader from '../../components/common/Loader';
import StatusBadge from '../../components/common/StatusBadge';

const StatCard = ({ title, value, sub, icon: Icon, color }) => (
  <div className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50 transition-transform duration-200 hover:-translate-y-0.5 hover:shadow-md">
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0"><p className="text-sm font-medium text-slate-500">{title}</p><p className="mt-1 text-2xl font-bold tracking-tight text-slate-900">{value}</p>{sub && <p className="mt-0.5 text-xs text-slate-400">{sub}</p>}</div>
      <div className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-xl ${color}`}><Icon className="h-6 w-6" /></div>
    </div>
  </div>
);

const RecentPanel = ({ title, to, children }) => (
  <section className="rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm shadow-slate-200/50">
    <div className="mb-4 flex items-center justify-between"><h2 className="flex items-center gap-2 font-semibold text-slate-800"><HiOutlineClock className="h-5 w-5 text-blue-600" /> {title}</h2><Link to={to} className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">View all</Link></div>
    <div className="space-y-1">{children}</div>
  </section>
);

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recent, setRecent] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [statsRes, recentRes] = await Promise.all([dashboardService.getStats(), dashboardService.getRecent()]);
        setStats(statsRes.data.data);
        setRecent(recentRes.data.data);
      } catch { /* API interceptor handles feedback */ } finally { setLoading(false); }
    };
    fetchData();
  }, []);

  if (loading) return <Loader />;

  return (
    <div>
      <div className="mb-7 flex flex-col gap-1 sm:flex-row sm:items-end sm:justify-between"><div><p className="text-sm font-medium text-blue-600">Overview</p><h1 className="text-3xl font-bold tracking-tight text-slate-900">Dashboard</h1><p className="mt-1 text-sm text-slate-500">A clear snapshot of your business workspace.</p></div><p className="text-sm text-slate-400">Updated when this page loads</p></div>
      {stats && <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        <StatCard title="Total Employees" value={stats.employees.total} sub={`${stats.employees.active} active`} icon={HiOutlineUsers} color="bg-blue-100 text-blue-600" />
        <StatCard title="Categories" value={stats.categories.total} sub={`${stats.categories.active} active`} icon={HiOutlineTag} color="bg-purple-100 text-purple-600" />
        <StatCard title="Products" value={stats.products.total} sub={`${stats.products.active} active`} icon={HiOutlineCube} color="bg-emerald-100 text-emerald-600" />
        <StatCard title="Customers" value={stats.customers.total} icon={HiOutlineOfficeBuilding} color="bg-orange-100 text-orange-600" />
        <StatCard title="Contacts" value={stats.contacts.total} sub={`${stats.contacts.unread} unread`} icon={HiOutlineMail} color="bg-rose-100 text-rose-600" />
        <StatCard title="Total Paid Salary" value={`₹${(stats.salary.totalPaid || 0).toLocaleString('en-IN')}`} icon={HiOutlineCurrencyDollar} color="bg-teal-100 text-teal-600" />
      </div>}
      {recent && <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <RecentPanel title="Recent Employees" to="/admin/employees">
          {recent.recentEmployees?.length > 0 ? recent.recentEmployees.map((emp) => <div key={emp._id} className="flex items-center justify-between rounded-xl border border-transparent p-2 text-sm transition-colors hover:border-slate-100 hover:bg-slate-50"><div className="min-w-0"><p className="font-medium text-slate-800">{emp.firstName} {emp.lastName}</p><p className="truncate text-slate-500">{emp.designation}</p></div><span className="ml-3 shrink-0 text-xs text-slate-400">{new Date(emp.createdAt).toLocaleDateString()}</span></div>) : <p className="py-5 text-center text-sm text-slate-400">No employees yet</p>}
        </RecentPanel>
        <RecentPanel title="Recent Contacts" to="/admin/contacts">
          {recent.recentContacts?.length > 0 ? recent.recentContacts.map((contact) => <div key={contact._id} className="flex items-center justify-between gap-3 rounded-xl border border-transparent p-2 text-sm transition-colors hover:border-slate-100 hover:bg-slate-50"><div className="min-w-0"><p className="font-medium text-slate-800">{contact.name}</p><p className="truncate text-slate-500">{contact.subject}</p></div><StatusBadge status={contact.status} /></div>) : <p className="py-5 text-center text-sm text-slate-400">No contacts yet</p>}
        </RecentPanel>
      </div>}
    </div>
  );
};

export default DashboardPage;
