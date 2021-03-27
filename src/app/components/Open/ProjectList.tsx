import React from "react";
import { HTMLTable, Button, Menu } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2"

function SubMenu() {
  return (
    <Popover content={
      <Menu>
        <Menu.Item text="Rename" icon="edit" intent="primary" />
        <Menu.Item text="Export" icon="share" intent="primary" />
        <Menu.Divider />
        <Menu.Item text="Delete" icon="trash" intent="danger"/>
      </Menu>
    }
    placement="right-start"
    >
      <Button icon="more" minimal={true} />
    </Popover>
)
}

export default function ProjectList() {
  return (
    <HTMLTable style={{ flexGrow: 1 }} interactive={true}>
      <thead>
        <tr>
          <th>Please select a project</th>
        </tr>
      </thead>
      <tbody>
        <tr>
          <td>Projekt 1</td>
          <td>
            <SubMenu />
          </td>
        </tr>
        <tr>
          <td>Projekt 2</td>
          <td>
            <SubMenu />
          </td>
        </tr><tr>
          <td>Projekt 3</td>
          <td>
            <SubMenu />
          </td>
        </tr>
      </tbody>
    </HTMLTable>
  );
}
