// src/hooks/useAuthSubmit.js

import React, { useState } from "react";
import axios from "../axios";

export default function useAuthSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (url == "/login") {
            if (!values.email || !values.password) {
                // error
                if (!values.email) {
                    return setError("Please enter your email address");
                } else if (values.email && !values.password) {
                    return setError("Please enter your password");
                }
            }
        } else if (url == "/registration"){
            if (
                !values.first ||
                !values.last ||
                !values.email ||
                !values.password
            ) {
                // error
                if (!values.first) {
                    return setError("Please enter your first name");
                } else if (
                    values.first &&
                    !values.last
                ) {
                    return setError("Please enter your last name");

                } else if (
                    values.first &&
                    values.last &&
                    !values.email
                ) {
                    return setError("Please enter your email address");
                    
                } else if (
                    values.first &&
                    values.last &&
                    values.email &&
                    !values.password
                ) {
                    return setError("Please enter your password");

                } else if (
                    values.first &&
                    values.last &&
                    values.email &&
                    values.password &&
                    !values.password2
                ) {
                    return setError("Please verify your password");

                } else if (
                    values.first &&
                    values.last &&
                    values.email &&
                    values.password &&
                    values.password2 &&
                    (values.password !== values.password2)
                ) {
                    return setError("Password incorrect, please verify your password");
                }
            }
        }
        try {
            const { data } = await axios.post(url, values);
            if (data.error) {
                setError(data.error);
            } else {
                location.replace("/");
            }
        } catch (e) {
            setError("Could not reach server");
        }
    };

    return [error, handleSubmit];
}
