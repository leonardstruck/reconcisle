import * as React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Island from "../assets/island.svg";

import { Button, Card, Elevation } from "@blueprintjs/core";

export const Home = () => {
	return (
		<>
			<Helmet>
				<title>reconcIsle - Home</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<Island />
				<h3 className="bp3-heading">reconcIsle</h3>
				<p className="bp3-text-large">
					A OpenRefine reconciliation service with a simple GUI.
				</p>
				<Link to="/open">
					<Button
						rightIcon="arrow-right"
						large={true}
						intent="primary"
						minimal={true}
						fill={true}
					>
						Let's get started
					</Button>
				</Link>
			</Card>
		</>
	);
};
