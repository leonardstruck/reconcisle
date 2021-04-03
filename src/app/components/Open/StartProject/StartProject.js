import { DialogStep, MultistepDialog } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

//import Dialogs
import { GeneralDialog } from "./GeneralDialog";
import { SourceDialog } from "./SourceDialog/SourceDialog";
import { ReconcParams } from "./ReconcParams";

export const StartProject = (props) => {
	const [nextButtonDisabled, setNextButtonDisabled] = useState(true);
	const initialSettings = {
		general: {
			name: "",
			source: "database",
		},
		sourceConfig: {},
		reconcParams: {
			searchColumn: "",
			idColumn: "",
		},
	};
	const [projectSettings, setProjectSettings] = useState(initialSettings);
	return (
		<MultistepDialog
			title="Start a new Project"
			{...props}
			backButtonProps={{ minimal: true, large: true }}
			nextButtonProps={{
				disabled: nextButtonDisabled,
				minimal: true,
				large: true,
			}}
			finalButtonProps={{
				minimal: true,
				large: true,
				disabled: nextButtonDisabled,
			}}
			onClosed={() => {
				setProjectSettings(initialSettings);
			}}
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
			<DialogStep
				id="reconcParams"
				title="Set Reconciliation Parameters"
				panel={
					<ReconcParams
						{...{ projectSettings, setProjectSettings, setNextButtonDisabled }}
					/>
				}
			/>
		</MultistepDialog>
	);
};
