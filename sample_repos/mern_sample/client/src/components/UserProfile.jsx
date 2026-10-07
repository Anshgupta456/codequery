import React, { useState } from 'react';

export function UserProfile({ user, onUpdate }) {
    const [isEditing, setIsEditing] = useState(false);
    const [name, setName] = useState(user ? user.username : '');

    const handleSave = () => {
        setIsEditing(false);
        if (onUpdate) {
            onUpdate({ ...user, username: name });
        }
    };

    if (!user) {
        return <div className="profile-empty">No user data available.</div>;
    }

    return (
        <div className="user-profile-card">
            <h2>User Profile</h2>
            <p><strong>Email:</strong> {user.email}</p>
            {isEditing ? (
                <div>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                    <button onClick={handleSave}>Save</button>
                </div>
            ) : (
                <div>
                    <p><strong>Username:</strong> {user.username}</p>
                    <button onClick={() => setIsEditing(true)}>Edit</button>
                </div>
            )}
        </div>
    );
}

export const StatusBadge = ({ role }) => {
    const isAdmin = role === 'admin';
    return (
        <span className={isAdmin ? 'badge-admin' : 'badge-user'}>
            {role.toUpperCase()}
        </span>
    );
};
