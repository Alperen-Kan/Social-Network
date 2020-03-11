import React from "react";
import axios from "../axios";
import FriendButton from "./FriendButton";

export default class OtherProfile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("OtherProfile has mounted");
        console.log("user id:", this.props.match.params.id);
        axios.get(`/user/${this.props.match.params.id}.json`).then(
            ({data}) => {
                if (data.redirectTo == '/') { // if the server says the id in the url belongs to the logged in user (optional)
                    this.props.history.push('/');
                } else if (data.error) { // some test to determine a user was not found
                    console.log("error: user doesn't exist");
                    this.setState({
                        error: true
                    });
                } else {
                    // console.log("data:", data);
                    this.setState({ ...data}, () => console.log("this.state:",this.state));
                }
            }
        );
    }

    render() {
        return (
            <div>
                {
                    !this.state.error && this.state.id &&
                    <div>
                        <img
                            src={this.state.url}
                            alt={`${this.state.first} ${this.state.last}`}
                        />
                        <FriendButton otherUserId={this.props.match.params.id} />
                        <p>{this.state.bio}</p>
                    </div>
                }
            </div>
        );
    }
}
