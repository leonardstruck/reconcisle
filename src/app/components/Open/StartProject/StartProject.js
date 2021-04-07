import {
	DialogStep,
	MultistepDialog,
	Spinner,
	NonIdealState,
} from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

import modules from "../../../../modules/modules";
const Modules = modules();

//import Dialogs
import { GeneralDialog } from "./GeneralDialog";
import { ReconcParams } from "./ReconcParams";

import { fileStoreHandler } from "../../../services/fileStoreHandler";

import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

export const StartProject = (props) => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
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
		fileStoreHandler({
			store: "project",
			method: "newProject",
			obj: projectSettings,
		}).then((response) => {
			props.setStartProjectState({ isOpen: false });
			setIsSubmitting(false);
		});
	};

	const SourceConfig =
		state.sourceModule !== ""
			? Modules.getConfigView(state.sourceModule)
			: () => {
					return <h1>Loading Source Module</h1>;
			  };

	return (
		<MultistepDialog
			title="Start a new Project"
			{...props}
			backButtonProps={{ minimal: true, large: true }}
			nextButtonProps={{
				disabled: state.nextButtonDisabled,
				minimal: true,
				large: true,
			}}
			finalButtonProps={{
				minimal: true,
				large: true,
				disabled: state.nextButtonDisabled,
				onClick: handleSubmit,
			}}
			onClosed={() => {
				dispatch({ type: "Component/StartProject/RESET_FORM_STATE" });
			}}
			onClose={() => {
				props.setStartProjectState({ isOpen: false });
			}}
		>
			<DialogStep id="general" title="General" panel={<GeneralDialog />} />
			<DialogStep
				id="sourceDialog"
				title="Configure Source"
				panel={<SourceConfig />}
			/>
			<DialogStep
				id="reconcParams"
				title="Set Reconciliation Parameters"
				panel={
					isSubmitting ? (
						<NonIdealState icon={<Spinner />} title="Saving Project" />
					) : (
						<ReconcParams />
					)
				}
			/>
		</MultistepDialog>
	);
};
