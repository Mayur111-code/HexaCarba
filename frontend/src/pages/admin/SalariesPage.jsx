import { useState, useEffect, useCallback } from 'react';
import { salaryService } from '../../services/salaryService';
import Pagination from '../../components/common/Pagination';
import StatusBadge from '../../components/common/StatusBadge';
import ConfirmModal from '../../components/common/ConfirmModal';
import Loader from '../../components/common/Loader';
import EmptyState from '../../components/common/EmptyState';
import SalaryModal from '../../components/admin/SalaryModal';
import { HiOutlinePlus, HiOutlinePencil, HiOutlineTrash, HiOutlineDownload, HiOutlineCurrencyDollar } from 'react-icons/hi';
import toast from 'react-hot-toast';
import { usePagination } from '../../hooks/usePagination';

const SalariesPage = () => {
  const [salaries, setSalaries] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState(null);
  const [deleteConfirm, setDeleteConfirm] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const { page, limit, goToPage } = usePagination();

  const fetchSalaries = useCallback(async () => {
    setLoading(true);
    try {
      const { data } = await salaryService.getAll({ page, limit });
      setSalaries(data.data || []);
      setPagination(data.pagination);
    } catch {
      toast.error('Failed to load salary records');
    } finally {
      setLoading(false);
    }
  }, [page, limit]);

  useEffect(() => { fetchSalaries(); }, [fetchSalaries]);

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleteLoading(true);
    try {
      await salaryService.delete(deleteConfirm._id);
      toast.success('Salary record deleted');
      setDeleteConfirm(null);
      fetchSalaries();
    } catch {
      toast.error('Failed to delete salary');
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleDownload = async (salary) => {
    try {
      const response = await salaryService.downloadPDF(salary._id);

      const blob = response.data instanceof Blob
        ? response.data
        : new Blob([response.data], { type: 'application/pdf' });

      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute(
        'download',
        `Salary_Slip_${salary.employee?.firstName || 'Employee'}_${salary.month}_${salary.year}.pdf`
      );
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      setTimeout(() => window.URL.revokeObjectURL(url), 1000);
    } catch (err) {
      console.error('PDF download error:', err);
      toast.error('Failed to download PDF. Check if employee data is intact.');
    }
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Salary Records</h1>
        <button
          onClick={() => { setEditing(null); setModalOpen(true); }}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 text-sm font-medium"
        >
          <HiOutlinePlus className="w-4 h-4" /> Generate Salary
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                {['Employee', 'Period', 'Basic', 'HRA', 'Allowances', 'Deductions', 'Net Salary', 'Status', 'Actions'].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {loading ? (
                <tr><td colSpan={9}><Loader /></td></tr>
              ) : salaries.length === 0 ? (
                <tr><td colSpan={9}><EmptyState message="No salary records" icon={HiOutlineCurrencyDollar} /></td></tr>
              ) : (
                salaries.map((s) => (
                  <tr key={s._id} className="hover:bg-gray-50">
                    <td className="px-4 py-3 text-sm font-medium">
                      {s.employee?.firstName} {s.employee?.lastName}
                      <div className="text-xs text-gray-400">{s.employee?.employeeId}</div>
                    </td>
                    <td className="px-4 py-3 text-sm">{String(s.month).padStart(2, '0')}/{s.year}</td>
                    <td className="px-4 py-3 text-sm">₹{(s.basic || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm">₹{(s.hra || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm">₹{(s.allowances || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm">₹{(s.deductions || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3 text-sm font-semibold">₹{(s.netSalary || 0).toLocaleString('en-IN')}</td>
                    <td className="px-4 py-3"><StatusBadge status={s.status} /></td>
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-1">
                        <button onClick={() => handleDownload(s)} className="p-1.5 text-green-600 hover:bg-green-50 rounded" title="Download PDF">
                          <HiOutlineDownload className="w-4 h-4" />
                        </button>
                        <button onClick={() => { setEditing(s); setModalOpen(true); }} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded" title="Edit">
                          <HiOutlinePencil className="w-4 h-4" />
                        </button>
                        <button onClick={() => setDeleteConfirm(s)} className="p-1.5 text-red-600 hover:bg-red-50 rounded" title="Delete">
                          <HiOutlineTrash className="w-4 h-4" />
                        </button>
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

      <SalaryModal
        isOpen={modalOpen}
        onClose={() => { setModalOpen(false); setEditing(null); }}
        salary={editing}
        onSuccess={fetchSalaries}
      />

      <ConfirmModal
        isOpen={!!deleteConfirm}
        onClose={() => setDeleteConfirm(null)}
        onConfirm={handleDelete}
        title="Delete Salary Record"
        message="Are you sure you want to delete this salary record?"
        loading={deleteLoading}
      />
    </div>
  );
};

export default SalariesPage;
