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
import { serviceHandler } from "../../../services/serviceHandler";
import { Notifications } from "../../../services/Notifications";

import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

export const StartProject = (props) => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const handleSubmit = () => {
		const moduleMetaData = Modules.getMetaData(state.sourceModule);
		console.log("This is the moduleMetaDATA:", moduleMetaData);
		setIsSubmitting(true);
		fileStoreHandler({
			store: "project",
			method: "newProject",
			obj: {
				general: { name: state.name, sourceModule: state.sourceModule },
				moduleMetaData: moduleMetaData,
				sourceConfig: state.sourceConfig,
				reconcParams: state.reconcParams,
			},
		}).then((response) => {
			serviceHandler(state.sourceModule, "getData", state.sourceConfig).then(
				(res) => {
					fileStoreHandler({
						store: "project",
						method: "saveData",
						obj: {
							name: state.name,
							data: res.data,
						},
					}).then((res) => {
						if (res.status === "ok") {
							props.setStartProjectState({ isOpen: false });
							setIsSubmitting(false);
						} else {
							throw new Error("Something didn't work");
						}
					});
				}
			);
		});
	};

	const SourceConfig =
		state.sourceModule !== ""
			? Modules.getConfigView(state.sourceModule)
			: () => {
					return <h1>Loading Source Module</h1>;
			  };

	return (
		<div>
			<Notifications />
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
		</div>
	);
};
