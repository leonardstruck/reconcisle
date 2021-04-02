import { Callout } from "@blueprintjs/core";
import React from "react";

//import Views
import { MySQL } from "./MySQL";

export const DriverConfig = (props) => {
	switch (props.projectSettings.sourceConfig.driver) {
		case "mysql":
			return props.projectSettings.sourceConfig.advanced ? (
				<Callout intent="danger" title="configuration view missing" />
			) : (
				<MySQL {...props} />
			);
		default:
			return <Callout intent="danger" title="configuration view missing" />;
	}
};
