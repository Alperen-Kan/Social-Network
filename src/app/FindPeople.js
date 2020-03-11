import React, { useState, useEffect } from "react";
import axios from "../axios";
import useStatefulFields from "../hooks/useStatefulFields";

export default function FindPeople() {

    const [name, setName ] = useStatefulFields();
    const [users, setUsers] = useState([]);
    console.log("name:", name);

    useEffect( () => {
        let abort;
        ( async () => {
            if (name.name) {
                const { data } = await axios.post("/users", {name: name.name});
                if (!abort) {
                    setUsers(data);
                }
            } else if (!name.name) {
                const { data } = await axios.get("/recent-users");
                if (!abort) {
                    setUsers(data);
                }
            }

            // const { data } = await axios.get("/recent-users");
            // console.log("data:", data);
            // setUsers(data);
        })();
        return () => {
            abort = true;
        };
    }, [name]);



    return (
        <>
        <h1>Find People</h1>
        {!name &&
            <p>Checkout  who just joined!</p>
        }

        {name.name &&
            <textarea onChange={setName} name="name" placeholder="enter name" value={name.name}/>
        }

        {users.map(
            user => (
                <div key={user.id}>
                    <p>{user.first} {user.last}</p>
                    <img src={user.url}/>
                </div>
            )
        )}

        {!name.name &&
            <input onChange={setName} name="name" type="text" placeholder="enter name"/>
        }
        </>
    )

}
