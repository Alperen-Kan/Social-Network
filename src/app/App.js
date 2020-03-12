import React from "react";
import axios from "../axios";
import { BrowserRouter, Route, Link } from "react-router-dom";
import Profile from "./Profile";
import ProfilePic from "./ProfilePic";
import BioEditor from "./BioEditor";
import Uploader from "./Uploader";
import OtherProfile from "./OtherProfile";
import FindPeople from "./FindPeople";
import Header from "./Header.js";

export default class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {};
    }

    componentDidMount() {
        console.log("App is running");
        axios.get("/user")
            .then( ({data}) => {
                console.log("get /user response:", data);
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
            <BrowserRouter>
                <div>
                    <Header data={this.state}/>
                    <Route
                        exact path="/"
                        render={() => (
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

                        )}
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
                        />
                    }

                    <Route
                         path="/user/:id"
                         render={props => (
                             <OtherProfile
                                 key={props.match.url}
                                 match={props.match}
                                 history={props.history}
                             />
                         )}
                    />

                    <Route
                        path="/findpeople"
                        render={props => (
                            <FindPeople
                                history={props.history}
                            />
                        )}
                    />

                </div>
            </BrowserRouter>
            </>
        );
    }
}

/*
this.state.uploaderVisible &&
    <Uploader
        id={this.state.id}
        setImage={newUrl => this.setState({
            url: newUrl
        })}
        closeUploader={event => this.setState({
            uploaderVisible: false
        })}
    />
*/
