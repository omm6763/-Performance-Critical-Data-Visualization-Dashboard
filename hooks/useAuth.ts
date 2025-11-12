import { useState, useEffect } from 'react';

const useAuth = () => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUser = async () => {
            // Simulate fetching user data
            const response = await fetch('/api/user');
            const data = await response.json();
            setUser(data);
            setLoading(false);
        };

        fetchUser();
    }, []);

    const login = async (credentials) => {
        const response = await fetch('/api/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(credentials),
        });
        const data = await response.json();
        setUser(data);
    };

    const logout = async () => {
        await fetch('/api/logout', {
            method: 'POST',
        });
        setUser(null);
    };

    return { user, loading, login, logout };
};

export default useAuth;