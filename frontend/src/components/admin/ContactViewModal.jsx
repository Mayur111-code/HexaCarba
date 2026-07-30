import { HiOutlineX, HiOutlineMail, HiOutlinePhone, HiOutlineOfficeBuilding, HiOutlineCalendar } from 'react-icons/hi';
import StatusBadge from '../common/StatusBadge';

const ContactViewModal = ({ isOpen, onClose, contact }) => {
  if (!isOpen || !contact) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative bg-white rounded-xl shadow-xl max-w-lg w-full mx-4 p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Contact Details</h2>
          <button onClick={onClose}><HiOutlineX className="w-5 h-5" /></button>
        </div>
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h3 className="text-xl font-bold">{contact.name}</h3>
            <StatusBadge status={contact.status} />
          </div>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2 text-gray-600">
              <HiOutlineMail className="w-4 h-4" />
              <a href={`mailto:${contact.email}`} className="text-blue-600 hover:underline">{contact.email}</a>
            </div>
            {contact.phone && (
              <div className="flex items-center gap-2 text-gray-600">
                <HiOutlinePhone className="w-4 h-4" />
                <a href={`tel:${contact.phone}`}>{contact.phone}</a>
              </div>
            )}
            {contact.company && (
              <div className="flex items-center gap-2 text-gray-600">
                <HiOutlineOfficeBuilding className="w-4 h-4" />
                {contact.company}
              </div>
            )}
            <div className="flex items-center gap-2 text-gray-600">
              <HiOutlineCalendar className="w-4 h-4" />
              {new Date(contact.createdAt).toLocaleString()}
            </div>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-700">Subject: {contact.subject}</p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-700 whitespace-pre-wrap">{contact.message}</p>
          </div>
        </div>
        <div className="flex justify-end mt-4">
          <button onClick={onClose} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200">Close</button>
        </div>
      </div>
    </div>
  );
};

export default ContactViewModal;
