import React, { memo } from "react";
import UserCard from "./UserCard";
import type { User } from "../../types/user";

interface Props {
  users: User[];
}

const UserList: React.FC<Props> = ({ users }) => {
  if (!users?.length) {
    return (
      <p className="text-gray-500 text-center col-span-full">No users found</p>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {users.map((user) => (
        <UserCard key={user.id} user={user} />
      ))}
    </div>
  );
};

// Wrap in React.memo to avoid unnecessary re-renders
export default memo(UserList);
