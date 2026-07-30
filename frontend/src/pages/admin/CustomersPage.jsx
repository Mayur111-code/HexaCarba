import { useState, useEffect, useCallback } from 'react';
import { customerService } from '../../services/customerService';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import CustomerModal from '../../components/admin/CustomerModal';
import { HiOutlineSearch, HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineOfficeBuilding } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';

const CustomersPage = () => {
  const [customers, setCustomers] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { page, limit, goToPage, setPage } = usePagination();
  const debouncedSearch = useDebounce(search);

  const fetchCustomers = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await customerService.getAll({ page, limit, search: debouncedSearch });
      setCustomers(data.data);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  }, [page, limit, debouncedSearch]);

  useEffect(() => { fetchCustomers(); }, [fetchCustomers]);
  useEffect(() => { setPage(1); }, [debouncedSearch, setPage]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await customerService.delete(deleteConfirm._id);
      toast.success('Customer deleted');
      setDeleteConfirm(null);
      fetchCustomers();
    } finally { setDeleteLoading(false); }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
        <button onClick={() => { setEditing(null); setModalOpen(true); }} className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium">
          <HiOutlinePlus className="w-4 h-4" /> Add Customer
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b">
          <div className="relative max-w-xs">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search customers..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Company', 'Contact Person', 'Email', 'Phone', 'City', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7}><Loader /></td></tr>
              ) : customers.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No customers found" icon={HiOutlineOfficeBuilding} /></td></tr>
              ) : (
                customers.map((c) => (
                  <tr key={c._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">{c.companyName}</td>
                    <td className="px-4 py-3 text-sm">{c.contactPerson}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-sm">{c.phone}</td>
                    <td className="px-4 py-3 text-sm">{c.address?.city}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => { setEditing(c); setModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><HiOutlinePencil className="w-4 h-4" /></button>
                        <button onClick={() => setDeleteConfirm(c)} className="p-1.5 text-red-600 hover:bg-red-50 rounded"><HiOutlineTrash className="w-4 h-4" /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
        {pagination && <div className="p-4"><Pagination pagination={pagination} onPageChange={goToPage} /></div>}
      </div>

      <CustomerModal isOpen={modalOpen} onClose={() => { setModalOpen(false); setEditing(null); }} customer={editing} onSuccess={fetchCustomers} />

      <ConfirmModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} title="Delete Customer" message={`Delete "${deleteConfirm?.companyName}"?`} loading={deleteLoading} />
    </div>
  );
};

export default CustomersPage;
