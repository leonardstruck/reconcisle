import { Collapse, Position, Toast, Toaster } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

import { SelectDriver } from "./SelectDriver";
import { DriverConfig } from "./DriverConfig/DriverConfig";

const Notifications = (props) => {
	const toasts = props.toasts;
	const setToasts = props.setToasts;
	return (
		<Toaster position={Position.TOP}>
			{toasts.map((toast) => (
				<Toast {...toast} key={toast.message} onDismiss={() => setToasts([])} />
			))}
		</Toaster>
	);
};

export const Database = (props) => {
	useEffect(() => {});
	const [toasts, setToasts] = useState([]);
	return (
		<div>
			<Notifications toasts={toasts} setToasts={setToasts} />
			<SelectDriver {...props} />
			<Collapse
				isOpen={props.projectSettings.sourceConfig.driver !== undefined}
			>
				<DriverConfig {...props} setToasts={setToasts} />
			</Collapse>
		</div>
	);
};
