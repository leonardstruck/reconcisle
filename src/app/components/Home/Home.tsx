import * as React from "react";
import { Link } from "react-router-dom";
import { Helmet } from 'react-helmet'; 

import { Button, Card, Elevation } from "@blueprintjs/core";
import Island from "../../../assets/island.svg";



export default function Home() {
  return (
    <>
    <Helmet>
      <title>reconcIsle - Home</title>
    </Helmet>
    <Card elevation={Elevation.FOUR} className="centeredCard">
      <img src={Island} />
      <h3 className="bp3-heading" >reconcIsle</h3>
      <p className="bp3-text-large">A OpenRefine reconciliation service with a simple GUI.</p>
      <Link to="/open"><Button rightIcon="arrow-right" intent="primary" minimal={true} fill={true}>Let&apos;s get started</Button></Link>
    </Card>
    </>
  );
}
