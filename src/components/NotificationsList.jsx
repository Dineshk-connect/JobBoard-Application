import { Bell } from 'lucide-react';
import moment from 'moment';

const NotificationsList = ({ notifications }) => {
  return (
    <div className="p-4 bg-white shadow-md rounded-xl">
      <div className="flex items-center mb-4">
        <Bell className="text-blue-600 mr-2" />
        <h2 className="text-xl font-semibold text-gray-800">Notifications</h2>
      </div>
      <ul className="space-y-4">
        {notifications.length === 0 ? (
          <p className="text-gray-500">No notifications yet.</p>
        ) : (
          notifications.map((n) => (
            <li key={n._id || n.message} className="flex items-start space-x-3">
              <div className="mt-1">
                <Bell className="text-gray-400" size={20} />
              </div>
              <div className="flex-1">
                <p className="text-gray-800">{n.message}</p>
                <p className="text-sm text-gray-500">
                  {moment(n.createdAt).fromNow()}
                </p>
              </div>
            </li>
          ))
        )}
      </ul>
    </div>
  );
};

export default NotificationsList;
