import React, { useEffect, useState } from "react";
import { useAuthState } from "react-firebase-hooks/auth";
import { auth } from "./firebase.init";
import { Navigate } from "react-router-dom";
import axios from "axios";
import PageLoading from "./components/pageLoading/PageLoading";

const ProtectedRoute = ({ children }) => {
    const baseurl = "http://localhost:4500";
    // const baseurl = "https://monogram.onrender.com";
    const [user, isLoading] = useAuthState(auth);
    const [isDetailsLoading, setDetailsLoading] = useState(true);
    const [userDetails, setUserDetails] = useState(null);

    useEffect(() => {
        if (user) {
            axios.post(`${baseurl}/user/details`, { email: user.email })
                .then((res) => {
                    setUserDetails(res.data);
                })
                .catch((error) => {
                    console.error("Error fetching user details", error);
                })
                .finally(() => {
                    setDetailsLoading(false);
                });
        } else {
            setDetailsLoading(false);
        }
    }, [user]);

    if (isLoading || isDetailsLoading) {
        return <PageLoading />;
    }

    if (!user || (!userDetails && isDetailsLoading)) {
        return <Navigate to='/login' />;
    }

    if (user && userDetails) {
        return children;
    }

};

export default ProtectedRoute;
