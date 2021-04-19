import React, { useState } from "react";
import { Helmet } from "react-helmet";

import { Button, ButtonGroup, Card, Elevation } from "@blueprintjs/core";

import { StartProject } from "./StartProject/StartProject";
import { ProjectList } from "./ProjectList";
import { useHistory } from "react-router";

export const Open = () => {
	const [startProjectState, setStartProjectState] = useState({ isOpen: false });
	const history = useHistory();

	return (
		<div>
			<Helmet>
				<title>reconcIsle - Project Overview</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<ProjectList {...{ startProjectState, setStartProjectState }} />
				<ButtonGroup fill={true} large={true} minimal={true}>
					<Button
						icon="arrow-left"
						intent="primary"
						onClick={() => history.push("/")}
					>
						Back
					</Button>
					<Button
						rightIcon="build"
						intent="primary"
						onClick={() => history.push("tools")}
						disabled={true}
					>
						Tools
					</Button>
				</ButtonGroup>
			</Card>
			<StartProject
				{...startProjectState}
				setStartProjectState={setStartProjectState}
			/>
		</div>
	);
};
