import React, { useEffect, useState } from "react";
import {
	Button,
	ButtonGroup,
	FormGroup,
	InputGroup,
	Intent,
	MenuItem,
	NumericInput,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Select } from "@blueprintjs/select";

import { serviceHandler } from "../../../../../../services/serviceHandler";

export const MySQL = (props) => {
	const [availableTables, setAvailableTables] = useState(["heya", "huya"]);
	const [isConnecting, setIsConnecting] = useState(false);
	const [isRefreshing, setIsRefreshing] = useState(false);
	const [isFaulty, setIsFaulty] = useState([]);

	const initialSettings = {
		driver: "mysql",
		host: "localhost",
		port: 3306,
		database: "",
		username: "",
		password: "",
		table: "",
		advanced: {},
		status: "",
	};
	useEffect(() => {
		if (
			props.projectSettings.sourceConfig.status === "ok" &&
			props.projectSettings.sourceConfig.table !== ""
		) {
			props.setNextButtonDisabled(false);
		} else {
			props.setNextButtonDisabled(true);
		}
	});
	//send initial Settings if first render
	useEffect(() => {
		if (Object.keys(props.projectSettings.sourceConfig).length === 1) {
			props.setProjectSettings({
				...props.projectSettings,
				sourceConfig: initialSettings,
			});
		}
	}, []);
	const [showPassword, setShowPassword] = useState(false);
	const handleChange = (e) => {
		props.setProjectSettings({
			...props.projectSettings,
			sourceConfig: {
				...props.projectSettings.sourceConfig,
				[e.currentTarget.id]: e.currentTarget.value,
				status: "",
			},
		});
	};

	const lockButton = (
		<Tooltip2 content={showPassword ? "hide" : "show"}>
			<Button
				icon={showPassword ? "unlock" : "lock"}
				intent={Intent.WARNING}
				minimal={true}
				onClick={() => setShowPassword(!showPassword)}
			/>
		</Tooltip2>
	);

	const handlePortChange = (number) => {
		let newNumber = number || 1;
		if (number >= 65535) newNumber = 65535;
		props.setProjectSettings({
			...props.projectSettings,
			sourceConfig: {
				...props.projectSettings.sourceConfig,
				port: newNumber,
			},
		});
	};

	const handleConnect = () => {
		if (checkFields()) {
			setIsConnecting(true);
			const sendObj = { ...props.projectSettings.sourceConfig };
			serviceHandler({
				service: "database",
				method: "getTables",
				obj: sendObj,
			}).then((response) => {
				if (response.status === "ok") {
					props.setProjectSettings({
						...props.projectSettings,
						sourceConfig: {
							...props.projectSettings.sourceConfig,
							status: "ok",
						},
					});
					setIsFaulty([]);
					props.setToasts([
						{ message: "Connection established!", intent: "success" },
					]);
					setAvailableTables(response.tables);
				} else {
					props.setToasts([{ message: response.status, intent: "danger" }]);
				}
				setIsConnecting(false);
			});
		}
	};

	const handleRefresh = () => {
		setIsRefreshing(true);
		const sendObj = { ...props.projectSettings.sourceConfig };
		serviceHandler({
			service: "database",
			method: "getTables",
			obj: sendObj,
		}).then((response) => {
			if (response.status === "ok") {
				props.setProjectSettings({
					...props.projectSettings,
					sourceConfig: {
						...props.projectSettings.sourceConfig,
						status: "ok",
						table: "",
					},
				});
				setAvailableTables(response.tables);
				props.setToasts([
					{ message: "Fetched new table data", intent: "success" },
				]);
			} else {
				props.setToasts({ message: response.status, intent: "danger" });
			}
			setIsRefreshing(false);
		});
	};

	const checkFields = () => {
		let response = true;
		const areFaulty = [];
		for (const key in props.projectSettings.sourceConfig) {
			if (
				props.projectSettings.sourceConfig[key] === null ||
				(props.projectSettings.sourceConfig[key] == "" &&
					key != "table" &&
					key != "status")
			) {
				areFaulty.push(key);
				response = false;
			}
		}
		if (!response) {
			const toasts = [];
			areFaulty.map((fault) => {
				toasts.push({
					message: 'Check field "' + fault + '"!',
					intent: "warning",
				});
			});
			setIsFaulty(areFaulty);
			props.setToasts(toasts);
		}
		return response;
	};

	const isConnected = props.projectSettings.sourceConfig.status === "ok";
	return (
		<div>
			<FormGroup
				label="Host"
				labelInfo="(required)"
				helperText="Replace 'localhost' with the name or ip-address of your database host. "
			>
				<InputGroup
					id="host"
					leftIcon="ip-address"
					value={props.projectSettings.sourceConfig.host || "localhost"}
					onChange={handleChange}
				/>
			</FormGroup>
			<FormGroup
				label="Port"
				labelInfo="(required)"
				helperText="The port number to use. The default port number is 3306."
			>
				<NumericInput
					value={props.projectSettings.sourceConfig.port || 3306}
					id="port"
					max={65535}
					min={1}
					onValueChange={handlePortChange}
					onButtonClick={handlePortChange}
					leftIcon="numerical"
					fill={true}
				/>
			</FormGroup>
			<FormGroup
				label="Database"
				labelInfo="(required)"
				helperText="The database's name to use."
			>
				<InputGroup
					id="database"
					leftIcon="database"
					value={props.projectSettings.sourceConfig.database || ""}
					onChange={handleChange}
				/>
			</FormGroup>
			<FormGroup
				label="Username"
				labelInfo="(required)"
				helperText="The user name of the MySQL account to use for connecting to the server. The default user name is ODBC on Windows or your Unix login name on Unix."
			>
				<InputGroup
					id="username"
					value={props.projectSettings.sourceConfig.username || ""}
					onChange={handleChange}
					leftIcon="user"
				/>
			</FormGroup>
			<FormGroup
				label="Password"
				labelInfo="(required)"
				helperText="Password to use when connecting to server"
			>
				<InputGroup
					leftIcon="key"
					type={showPassword ? "text" : "password"}
					id="password"
					rightElement={lockButton}
					value={props.projectSettings.sourceConfig.password || ""}
					onChange={handleChange}
				/>
			</FormGroup>
			<FormGroup
				label="Table"
				labelInfo="(connection must be established to change)"
				helperText="Select the table wich should be used as a data source"
			>
				<Select
					filterable={false}
					disabled={!(props.projectSettings.sourceConfig.status === "ok")}
					items={availableTables.map((table) => {
						return { name: table };
					})}
					itemRenderer={(table) => {
						return (
							<MenuItem
								text={table.name}
								key={table.name}
								onClick={() => {
									props.setProjectSettings({
										...props.projectSettings,
										sourceConfig: {
											...props.projectSettings.sourceConfig,
											table: table.name,
										},
									});
								}}
							/>
						);
					}}
				>
					<Button
						disabled={!isConnected}
						icon="th"
						text={props.projectSettings.sourceConfig.table || "Select a table"}
					/>
				</Select>
			</FormGroup>
			<ButtonGroup minimal={false} large={true} style={{ margin: 10 }}>
				<Button
					text={isConnected ? "Connection established" : "Connect"}
					icon={isConnected ? "data-connection" : "database"}
					disabled={isConnected}
					intent="success"
					onClick={handleConnect}
					loading={isConnecting}
				/>
				<Button
					text="Refresh tables"
					icon="refresh"
					intent="primary"
					loading={isRefreshing}
					onClick={handleRefresh}
					disabled={!isConnected}
				/>
			</ButtonGroup>
		</div>
	);
};
