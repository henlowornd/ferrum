import React from "react";
import ReactTestUtils from "react-dom/test-utils";
import ListItem from "../client/components/ListItem";
import { ListItemProps, ListItemState } from "../client/types";
import Utils from "../Utils";

describe("ListItem Component tests", () => {
    var component = ReactTestUtils.renderIntoDocument<ListItemProps, React.Component<ListItemProps, ListItemState, any>>(
        <ListItem
            itemType="file"
            itemName="test.txt"
            itemSize={1.01}
            itemInfo={JSON.stringify({})}
            itemPath="C:/a/b/c/d/test.txt"
            onClick={() => {}}/>
    );
    
    test("Ref test", () => {
        expect((component as ListItem).renameBoxRef).not.toBeNull();
    });

    test("Clicking test", async () => {
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "button"));
        await Utils.sleep(250);
        expect(component.state.isSelected).toBeTruthy();
        
        ReactTestUtils.Simulate.click(ReactTestUtils.findRenderedDOMComponentWithTag(component, "button"));
        await Utils.sleep(250);
        expect(component.state.isRenaming).toBeTruthy();
    });
});