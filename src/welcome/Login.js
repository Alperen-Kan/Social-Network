import React from "react";
import { Link } from 'react-router-dom';
import useStatefulFields from "../hooks/useStatefulFields";
import useAuthSubmit from "../hooks/useAuthSubmit";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    return (
        <div>
            <h1>Log in</h1>
            { error && <p>{error}</p>}
            <form>
                <form onSubmit={handleSubmit}>
                    <input name="email" type="text" placeholder="email" onChange={handleChange}/>
                    <input name="password" type="password" placeholder="password" onChange={handleChange}/>
                    <button type="submit">log in</button>
                </form>
                <p>Forgot your password? <Link to="/reset">Click here</Link> to reset it.</p>
                <p>Not a member yet? <Link to="/">Click here</Link> to register.</p>
            </form>
        </div>
    );
}

/*
rules of hooks

1. can only be used in function components
2. they must start with the word "use"
3. they must be called at the top level of the component (ie can't be called in loops)
*/
