import React, { useState, useEffect } from 'react';
import AsyncStorage from '@react-native-async-storage/async-storage';
import AuthContext from '../AuthContext';

export default AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        // Check AsyncStorage for authentication state
        const checkAuthentication = async () => {
            try {
                const userToken = await AsyncStorage.getItem('userData');
                setIsLoggedIn(userToken != null ? true : false);
                setUser(JSON.parse(userToken));
                console.log("USE_EFFECT: ", JSON.parse(userToken))
            } catch (error) {
                console.error('Error reading authentication state:', error);
            } finally {
                setIsLoading(false);
            }
        };

        checkAuthentication();
    }, []);

    const login = async (userData) => {
        try {
            // Perform login logic
            // Example: authenticate user, get token
            console.log('login', JSON.stringify(userData));
            await AsyncStorage.setItem('userData', JSON.stringify(userData));
            console.log("between" , userData)
            setUser(userData);
            console.log("first" ,userData);
            setIsLoggedIn(true);
        } catch (error) {
            console.error('Error during login:', error);
        }
    };

    const logout = async () => {
        try {
            // Perform logout logic
            // Example: clear token
            await AsyncStorage.clear();
            setIsLoggedIn(false);
            setUser(null);
        } catch (error) {
            console.error('Error during logout:', error);
        }
    };

    const authContext = {
        isLoading,
        isLoggedIn,
        user,
        setUser,
        login,
        logout,
    };

    return <AuthContext.Provider value={{ user, setUser, isLoading, isLoggedIn, login, logout }}>{children}</AuthContext.Provider>;
};