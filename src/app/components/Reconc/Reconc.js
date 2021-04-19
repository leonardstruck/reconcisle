import React, { useEffect, useState } from "react";
import { useHistory } from "react-router-dom";
import Helmet from "react-helmet";
import {
	Card,
	Elevation,
	Button,
	AnchorButton,
	NonIdealState,
	ButtonGroup,
	NumericInput,
	Code,
	Classes,
	Dialog,
	FormGroup,
	Spinner,
} from "@blueprintjs/core";
import {
	Popover2,
	Tooltip2,
	Classes as PopoverClasses,
} from "@blueprintjs/popover2";
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
	const [port, setPort] = useState(1234);
	const [drawerState, setDrawerState] = useState(false);
	const history = useHistory();
	const dispatch = useDispatch();
	const state = useSelector(selectReconciliationState);
	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}
	let query = useQuery();
	useEffect(() => {
		const projectName = query.get("name");
		fileStoreHandler({
			store: "project",
			method: "getConfig",
			obj: {
				name: projectName,
			},
		}).then((res) => {
			dispatch({ type: "Reconciliation/SET_CONFIG", payload: res });
		});
	}, []);

	const handleClick = () => {
		switch (state.serviceStatus) {
			case "inactive":
				reconciliationServiceHandler(query.get("name"), { port }).then(
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
				reconciliationServiceHandler(query.get("name"), { port }).then(
					(res) => {
						setAnimationState("startFromStopped");
						dispatch({ type: "Reconciliation/SERVICE_STARTED" });
					}
				);
				break;
		}
	};
	if (Object.keys(state.configuration).length === 0) {
		return (
			<div>
				<Helmet>
					<title>reconcIsle - {query.get("name")}</title>
				</Helmet>
				<Card elevation={Elevation.FOUR} className="centeredCard">
					<NonIdealState icon={<Spinner />} title="Reading Database" />
				</Card>
			</div>
		);
	}
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
				{state.configuration.moduleMetaData.canUpdate && (
					<p className={Classes.TEXT_SMALL}>Data last updated on:</p>
				)}
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
						{state.serviceStatus === "inactive" && "Start"}
						{state.serviceStatus === "stopped" && "Restart"}
						{state.serviceStatus === "started" && "Stop"}
					</Button>
					{state.configuration.moduleMetaData.canUpdate &&
						(state.serviceStatus === "inactive" ||
							state.serviceStatus === "stopped") && (
							<Tooltip2
								intent="warning"
								content={
									<p style={{ width: 220 }}>
										This service is able to pull new data from the configured
										source. Please keep in mind, that any previous data will
										be&nbsp;
										<b>overwritten</b>.
									</p>
								}
							>
								<Button intent="primary" icon="refresh">
									Refresh Data
								</Button>
							</Tooltip2>
						)}
					{(state.serviceStatus === "inactive" ||
						state.serviceStatus === "stopped") && (
						<Popover2
							popoverClassName={PopoverClasses.POPOVER2_CONTENT_SIZING}
							content={
								<div>
									<FormGroup
										helperText="You can use the arrow keys on your keyboard. Hold shift to change the value by 100, hold alt to change the value by 1."
										style={{ width: 150 }}
									>
										<NumericInput
											value={port}
											majorStepSize={100}
											stepSize={10}
											minorStepSize={1}
											fill={true}
											leftIcon="locate"
											autoFocus={true}
											onValueChange={(number) =>
												number >= 1025 && number <= 65535 && setPort(number)
											}
											min={1}
										/>
									</FormGroup>
								</div>
							}
						>
							<AnchorButton icon="cog">Port</AnchorButton>
						</Popover2>
					)}
				</ButtonGroup>
				<ButtonGroup large={true} minimal={true} fill={true}>
					<Button
						icon="arrow-left"
						intent="primary"
						disabled={state.serviceStatus === "started"}
						onClick={() => {
							dispatch({ type: "Reconciliation/CLEAR_CONFIG" });
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
						First you need to add reconcIsle as reconciliation service to
						OpenRefine. To do this, enter the following address when asked for
						the URL.
					</p>
					<p>
						<Code style={{ fontSize: 15 }}>
							http://localhost:{port}/reconcile/
						</Code>
					</p>
					<p>
						Refer to the public documentation when setting up a reconciliation
						service:{" "}
						<a
							href="https://docs.openrefine.org/manual/reconciling"
							target="_blank"
						>
							OpenRefine Documentation
						</a>
					</p>
					<p>
						It gives a comprehensive insight into the topic of reconciliation as
						well as other information that is essential when using OpenRefine.
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
