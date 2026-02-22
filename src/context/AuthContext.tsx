import React, { createContext, useContext, useState, useEffect } from 'react';
import { type User } from '../types';
import { supabase } from '../lib/supabase';

interface AuthContextType {
    user: User | null;
    isAuthenticated: boolean;
    login: (email: string, pass: string) => Promise<void>;
    register: (email: string, pass: string) => Promise<void>;
    logout: () => void;
    isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [user, setUser] = useState<User | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const savedUser = localStorage.getItem('nexus_user');
        if (savedUser) {
            try {
                setUser(JSON.parse(savedUser));
            } catch {
                localStorage.removeItem('nexus_user');
            }
        }
        setIsLoading(false);
    }, []);

    const login = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data: userData, error } = await supabase
                .from('users')
                .select('*')
                .eq('email', email)
                .single();

            if (error || !userData) {
                throw new Error('Account not found. Please register.');
            }

            if (userData.password !== password) {
                throw new Error('Invalid credentials');
            }

            const user: User = {
                id: userData.id,
                email: userData.email,
                name: userData.name,
                avatar: userData.avatar,
                token: userData.token,
                inventory: userData.inventory || []
            };

            setUser(user);
            localStorage.setItem('nexus_user', JSON.stringify(user));
        } catch (error: any) {
            console.error('Login Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const register = async (email: string, password: string) => {
        setIsLoading(true);
        try {
            const { data: existingUser } = await supabase
                .from('users')
                .select('id')
                .eq('email', email)
                .single();

            if (existingUser) {
                throw new Error('Email already registered');
            }

            const newUser = {
                id: 'user_' + Math.random().toString(36).substr(2, 9),
                email,
                password,
                name: email.split('@')[0],
                token: 'nexus_' + Math.random().toString(36).substr(2, 20),
                createdAt: new Date().toISOString()
            };

            const { error: insertError } = await supabase.from('users').insert(newUser);
            if (insertError) throw insertError;

            const user: User = {
                id: newUser.id,
                email: newUser.email,
                name: newUser.name,
                token: newUser.token,
                inventory: []
            };

            setUser(user);
            localStorage.setItem('nexus_user', JSON.stringify(user));
        } catch (error: any) {
            console.error('Registration Error:', error);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = () => {
        setUser(null);
        localStorage.removeItem('nexus_user');
    };

    return (
        <AuthContext.Provider value={{ user, isAuthenticated: !!user, login, register, logout, isLoading }}>
            {children}
        </AuthContext.Provider>
    );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
