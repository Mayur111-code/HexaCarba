import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { employeeService } from '../../services/employeeService';
import toast from 'react-hot-toast';
import { HiOutlineX } from 'react-icons/hi';

const n = (v) => v ?? '';

const EmployeeModal = ({ isOpen, onClose, employee, onSuccess }) => {
  const isEdit = !!employee;
  const { register, handleSubmit, reset, formState: { errors, isSubmitting } } = useForm();

  useEffect(() => {
    if (employee) {
      reset({
        employeeId: n(employee.employeeId),
        firstName: n(employee.firstName),
        lastName: n(employee.lastName),
        email: n(employee.email),
        phone: n(employee.phone),
        mobileNo: n(employee.mobileNo),
        gender: n(employee.gender),
        dateOfBirth: employee.dateOfBirth ? employee.dateOfBirth.split('T')[0] : '',
        department: n(employee.department),
        designation: n(employee.designation),
        joiningDate: employee.joiningDate ? employee.joiningDate.split('T')[0] : '',
        salary: employee.salary || '',
        permanentAddress: n(employee.permanentAddress),
        location: n(employee.location),
        panNo: n(employee.panNo),
        aadharNo: n(employee.aadharNo),
        uanNo: n(employee.uanNo),
        pfNo: n(employee.pfNo),
        esiNo: n(employee.esiNo),
        epsNo: n(employee.epsNo),
        npsNo: n(employee.npsNo),
        bankName: n(employee.bankName),
        bankBranch: n(employee.bankBranch),
        bankAccountNo: n(employee.bankAccountNo),
        ifscCode: n(employee.ifscCode),
        status: employee.status || 'active',
        'address.city': n(employee.address?.city),
        'address.state': n(employee.address?.state),
        'address.street': n(employee.address?.street),
      });
    } else {
      reset({});
    }
  }, [employee, reset]);

  const onSubmit = async (data) => {
    const payload = {
      ...data,
      salary: parseFloat(data.salary),
      address: {
        street: data['address.street'] || '',
        city: data['address.city'] || '',
        state: data['address.state'] || '',
      },
    };
    delete payload['address.street'];
    delete payload['address.city'];
    delete payload['address.state'];

    try {
      if (isEdit) {
        await employeeService.update(employee._id, payload);
        toast.success('Employee updated');
      } else {
        await employeeService.create(payload);
        toast.success('Employee created');
      }
      onSuccess();
      onClose();
    } catch {}
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-10 overflow-y-auto">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-2xl w-full mx-4 mb-10">
        <div className="flex items-center justify-between p-5 border-b">
          <h2 className="text-lg font-semibold">{isEdit ? 'Edit Employee' : 'Add Employee'}</h2>
          <button onClick={onClose}><HiOutlineX className="w-5 h-5" /></button>
        </div>
        <form onSubmit={handleSubmit(onSubmit)} className="p-5 space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Employee ID *</label>
              <input {...register('employeeId', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
              {errors.employeeId && <p className="text-red-500 text-xs mt-1">{errors.employeeId.message}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email *</label>
              <input type="email" {...register('email', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">First Name *</label>
              <input {...register('firstName', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Last Name *</label>
              <input {...register('lastName', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
              <input {...register('phone')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Department *</label>
              <input {...register('department', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Designation *</label>
              <input {...register('designation', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Joining Date *</label>
              <input type="date" {...register('joiningDate', { required: 'Required' })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Salary *</label>
              <input type="number" step="0.01" {...register('salary', { required: 'Required', min: 0 })} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" />
            </div>
            {isEdit && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select {...register('status')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="terminated">Terminated</option>
                </select>
              </div>
            )}
          </div>

          <details className="border rounded-lg p-3">
            <summary className="text-sm font-semibold text-gray-800 cursor-pointer">Payroll Details (PAN, Bank, PF, etc.)</summary>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-3">
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Mobile No.</label><input {...register('mobileNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Gender</label><select {...register('gender')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Select</option><option value="Male">Male</option><option value="Female">Female</option><option value="Other">Other</option></select></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Date of Birth</label><input type="date" {...register('dateOfBirth')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Permanent Address</label><input {...register('permanentAddress')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Location</label><input {...register('location')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">PAN No.</label><input {...register('panNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Aadhar No.</label><input {...register('aadharNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">UAN</label><input {...register('uanNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">PF No.</label><input {...register('pfNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">ESI No.</label><input {...register('esiNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">EPS No.</label><input {...register('epsNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">NPS No.</label><input {...register('npsNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Name</label><input {...register('bankName')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Branch</label><input {...register('bankBranch')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">Bank Account No.</label><input {...register('bankAccountNo')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
              <div><label className="block text-sm font-medium text-gray-700 mb-1">IFSC Code</label><input {...register('ifscCode')} className="w-full border rounded-lg px-3 py-2 text-sm focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            </div>
          </details>

          <div className="flex justify-end gap-3 pt-2">
            <button type="button" onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Cancel</button>
            <button type="submit" disabled={isSubmitting} className="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50">{isSubmitting ? 'Saving...' : isEdit ? 'Update' : 'Create'}</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EmployeeModal;
