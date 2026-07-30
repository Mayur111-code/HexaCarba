import { HiOutlineInbox } from 'react-icons/hi';

const EmptyState = ({ message = 'No data found', icon: Icon = HiOutlineInbox }) => {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-gray-400">
      <Icon className="w-16 h-16 mb-4" />
      <p className="text-lg font-medium text-gray-500">{message}</p>
    </div>
  );
};

export default EmptyState;
