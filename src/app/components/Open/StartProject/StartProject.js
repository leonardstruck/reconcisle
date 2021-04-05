import {
	DialogStep,
	MultistepDialog,
	Spinner,
	NonIdealState,
} from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

//import Dialogs
import { GeneralDialog } from "./GeneralDialog";
import { SourceDialog } from "./SourceDialog/SourceDialog";
import { ReconcParams } from "./ReconcParams";

import { fileStoreHandler } from "../../../services/fileStoreHandler";

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
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSubmit = () => {
		setIsSubmitting(true);
		setNextButtonDisabled(true);
		fileStoreHandler({
			store: "project",
			method: "newProject",
			obj: projectSettings,
		}).then((response) => {
			props.setStartProjectState({ isOpen: false });
			setIsSubmitting(false);
		});
	};
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
				onClick: handleSubmit,
			}}
			onClosed={() => {
				setProjectSettings(initialSettings);
			}}
			onClose={() => {
				props.setStartProjectState({ isOpen: false });
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
					isSubmitting ? (
						<NonIdealState icon={<Spinner />} title="Saving Project" />
					) : (
						<ReconcParams
							{...{
								projectSettings,
								setProjectSettings,
								setNextButtonDisabled,
							}}
						/>
					)
				}
			/>
		</MultistepDialog>
	);
};
