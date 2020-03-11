import React, { useState, useEffect } from "react";
import ProfilePic from "./ProfilePic";
import axios from "../axios";
import useStatefulFields from "../hooks/useStatefulFields";

export default function FindPeople(props) {

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

    const clickHandler = id => {
        // console.log("I've been clicked", e);
        props.history.push(`/user/${id}`);
    };

    return (
        <>
        <h1>Find People</h1>

        <textarea onChange={setName} name="name" placeholder="enter name" placeholder="enter name" value={name.name}/>

        {!name.name &&
            <h1>Checkout  who just joined!</h1>
        }
        {users.map(
            user => (
                <div key={user.id}>
                    <p>{user.first} {user.last}</p>
                    <ProfilePic
                        id={user.id}
                        url={user.url}
                        first={user.first}
                        last={user.last}
                        clickHandler={() => {
                            clickHandler(user.id);
                        }}
                    />
                </div>
            )
        )}

        </>
    )

}
