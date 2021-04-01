import { Collapse, Position, Toast, Toaster } from "@blueprintjs/core";
import React, { useEffect, useState } from "react";

import { SelectSource } from "./SelectSource";
import { SourceConfig } from "./SourceConfig/SourceConfig";

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
			<SelectSource {...props} />
			<Collapse
				isOpen={props.projectSettings.sourceConfig.driver !== undefined}
			>
				<SourceConfig {...props} setToasts={setToasts} />
			</Collapse>
		</div>
	);
};
