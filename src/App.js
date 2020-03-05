import React from "react";
import axios from "./axios";
import ProfilePic from "./ProfilePic";
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
            });
    }

    render() {
        if (!this.state.id) {
            return null; {/*<img src="/progressbar.gif" alt="Loading..." />;*/}
        }
        return (
            <>
                <h1>Profile</h1>
                <ProfilePic
                    first={this.state.first}
                    last={this.state.last}
                    url={this.state.url}
                    clickHandler={() => this.setState({
                        uploaderVisible: true
                    })}
                />
                {this.state.uploaderVisible &&
                    <Uploader
                        id={this.state.id}
                        finishedUploading={newUrl => this.setState({
                            image: newUrl
                        })}
                    />}
            </>
        );
    }
}
