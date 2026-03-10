import { useEffect } from 'react';

const setRoleCookie = async (role: string) => {
  try {
    // Make API call to set cookie
    await fetch('/api/set-role', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
    });
  } catch (error) {
    console.error('Error setting role cookie:', error);
  }
};

export const RoleSelector = ({ role, onRoleSelect }) => {
  const handleRoleChange = async (newRole: string) => {
    await setRoleCookie(newRole);
    onRoleSelect(newRole);
    window.location.reload();
  };

  // ...rest of your component code
};