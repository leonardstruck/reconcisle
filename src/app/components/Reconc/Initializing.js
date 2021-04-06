import { NonIdealState } from "@blueprintjs/core";
import React from "react";

export const Initializing = () => {
    return (
	    <NonIdealState icon={<Spinner />} title="Loading Project" />;
    )
}