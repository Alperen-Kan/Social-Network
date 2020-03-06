import React from "react";
import axios from "../axios";
import Profile from "./Profile";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor"
import Uploader from "./Uploader";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("App is running");
        axios.get("/user")
            .then( ({data}) => {
                console.log("get /users response:", data);
                this.setState({ ...data}, () => console.log("this.state:", this.state));
            })
            .catch(error => console.log("error in GET /user:", error));
    }

    render() {
        if (!this.state.id) {
            return <img id="loading-icon" src="/loading.gif" alt="Loading..." />;
        }
        return (
            <>
                <h1>Social Isolation</h1>
                <Profile
                    first={this.state.first}
                    last={this.state.last}

                    profilePic={
                        <ProfilePic
                            first={this.state.first}
                            last={this.state.last}
                            url={this.state.url}
                            openUploader={() => this.setState({
                                uploaderVisible: true
                            })}
                        />
                    }

                    bioEditor={
                        <BioEditor
                            bio={this.state.bio}
                            setBio={newBio => this.setState({
                                bio: newBio
                            })}
                        />
                    }
                />
                {this.state.uploaderVisible &&
                    <Uploader
                        id={this.state.id}
                        setImage={newUrl => this.setState({
                            url: newUrl
                        })}
                        closeUploader={event => this.setState({
                            uploaderVisible: false
                        })}
                    />}
            </>
        );
    }
}
