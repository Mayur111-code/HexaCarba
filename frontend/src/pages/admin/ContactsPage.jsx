import { useState, useEffect, useCallback } from 'react';
import { contactService } from '../../services/contactService';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import { HiOutlineSearch, HiOutlineMail, HiOutlineEye, HiOutlineTrash, HiOutlineCheck } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { useDebounce } from '../../hooks/useDebounce';
import { usePagination } from '../../hooks/usePagination';
import ContactViewModal from '../../components/admin/ContactViewModal';

const ContactsPage = () => {
  const [contacts, setContacts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [viewContact, setViewContact] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { page, limit, goToPage, setPage } = usePagination();
  const debouncedSearch = useDebounce(search);

  const fetchContacts = useCallback(async () => {
    setLoading(true);
    try {
      const params = { page, limit };
      if (debouncedSearch) params.search = debouncedSearch;
      if (statusFilter) params.status = statusFilter;
      const { data } = await contactService.getAll(params);
      setContacts(data.data);
      setPagination(data.pagination);
    } finally { setLoading(false); }
  }, [page, limit, debouncedSearch, statusFilter]);

  useEffect(() => { fetchContacts(); }, [fetchContacts]);
  useEffect(() => { setPage(1); }, [debouncedSearch, statusFilter, setPage]);

  const handleMarkRead = async (contact) => {
    try {
      await contactService.markAsRead(contact._id);
      toast.success('Marked as read');
      fetchContacts();
    } catch {}
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await contactService.delete(deleteConfirm._id);
      toast.success('Contact deleted');
      setDeleteConfirm(null);
      fetchContacts();
    } finally { setDeleteLoading(false); }
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Contact Inquiries</h1>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="p-4 border-b flex flex-col sm:flex-row gap-3">
          <div className="relative max-w-xs">
            <HiOutlineSearch className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input type="text" placeholder="Search..." value={search} onChange={(e) => setSearch(e.target.value)} className="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <select value={statusFilter} onChange={(e) => setStatusFilter(e.target.value)} className="border border-gray-300 rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
            <option value="">All Status</option>
            <option value="unread">Unread</option>
            <option value="read">Read</option>
            <option value="replied">Replied</option>
          </select>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Name', 'Email', 'Subject', 'Company', 'Status', 'Date', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={7}><Loader /></td></tr>
              ) : contacts.length === 0 ? (
                <tr><td colSpan={7}><EmptyState message="No contacts found" icon={HiOutlineMail} /></td></tr>
              ) : (
                contacts.map((c) => (
                  <tr key={c._id} className={`hover:bg-gray-50 ${c.status === 'unread' ? 'bg-blue-50/50' : ''}`}>
                    <td className="px-4 py-3 text-sm font-medium">{c.name}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.email}</td>
                    <td className="px-4 py-3 text-sm max-w-[200px] truncate">{c.subject}</td>
                    <td className="px-4 py-3 text-sm text-gray-500">{c.company || '—'}</td>
                    <td className="px-4 py-3"><StatusBadge status={c.status} /></td>
                    <td className="px-4 py-3 text-sm text-gray-400">{new Date(c.createdAt).toLocaleDateString()}</td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => setViewContact(c)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded"><HiOutlineEye className="w-4 h-4" /></button>
                        {c.status === 'unread' && (
                          <button onClick={() => handleMarkRead(c)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Mark as read"><HiOutlineCheck className="w-4 h-4" /></button>
                        )}
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

      <ContactViewModal isOpen={!!viewContact} onClose={() => setViewContact(null)} contact={viewContact} />

      <ConfirmModal isOpen={!!deleteConfirm} onClose={() => setDeleteConfirm(null)} onConfirm={handleDelete} title="Delete Contact" message={`Delete inquiry from "${deleteConfirm?.name}"?`} loading={deleteLoading} />
    </div>
  );
};

export default ContactsPage;
