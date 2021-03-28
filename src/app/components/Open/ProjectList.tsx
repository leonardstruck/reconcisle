import React from "react";
import { useState, useEffect } from "react";
import { HTMLTable, Button, Menu, Spinner, NonIdealState } from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2"

import {storeHandler}  from '../storeHandler';
import StartProject from "./StartProject";


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
  const [isLoading, setIsLoading] = useState(true);
  const [projects, setProjects] = useState<object | unknown>({projects: []});
  const [projectCount, setProjectCount] = useState<number | unknown>(0);
  const [startProjectState, setStartProjectState] = useState({
    isOpen: false,
  })
  useEffect(() => {
    storeHandler({store: "projects", method: "size"}).then((response) => {
      setProjectCount(response);
    })
  storeHandler({store: "projects", method: "store"}).then((response) => {
    setProjects(response);
    setIsLoading(false);
  });
  }, []);

  if(isLoading) {
    return (
      <NonIdealState 
      icon={<Spinner />}
        title="Reading Database"
      />
    );
  } else if(projectCount === 0) {
    const handleOpen = () => {setStartProjectState({isOpen: true})};
    const handleClose = () => {setStartProjectState({isOpen: false})};
    return(
      <>
      <NonIdealState 
        title="No projects found"
        icon="folder-new"
        action={<Button onClick={handleOpen}>Start a new Project</Button>}
      />
      <StartProject {...startProjectState} onClose={handleClose} />
      </>
    )
  }
  else {
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
    )
  }
}
