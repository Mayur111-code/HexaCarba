import { STATUS_COLORS } from '../../constants';

const StatusBadge = ({ status }) => {
  const colorClass = STATUS_COLORS[status] || 'bg-gray-100 text-gray-800';
  return (
    <span
      className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium capitalize ${colorClass}`}
    >
      {status}
    </span>
  );
};

export default StatusBadge;
