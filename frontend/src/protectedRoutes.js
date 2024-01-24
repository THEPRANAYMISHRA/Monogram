import React, { useEffect, useState, createContext, useContext } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.init";
import { Navigate } from "react-router-dom";
import axios from "axios";
import PageLoading from "./components/pageLoading/PageLoading";

const UserContext = createContext();
export const useUser = () => useContext(UserContext);

export const ProtectedRoute = ({ children }) => {
    // const baseurl = "http://localhost:4500";
    const baseurl = "https://monogram.onrender.com";
    const [user, isLoading] = useAuthState(auth);
    const [isDetailsLoading, setDetailsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        const fetchUserDetails = async () => {
            try {
                if (user) {
                    // providing user email as token
                    const payload = {
                        tokenEmail: user.email, email: user.email
                    }
                    const response = await axios.post(`${baseurl}/user/details`, payload);
                    setUserDetails(response.data);
                }
            } catch (error) {
                console.error("Error fetching user details", error);
            } finally {
                setDetailsLoading(false);
            }
        };

        fetchUserDetails();
    }, [user]);

    if (isLoading || isDetailsLoading) {
        return <PageLoading />;
    }

    if (!user || (!userDetails && isDetailsLoading)) {
        return <Navigate to="/login" />;
    }

    if (user && userDetails) {
        return (
            <UserContext.Provider value={userDetails}>
                {children}
            </UserContext.Provider>
        );
    }

    return null;
};
