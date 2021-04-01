import React from "react";

//import Source views
import { Database } from "./Database/Database";

export const SourceDialog = (props) => {
	switch (props.projectSettings.general.source) {
		case "database":
			return <Database {...props} />;
		default:
			return (
				<h1>No View available for {props.projectSettings.general.source}</h1>
			);
	}
};
