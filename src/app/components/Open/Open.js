import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";

import { Button, Card, Elevation } from "@blueprintjs/core";

import { StartProject } from "./StartProject/StartProject";
import { ProjectList } from "./ProjectList";

export const Open = () => {
	const [startProjectState, setStartProjectState] = useState({ isOpen: false });

	return (
		<div>
			<Helmet>
				<title>reconcIsle - Open</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<ProjectList {...{ startProjectState, setStartProjectState }} />
				<Link to="/">
					<Button
						icon="arrow-left"
						intent="primary"
						large={true}
						minimal={true}
					>
						Back
					</Button>
				</Link>
			</Card>
			<StartProject
				{...startProjectState}
				setStartProjectState={setStartProjectState}
			/>
		</div>
	);
};
