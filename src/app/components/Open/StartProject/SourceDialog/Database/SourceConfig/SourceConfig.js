import { Callout } from "@blueprintjs/core";
import React from "react";

//import Views
import { MySQL } from "./MySQL";

export const SourceConfig = (props) => {
	switch (props.projectSettings.sourceConfig.driver) {
		case "mysql":
			return <MySQL {...props} />;
		default:
			return <Callout intent="danger" title="configuration view missing" />;
	}
};
