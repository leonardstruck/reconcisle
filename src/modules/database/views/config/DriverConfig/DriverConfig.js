import { Callout } from "@blueprintjs/core";
import React from "react";

import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

// import Views
import { MySQL } from "./MySQL";

export const DriverConfig = () => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);

	switch (state.sourceConfig.driver) {
		case "mysql":
			return <MySQL />;
		default:
			return (
				<Callout intent="danger" title="the configuration view is missing" />
			);
	}
};
