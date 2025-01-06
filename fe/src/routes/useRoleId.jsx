import { useState, useEffect } from 'react';

const useRoleId = () => {
    const [roleId, setRoleId] = useState(() => {
        return parseInt(localStorage.getItem('userRoleId'), 10);
    });

    useEffect(() => {
        const handleStorageChange = () => {
            const updatedRoleId = parseInt(localStorage.getItem('userRoleId'), 10);
            setRoleId(updatedRoleId);
        };

        window.addEventListener('storage', handleStorageChange);

        return () => {
            window.removeEventListener('storage', handleStorageChange);
        };
    }, []);

    return roleId;
};

export default useRoleId;
