import React from "react";
import axios from "../axios";

export default class BioEditor extends React.Component {

    constructor(props) {
        super(props);
        this.state = {};
        this.uploadBio = this.uploadBio.bind(this);
        this.updateBio = this.updateBio.bind(this);
        this.toggleEditor = this.toggleEditor.bind(this);
        this.openEditor = this.openEditor.bind(this);
    }

    componentDidMount() {
        console.log("bioEditor has mounted");
        this.setState({
            bioEditorIsVisible: false,
            bio: this.props.bio
        });
    }

    uploadBio(e) {
        e.preventDefault();
        axios.post("/updatebio", {bio: this.state.bio})
            .then( ({data}) => {
                this.toggleEditor();
                console.log("POST /bio response:", data.bio);
                this.props.setBio(data.bio);
            })
            .catch(error => console.log("error in uploadBio:", error));
    }

    updateBio(e) {
        e.preventDefault();
        console.log("updateBio:", e.target.value);
        this.setState({
            bio: e.target.value
        }, () => console.log("this.state.bio:", this.state.bio));
    }

    toggleEditor() {
        this.setState({
            bioEditorIsVisible: !this.state.bioEditorIsVisible
        });
    }

    openEditor() {
        this.toggleEditor();
        // this.editor.current.value = this.state.bio;
    }

    render() {
        return (
            <div>
                {!this.state.bioEditorIsVisible && this.state.bio &&
                    <div>
                        <p>{this.state.bio}</p>
                        <button onClick={this.openEditor}>edit bio</button>
                    </div>
                }

                {!this.state.bioEditorIsVisible && !this.state.bio &&
                    <div>
                        <button onClick={this.openEditor}>add bio</button>
                    </div>
                }

                {this.state.bioEditorIsVisible &&
                    <div>
                        <textarea value={this.state.bio} onChange={this.updateBio} placeholder="please enter your bio here"></textarea>
                        <button onClick={this.uploadBio}>save bio</button>
                    </div>
                }
            </div>
        );
    }

}
