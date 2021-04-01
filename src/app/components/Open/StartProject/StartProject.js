import { DialogStep, MultistepDialog } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

//import Dialogs
import { GeneralDialog } from "./GeneralDialog";
import { SourceDialog } from "./SourceDialog/SourceDialog";

export const StartProject = (props) => {
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const [projectSettings, setProjectSettings] = useState({
		general: {
			name: "",
			source: "database",
		},
	});
	return (
		<MultistepDialog
			title="Start a new Project"
			{...props}
			nextButtonProps={{ disabled: nextButtonDisabled }}
		>
			<DialogStep
				id="general"
				title="General"
				panel={
					<GeneralDialog
						{...{ projectSettings, setProjectSettings, setNextButtonDisabled }}
					/>
				}
				setNextButtonDisabled
			/>
			<DialogStep
				id="sourceDialog"
				title="Configure Source"
				panel={
					<SourceDialog
						{...{ projectSettings, setProjectSettings, setNextButtonDisabled }}
					/>
				}
			/>
		</MultistepDialog>
	);
};
