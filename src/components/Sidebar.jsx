import { useEffect, useState } from "react";
import { useChatStore } from "../store/useChatStore";
import { useAuthStore } from "../store/useAuthStore";
import SidebarSkeleton from "./skeletons/SidebarSkeleton";
import { Users, X } from "lucide-react";

const Sidebar = ({ isOpen, onClose }) => {
  const { getUsers, users, selectedUser, setSelectedUser, isUsersLoading } = useChatStore();
  const { onlineUsers, authUser } = useAuthStore();
  const [showOnlineOnly, setShowOnlineOnly] = useState(false);

  useEffect(() => {
    getUsers();
  }, [getUsers]);

  const filteredUsers = showOnlineOnly
    ? users.filter((user) => onlineUsers.includes(user._id))
    : users;

  if (isUsersLoading) return <SidebarSkeleton />;

  return (
    <>
      {/* Overlay for mobile drawer */}
      {isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 z-40 sm:hidden" onClick={onClose}></div>
      )}
      <aside className={`h-full w-16 sm:w-20 lg:w-72 border-r border-base-300 flex flex-col transition-all duration-200 fixed sm:static z-50 bg-base-100 sm:bg-transparent left-0 top-0 sm:relative
        ${isOpen ? "translate-x-0" : "-translate-x-full"} sm:translate-x-0
      `} style={{ transitionProperty: 'transform' }}>
        {/* Close button for mobile */}
        <div className="flex sm:hidden justify-end p-2">
          <button onClick={onClose} className="btn btn-ghost btn-circle">
            <X className="w-6 h-6" />
          </button>
        </div>
        <div className="border-b border-base-300 w-full p-5">
          <div className="flex items-center gap-2">
            <Users className="size-6" />
            <span className="font-medium hidden lg:block">Contacts</span>
          </div>
          {/* TODO: Online filter toggle */}
          <div className="mt-3 hidden lg:flex items-center gap-2">
            <label className="cursor-pointer flex items-center gap-2">
              <input
                type="checkbox"
                checked={showOnlineOnly}
                onChange={(e) => setShowOnlineOnly(e.target.checked)}
                className="checkbox checkbox-sm"
              />
              <span className="text-sm">Show online only</span>
            </label>
            <span className="text-xs text-zinc-500">({onlineUsers.length - 1} online)</span>
          </div>
        </div>

        <div className="overflow-y-auto w-full py-3">
          {filteredUsers.map((user) => (
            <button
              key={user._id}
              onClick={() => {
                if (
                  user &&
                  user._id &&
                  typeof user._id === 'string' &&
                  user._id.length === 24 &&
                  filteredUsers.some(u => u._id === user._id)
                ) {
                  setSelectedUser(user);
                }
              }}
              className={`
                w-full p-3 flex items-center gap-3
                hover:bg-base-300 transition-colors
                ${selectedUser?._id === user._id ? "bg-base-300 ring-1 ring-base-300" : ""}
              `}
            >
              <div className="relative mx-auto lg:mx-0">
                <img
                  src={user.profilePic || "/avatar.png"}
                  alt={user.name}
                  className="size-12 object-cover rounded-full"
                />
                {onlineUsers.includes(user._id) && (
                  <span
                    className="absolute bottom-0 right-0 size-3 bg-green-500 
                    rounded-full ring-2 ring-zinc-900"
                  />
                )}
              </div>

              {/* User info - only visible on larger screens */}
              <div className="hidden lg:block text-left min-w-0">
                <div className="font-medium truncate">{user.fullName}</div>
                <div className="text-sm text-zinc-400">
                  {onlineUsers.includes(user._id) ? "Online" : "Offline"}
                </div>
              </div>
            </button>
          ))}

          {filteredUsers.length === 0 && (
            <div className="text-center text-zinc-500 py-4">No online users</div>
          )}
        </div>
      </aside>
    </>
  );
};
export default Sidebar;
