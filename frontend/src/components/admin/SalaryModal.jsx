import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { salaryService } from '../../services/salaryService';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';

const parseNum = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? 0 : n;
};

const Input = ({ label, required, register, error, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label>
    <input {...register} {...props} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const Select = ({ label, required, register, error, children, ...props }) => (
  <div>
    <label className="block text-sm font-medium text-gray-700 mb-1">{label} {required && '*'}</label>
    <select {...register} {...props} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">{children}</select>
    {error && <p className="text-red-500 text-xs mt-1">{error}</p>}
  </div>
);

const SalaryModal = ({ isOpen, onClose, salary, onSuccess }) => {
  const isEdit = !!salary;
  const [employees, setEmployees] = useState([]);
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    employeeService.getAll({ limit: 100 }).then(({ data }) => {
      setEmployees(data.data || []);
    }).catch(() => {});

    if (salary) {
      reset({
        employee: salary.employee?._id || salary.employee || '',
        month: salary.month || '',
        year: salary.year || new Date().getFullYear(),
        basic: salary.basic ?? 0,
        hra: salary.hra ?? 0,
        specialHra: salary.specialHra ?? 0,
        medicalAllowance: salary.medicalAllowance ?? 0,
        otherAllowance: salary.otherAllowance ?? 0,
        overtime: salary.overtime ?? 0,
        employeePf: salary.employeePf ?? 0,
        professionalTax: salary.professionalTax ?? 0,
        loanDeductions: salary.loanDeductions ?? 0,
        otherDeductions: salary.otherDeductions ?? 0,
        allowances: salary.allowances ?? 0,
        deductions: salary.deductions ?? 0,
        taxRegime: salary.taxRegime || '',
        loanDate: salary.loanOutstanding?.date ? salary.loanOutstanding.date.split('T')[0] : '',
        loanBalance: salary.loanOutstanding?.balance ?? 0,
        loanDedMonth: salary.loanOutstanding?.deductionForMonth ?? 0,
        loanPrincipal: salary.loanOutstanding?.principal ?? 0,
        loanInterest: salary.loanOutstanding?.interest ?? 0,
        daysInMonth: salary.attendance?.daysInMonth ?? '',
        offDays: salary.attendance?.offDays ?? '',
        lopDays: salary.attendance?.lopDays ?? '',
        netWorkingDays: salary.attendance?.netWorkingDays ?? '',
        aggregate: salary.workingHours?.aggregate ?? '',
        firstShift: salary.workingHours?.firstShift ?? '',
        overtimeHr: salary.workingHours?.overtimeHr ?? '',
        totalWorkingHours: salary.workingHours?.totalWorkingHours ?? '',
        preparer: salary.preparer || '',
        approver: salary.approver || '',
        status: salary.status || 'pending',
        notes: salary.notes || '',
      });
    } else {
      reset({
        employee: '',
        month: new Date().getMonth() + 1,
        year: new Date().getFullYear(),
        basic: 0, hra: 0, specialHra: 0, medicalAllowance: 0, otherAllowance: 0, overtime: 0,
        employeePf: 0, professionalTax: 0, loanDeductions: 0, otherDeductions: 0,
        allowances: 0, deductions: 0, taxRegime: '',
        loanDate: '', loanBalance: 0, loanDedMonth: 0, loanPrincipal: 0, loanInterest: 0,
        daysInMonth: '', offDays: '', lopDays: '', netWorkingDays: '',
        aggregate: '', firstShift: '', overtimeHr: '', totalWorkingHours: '',
        preparer: '', approver: '',
        status: 'pending', notes: '',
      });
    }
  }, [salary, reset]);

  const onSubmit = async (data) => {
    if (!data.employee) { toast.error('Please select an employee'); return; }

    const payload = {
      employee: data.employee,
      month: parseInt(data.month, 10),
      year: parseInt(data.year, 10),
      basic: parseNum(data.basic),
      hra: parseNum(data.hra),
      specialHra: parseNum(data.specialHra),
      medicalAllowance: parseNum(data.medicalAllowance),
      otherAllowance: parseNum(data.otherAllowance),
      overtime: parseNum(data.overtime),
      allowances: parseNum(data.allowances),
      employeePf: parseNum(data.employeePf),
      professionalTax: parseNum(data.professionalTax),
      loanDeductions: parseNum(data.loanDeductions),
      otherDeductions: parseNum(data.otherDeductions),
      deductions: parseNum(data.deductions),
      taxRegime: data.taxRegime || undefined,
      loanOutstanding: {
        date: data.loanDate || undefined,
        balance: parseNum(data.loanBalance),
        deductionForMonth: parseNum(data.loanDedMonth),
        principal: parseNum(data.loanPrincipal),
        interest: parseNum(data.loanInterest),
      },
      attendance: {
        daysInMonth: data.daysInMonth ? parseInt(data.daysInMonth, 10) : 0,
        offDays: data.offDays ? parseInt(data.offDays, 10) : 0,
        lopDays: data.lopDays ? parseInt(data.lopDays, 10) : 0,
        netWorkingDays: data.netWorkingDays ? parseInt(data.netWorkingDays, 10) : 0,
      },
      workingHours: {
        aggregate: parseNum(data.aggregate),
        firstShift: parseNum(data.firstShift),
        overtimeHr: parseNum(data.overtimeHr),
        totalWorkingHours: parseNum(data.totalWorkingHours),
      },
      preparer: data.preparer || undefined,
      approver: data.approver || undefined,
      status: data.status || 'pending',
      notes: data.notes || '',
    };

    if (!payload.loanOutstanding.date) delete payload.loanOutstanding.date;
    if (Object.values(payload.loanOutstanding).every(v => !v)) delete payload.loanOutstanding;
    if (Object.values(payload.attendance).every(v => !v)) delete payload.attendance;
    if (Object.values(payload.workingHours).every(v => !v)) delete payload.workingHours;

    try {
      if (isEdit) {
        await salaryService.update(salary._id, payload);
        toast.success('Salary updated');
      } else {
        await salaryService.create(payload);
        toast.success('Salary generated');
      }
      onSuccess();
      onClose();
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to save salary');
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 p-6 max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between mb-4 sticky top-0 bg-white z-10">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Salary' : 'Generate Salary'}</h2>
          <button onClick={onClose}><HiOutlineX className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <Select label="Employee" required register={register('employee', { required: 'Required' })} error={errors.employee?.message} disabled={isEdit}>
            <option value="">Select Employee</option>
            {employees.map((e) => (
              <option key={e._id} value={e._id}>{e.firstName} {e.lastName} ({e.employeeId})</option>
            ))}
          </Select>

          <div className="grid grid-cols-2 gap-4">
            <Select label="Month" required register={register('month', { required: 'Required' })}>
              {Array.from({ length: 12 }, (_, i) => (
                <option key={i + 1} value={i + 1}>{new Date(2024, i).toLocaleString('default', { month: 'long' })}</option>
              ))}
            </Select>
            <Input label="Year" type="number" required register={register('year', { required: 'Required', min: 2000 })} />
          </div>

          <details className="border rounded-lg p-3" open>
            <summary className="text-sm font-semibold text-gray-800 cursor-pointer">Earnings</summary>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Input label="Basic" type="number" step="0.01" min="0" required register={register('basic', { required: 'Required', min: 0 })} />
              <Input label="HRA" type="number" step="0.01" min="0" register={register('hra')} />
              <Input label="Special HRA" type="number" step="0.01" min="0" register={register('specialHra')} />
              <Input label="Medical Allowance" type="number" step="0.01" min="0" register={register('medicalAllowance')} />
              <Input label="Other Allowance" type="number" step="0.01" min="0" register={register('otherAllowance')} />
              <Input label="Overtime" type="number" step="0.01" min="0" register={register('overtime')} />
            </div>
          </details>

          <details className="border rounded-lg p-3">
            <summary className="text-sm font-semibold text-gray-800 cursor-pointer">Deductions</summary>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Input label="Employee PF" type="number" step="0.01" min="0" register={register('employeePf')} />
              <Input label="Professional Tax" type="number" step="0.01" min="0" register={register('professionalTax')} />
              <Input label="Loan Deductions" type="number" step="0.01" min="0" register={register('loanDeductions')} />
              <Input label="Other Deductions" type="number" step="0.01" min="0" register={register('otherDeductions')} />
            </div>
          </details>

          <details className="border rounded-lg p-3">
            <summary className="text-sm font-semibold text-gray-800 cursor-pointer">Loan Outstanding</summary>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Input label="Date" type="date" register={register('loanDate')} />
              <Input label="Balance (₹)" type="number" step="0.01" min="0" register={register('loanBalance')} />
              <Input label="Deduction for Month (₹)" type="number" step="0.01" min="0" register={register('loanDedMonth')} />
              <Input label="Principal (₹)" type="number" step="0.01" min="0" register={register('loanPrincipal')} />
              <Input label="Interest (₹)" type="number" step="0.01" min="0" register={register('loanInterest')} />
            </div>
          </details>

          <details className="border rounded-lg p-3">
            <summary className="text-sm font-semibold text-gray-800 cursor-pointer">Attendance & Working Hours</summary>
            <div className="grid grid-cols-2 gap-4 mt-3">
              <Input label="Days in Month" type="number" min="0" register={register('daysInMonth')} />
              <Input label="Off Days" type="number" min="0" register={register('offDays')} />
              <Input label="LOP Days" type="number" min="0" register={register('lopDays')} />
              <Input label="Net Working Days" type="number" min="0" register={register('netWorkingDays')} />
              <Input label="Aggregate (Hr)" type="number" step="0.5" min="0" register={register('aggregate')} />
              <Input label="First Shift (Hr)" type="number" step="0.5" min="0" register={register('firstShift')} />
              <Input label="Overtime (Hr)" type="number" step="0.5" min="0" register={register('overtimeHr')} />
              <Input label="Total Working Hours" type="number" step="0.5" min="0" register={register('totalWorkingHours')} />
            </div>
          </details>

          <div className="grid grid-cols-2 gap-4">
            <Input label="Tax Regime" register={register('taxRegime')} />
            <Select label="Status" register={register('status')}>
              <option value="pending">Pending</option>
              <option value="paid">Paid</option>
              <option value="cancelled">Cancelled</option>
            </Select>
            <Input label="Prepared by" register={register('preparer')} />
            <Input label="Approved by" register={register('approver')} />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Notes</label>
            <textarea {...register('notes')} rows={2} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">
              {isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Generate'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SalaryModal;
