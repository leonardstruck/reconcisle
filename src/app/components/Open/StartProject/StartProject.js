import { DialogStep, FormGroup, MultistepDialog } from "@blueprintjs/core";
import React from "react";

export const StartProject = (props) => {
	return (
		<MultistepDialog title="Start a new Project" {...props}>
			<DialogStep
				id="general"
				title="General"
				panel={
					<div>
						<FormGroup label="Name" labelInfo="(required)"></FormGroup>
					</div>
				}
			/>
		</MultistepDialog>
	);
};
