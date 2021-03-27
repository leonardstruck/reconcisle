import * as React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Button, Card, Elevation } from "@blueprintjs/core";

import ProjectList from "./ProjectList";


export default function Open() {
  return (
    <>
      <Helmet>
        <title>reconcIsle - Open</title>
      </Helmet>
      <Card elevation={Elevation.FOUR} className="centeredCard">
        <ProjectList />
          <Link to="/">
            <Button icon="arrow-left" intent="primary" minimal={true}>
              Back
            </Button>
          </Link>
      </Card>
    </>
  );
}
