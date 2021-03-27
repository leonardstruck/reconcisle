import * as React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Button, ButtonGroup, Card, Elevation } from "@blueprintjs/core";

import ProjectList from "./ProjectList";

export default function Open() {
  return (
    <>
      <Helmet>
        <title>reconcIsle - Open</title>
      </Helmet>
      <Card elevation={Elevation.FOUR} className="centeredCard">
        <ProjectList />
        <ButtonGroup minimal={true} fill={true}>
          <Link to="/">
            <Button icon="arrow-left" intent="primary">
              Back
            </Button>
          </Link>
          <Button icon="plus" intent="success">
            Create New Project
          </Button>
        </ButtonGroup>
      </Card>
    </>
  );
}
