import React, { useState } from "react";
import Helmet from "react-helmet";
import {
	Card,
	Elevation,
	Button,
	Spinner,
	NonIdealState,
	Callout,
} from "@blueprintjs/core";
import { Link, useLocation } from "react-router-dom";
import { fileStoreHandler } from "../../services/fileStoreHandler";

const Loading = (props) => {
	const initialize = () => {
		fileStoreHandler({
			store: "project",
			method: "checkIfDataAvailable",
			obj: { name: props.project },
		}).then((res) => {
			console.log("checkIfDataAvailable returned ", res);
			if (res.status === "ok") {
				if (res.isDataAvailable) {
					props.setDataState("founddata");
				} else {
					props.setDataState("firstdl");
				}
			} else {
				props.setDataState("error");
			}
		});
	};

	const downloadData = () => {
		fileStoreHandler({
			store: "project",
			method: "downloadData",
			obj: { name: props.project },
		}).then((res) => {
			console.log(res);
			if (res.status === "ok") {
				props.setDataState("startservice");
			} else {
				props.setDataState("error");
			}
		});
	};
	switch (props.action) {
		case "initialize":
			initialize();
			break;
		case "download":
			downloadData();
			break;
	}
	return <NonIdealState icon={<Spinner />} title={props.title} />;
};

const Views = (props) => {
	const [dataState, setDataState] = useState("");
	switch (dataState) {
		case "":
			return (
				<Loading
					title="Initializing"
					action="initialize"
					project={props.project}
					setDataState={setDataState}
				/>
			);
		case "firstdl":
			return (
				<Loading
					title="Downloading Data from Source"
					action="download"
					project={props.project}
					setDataState={setDataState}
				/>
			);
		case "startservice":
			return (
				<Loading
					title="Starting Reconciliation Service"
					action="start"
					project={props.project}
					setDataState={setDataState}
				/>
			);
		default:
			return (
				<Callout intent="danger">
					<h1>An Error occured</h1>
				</Callout>
			);
	}
};

export const Reconc = (props) => {
	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}
	let query = useQuery();
	return (
		<div>
			<Helmet>
				<title>reconcIsle - {query.get("name")}</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<h3 className="bp3-heading">{query.get("name")}</h3>
				<Views project={query.get("name")} />
				<Link to="/Open">
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
		</div>
	);
};
