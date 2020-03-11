// src/hooks/useAuthSubmit.js

import React, { useState } from "react";
import axios from "../axios";

export default function useAuthSubmit(url, values) {
    const [error, setError] = useState();

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const { data } = await axios.post(url, values);
            if (data.error) {
                setError(true);
            } else {
                location.replace("/");
            }
        } catch (e) {
            setError(true);
        }
    };

    return [error, handleSubmit];
}
