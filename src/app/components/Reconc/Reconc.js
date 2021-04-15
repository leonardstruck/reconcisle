import React, { useState } from "react";
import { useHistory } from "react-router-dom";
import Helmet from "react-helmet";
import {
	Card,
	Elevation,
	Button,
	Spinner,
	NonIdealState,
	Callout,
	ButtonGroup,
	Collapse,
	Code,
	Drawer,
	Classes,
	Dialog,
} from "@blueprintjs/core";
import { Link, useLocation } from "react-router-dom";
import { fileStoreHandler } from "../../services/fileStoreHandler";
import { StatusAnimation } from "./StatusAnimation";
import {
	reconciliationServiceHandler,
	stopReconciliationServer,
} from "../../services/reconciliationServiceHandler";
import modules from "../../../modules/modules";
const Modules = modules();

import { useSelector, useDispatch } from "react-redux";
const selectReconciliationState = (state) => state.reconciliation;

export const Reconc = (props) => {
	const [animationState, setAnimationState] = useState("inactive");
	const [drawerState, setDrawerState] = useState(false);
	const [isAbleToRefresh, setIsAbleToRefresh] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const state = useSelector(selectReconciliationState);
	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}
	let query = useQuery();
	const projectName = query.get("name");
	let projectConfiguration;
	fileStoreHandler({
		store: "project",
		method: "getConfig",
		obj: {
			name: projectName,
		},
	}).then((res) => {
		projectConfiguration = res;
		setIsAbleToRefresh(
			Modules.getMetaData(projectConfiguration.general.sourceModule).canUpdate
		);
	});

	const handleClick = () => {
		switch (state.serviceStatus) {
			case "inactive":
				reconciliationServiceHandler(query.get("name"), { port: 8000 }).then(
					(res) => {
						setAnimationState("startFromInactive");
						dispatch({ type: "Reconciliation/SERVICE_STARTED" });
					}
				);
				break;
			case "started":
				stopReconciliationServer();
				setAnimationState("stopFromActive");
				dispatch({ type: "Reconciliation/SERVICE_STOPPED" });
				break;
			case "stopped":
				reconciliationServiceHandler(query.get("name"), { port: 8000 }).then(
					(res) => {
						setAnimationState("startFromStopped");
						dispatch({ type: "Reconciliation/SERVICE_STARTED" });
					}
				);
				break;
		}
	};
	return (
		<div>
			<Helmet>
				<title>reconcIsle - {query.get("name")}</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<NonIdealState
					icon={<StatusAnimation animationState={animationState} />}
					title={
						state.serviceStatus === "started"
							? "Service is running"
							: "Service is not running"
					}
					description={
						state.serviceStatus === "started"
							? "The Reconciliation Service is ready"
							: "Start the Service by clicking the button below"
					}
				/>
				<ButtonGroup fill={true} minimal={true} large={true}>
					<Button
						onClick={() => handleClick()}
						loading={state.loading}
						icon={
							state.serviceStatus === "inactive" ||
							state.serviceStatus === "stopped"
								? "play"
								: "stop"
						}
						intent={
							state.serviceStatus === "inactive" ||
							state.serviceStatus === "stopped"
								? "success"
								: "danger"
						}
					>
						{state.serviceStatus === "inactive" && "Start the Service"}
						{state.serviceStatus === "stopped" && "Restart the Service"}
						{state.serviceStatus === "started" && "Stop the Service"}
					</Button>
					{isAbleToRefresh &&
						(state.serviceStatus === "inactive" ||
							state.serviceStatus === "stopped") && (
							<Button intent="primary" icon="refresh">
								Refresh Data
							</Button>
						)}
				</ButtonGroup>
				<ButtonGroup large={true} minimal={true} fill={true}>
					<Button
						icon="arrow-left"
						intent="primary"
						disabled={state.serviceStatus === "started"}
						onClick={() => {
							dispatch({ type: "Reconciliation/SERVICE_INACTIVE" });
							history.push("/open");
						}}
					>
						Back
					</Button>
					<Button
						rightIcon="help"
						intent="warning"
						onClick={() => {
							setDrawerState(true);
							setAnimationState("stay");
						}}
					>
						How to Setup
					</Button>
				</ButtonGroup>
			</Card>
			<Dialog
				isOpen={drawerState}
				onClose={() => setDrawerState(false)}
				icon="info-sign"
				title="How to Setup the Reconciliation Service"
				usePortal={true}
			>
				<div className={Classes.DIALOG_BODY}>
					<p>
						First and foremost you have to setup OpenRefine to use reconcIsle as
						Reconciliation Service. To do just that, add{" "}
						<Code>http://localhost:8000/reconcisle/</Code> as a reconciliation
						service to OpenRefine.
					</p>
				</div>

				<div className={Classes.DIALOG_FOOTER}>
					<div className={Classes.DIALOG_FOOTER_ACTIONS}>
						<Button
							onClick={() => {
								setDrawerState(false);
								setAnimationState("stay");
							}}
						>
							Close
						</Button>
					</div>
				</div>
			</Dialog>
		</div>
	);
};
