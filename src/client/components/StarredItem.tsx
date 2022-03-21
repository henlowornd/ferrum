import { Component, ReactElement } from "react";
import { ListGroup } from "react-bootstrap";
import { hostname } from "../pages/Explorer";
import { StarredItemProps } from "../types";

export default class StarredItem extends Component<StarredItemProps, {}> {
    public constructor(props: StarredItemProps) {
        super(props);
    }

    public render(): ReactElement {
        return (
            <ListGroup.Item
                action
                title="Double click to open."
                onDoubleClick={() => {
                    window.location.href = hostname +":3000/dir/"+ this.props.itemPath.replace("C:/", "");
                }}
            >
                <span className="list-item-name">{this.props.itemPath}</span>
            </ListGroup.Item>
        );
    }
}