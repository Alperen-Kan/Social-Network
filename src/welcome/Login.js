import React from "react";
import Error from "./Error";
import { Link } from 'react-router-dom';
import useStatefulFields from "../hooks/useStatefulFields";
import useAuthSubmit from "../hooks/useAuthSubmit";

export default function Login() {
    const [values, handleChange] = useStatefulFields();
    const [error, handleSubmit] = useAuthSubmit("/login", values);

    return (
        <form>
            { error && <p>something went wrong </p>}
            <input name="email" type="text" onChange={handleChange}/>
            <input name="password" type="password" onChange={handleChange}/>
            <button onClick={handleSubmit}>log in</button>
        </form>
    );
}

// export default class Login extends React.Component {
//     constructor() {
//         super();
//         this.state = {
//             errors: {}
//         };
//         this.handleChange = this.handleChange.bind(this);
//         this.submit = this.submit.bind(this);
//     }
//
//     handleChange(e) {
//         this.setState(
//             {[e.target.name]: e.target.value},
//             () => console.log(this.state)
//         );
//     }
//
//     async submit(e) {
//         e.preventDefault();
//         if (this.state.email &&
//             this.state.password) {
//
//             const { data } = await axios.post("/login", {data: this.state});
//             console.log("response:", data);
//             if (data.success) {
//                 location.replace('/');
//             } else {
//                 console.log(data.error);
//             }
//
//         } else {
//             // error: form not filled-
//         }
//     }
//
//     render() {
//         return (
//             <div id="form-container">
//                 <h1>Log in</h1>
//                 <form onSubmit={this.submit}>
//
//                     <input onChange={this.handleChange} type="text" name="email" placeholder="email"/>
//
//                     <input onChange={this.handleChange} type="password" name="password" placeholder="password"/>
//
//                     <button type="submit">Log in</button>
//                 </form>
//                 <Link to="/reset">Reset password</Link>
//             </div>
//         );
//     }
// }

/*
rules of hooks

1. can only be used in function components
2. they must start with the word "use"
3. they must be called at the top level of the component (ie can't be called in loops)
*/
