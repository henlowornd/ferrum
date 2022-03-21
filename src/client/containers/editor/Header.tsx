import { Component, ReactElement } from "react";

import { EditorHeaderProps } from "../../types";

export default class Header extends Component<EditorHeaderProps, {}> {
    public constructor(props: EditorHeaderProps) {
        super(props);
    }
    
    public render(): ReactElement {
        return (
            <div className="header-container">
                <h1>Ferrum Text Editor</h1>
                <p>Path: {this.props.path}</p>
            </div>
        );
    }
}