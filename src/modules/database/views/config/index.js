import React, { useEffect } from "react";
import { Collapse } from "@blueprintjs/core";
import { SelectDriver } from "./SelectDriver";
import { DriverConfig } from "./DriverConfig/DriverConfig.js";

import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

export const configView = () => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	useEffect(() => {
		if (
			(state.sourceConfig.connectionStatus === "ok" &&
				state.sourceConfig.table &&
				!state.sourceConfig.advanced) ||
			(state.sourceConfig.connectionStatus === "ok" &&
				state.sourceConfig.advanced)
		) {
			dispatch({ type: "Component/StartProject/ENABLE_NEXT_BUTTON" });
		} else {
			dispatch({ type: "Component/StartProject/DISABLE_NEXT_BUTTON" });
		}
	}, [state.sourceConfig]);
	return (
		<div>
			<SelectDriver />
			<Collapse isOpen={state.sourceConfig.driver !== undefined}>
				<DriverConfig />
			</Collapse>
		</div>
	);
};
