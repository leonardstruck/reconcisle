import {
	Callout,
	FormGroup,
	Position,
	Radio,
	RadioGroup,
	Toast,
	Toaster,
} from "@blueprintjs/core";
import React, { useState } from "react";

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
	const [toasts, setToasts] = useState([]);
	return (
		<div>
			<Notifications toasts={toasts} setToasts={setToasts} />
			<Callout title="Explore your databases" intent="primary">
				reconcIsle is compatible with the following relational databases:
			</Callout>
			<FormGroup label="Source">
				<RadioGroup inline={true}>
					<Radio label="PostgreSQL" value="postgres" />
					<Radio label="MySQL" value="mysql" />
					<Radio label="MariaDB" value="mariadb" />
					<Radio label="SQLite" value="sqlite" />
					<Radio label="Microsoft SQL" value="microsoft" />
				</RadioGroup>
			</FormGroup>
		</div>
	);
};
