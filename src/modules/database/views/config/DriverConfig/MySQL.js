import {
	Button,
	ButtonGroup,
	FormGroup,
	InputGroup,
	Intent,
	NumericInput,
	MenuItem,
	Checkbox,
} from "@blueprintjs/core";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Select } from "@blueprintjs/select";

import React, { useEffect, useState } from "react";

import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

import { NotificationObject } from "../../../../../app/services/Notifications";

import { serviceHandler } from "../../../../../app/services/serviceHandler";

export const MySQL = () => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	const [showPassword, setShowPassword] = useState(false);
	const [availableTables, setAvailableTables] = useState([]);
	const [isConnecting, setIsConnecting] = useState(false);

	useEffect(() => {
		if (availableTables.length === 0) {
			dispatch({
				type: "Component/StartProject/SET_SOURCE_CONFIG",
				payload: {
					...state.sourceConfig,
					connectionStatus: "new",
					table: "",
				},
			});
		}
	}, [availableTables]);

	const handleChange = (e) => {
		dispatch({
			type: "Component/StartProject/SET_SOURCE_CONFIG",
			payload: {
				...state.sourceConfig,
				[e.currentTarget.id]: e.currentTarget.value,
				connectionStatus: "new",
				table: "",
			},
		});
	};

	const handlePortChange = (number) => {
		let newNumber = number || 1;
		if (number >= 65535) newNumber = 65535;

		dispatch({
			type: "Component/StartProject/SET_SOURCE_CONFIG",
			payload: {
				...state.sourceConfig,
				port: newNumber,
				connectionStatus: "new",
				table: "",
			},
		});
	};

	const handleConnect = (setAvailableTables) => {
		setIsConnecting(true);
		serviceHandler(state.sourceModule, "getTables", {
			driver: state.sourceConfig.driver,
			database: state.sourceConfig.database,
			username: state.sourceConfig.username,
			password: state.sourceConfig.password,
			host: state.sourceConfig.host,
			port: state.sourceConfig.port,
		}).then((res) => {
			setIsConnecting(false);
			console.log(res);
			if (res.status === "error") {
				dispatch(NotificationObject(res.errorMessage, "danger"));
				dispatch({
					type: "Component/StartProject/SET_SOURCE_CONFIG",
					payload: {
						...state.sourceConfig,
						connectionStatus: "error",
					},
				});
			} else if (res.status === "ok") {
				dispatch({
					type: "Component/StartProject/SET_SOURCE_CONFIG",
					payload: {
						...state.sourceConfig,
						connectionStatus: "ok",
					},
				});
				dispatch(NotificationObject("Connection was successful", "success"));
				setAvailableTables(res.tables);
			}
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

	const TableButtons = (props) => {
		const state = useSelector(selectStartProjectState);
		if (state.sourceConfig.advanced) {
			// Buttons missing for Advanced Configuration
			return null;
		}

		switch (state.sourceConfig.connectionStatus) {
			case "ok":
				return (
					<Select
						filterable={false}
						items={props.availableTables.map((table) => {
							return { name: table };
						})}
						itemRenderer={(table) => {
							return (
								<MenuItem
									text={table.name}
									key={table.name}
									onClick={() => {
										dispatch({
											type: "Component/StartProject/SET_SOURCE_CONFIG",
											payload: {
												...state.sourceConfig,
												table: table.name,
											},
										});
									}}
								/>
							);
						}}
					>
						<Tooltip2
							content={
								<p style={{ width: 150 }}>
									Select the table, which should be used as a data source
								</p>
							}
							placement="right"
						>
							<Button
								text={
									state.sourceConfig.table
										? "Selected table: " + state.sourceConfig.table
										: "Select a table"
								}
								intent={state.sourceConfig.table ? "success" : "primary"}
							/>
						</Tooltip2>
					</Select>
				);
			default:
				return null;
		}
	};

	return (
		<div>
			<FormGroup
				label="Host"
				labelInfo="(required)"
				helperText="Replace 'localhost' with the name or IP-Address of your database host."
			>
				<InputGroup
					id="host"
					leftIcon="ip-address"
					value={state.sourceConfig.host}
					placeholder="localhost"
					onChange={handleChange}
				/>
			</FormGroup>
			<FormGroup
				label="Port"
				labelInfo="(required)"
				helperText="The port number to use. The default port number is 3306."
			>
				<NumericInput
					leftIcon="numerical"
					fill={true}
					value={state.sourceConfig.port}
					placeholder={3306}
					onValueChange={handlePortChange}
					onButtonClick={handlePortChange}
					min={1}
					max={65535}
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
					value={state.sourceConfig.database}
					onChange={handleChange}
				/>
			</FormGroup>
			<FormGroup
				label="Username"
				labelInfo="(required)"
				helperText="The user name of the MySQL account to use for connecting to the server. The default user name is OBDC on Windows or your Unix login name on Unix."
			>
				<InputGroup
					id="username"
					value={state.sourceConfig.username}
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
					value={state.sourceConfig.password}
					onChange={handleChange}
				/>
			</FormGroup>
			<Checkbox
				style={{ marginLeft: 15 }}
				labelElement={
					<span>
						use custom queries <i>(not recommended)</i>
					</span>
				}
				checked={state.sourceConfig.advanced || false}
				onChange={(e) => {
					dispatch({
						type: "Component/StartProject/SET_SOURCE_CONFIG",
						payload: {
							...state.sourceConfig,
							advanced: e.currentTarget.checked,
							table: "",
						},
					});
				}}
			/>
			<ButtonGroup minimal={false} large={true} style={{ margin: 10 }}>
				<Button
					text={
						state.sourceConfig.connectionStatus === "ok"
							? "Connection established"
							: "Connect"
					}
					icon={
						state.sourceConfig.connectionStatus === "ok"
							? "data-connection"
							: "database"
					}
					disabled={state.sourceConfig.connectionStatus === "ok"}
					intent={
						state.sourceConfig.connectionStatus === "ok" ? "success" : "primary"
					}
					loading={isConnecting}
					onClick={() => {
						handleConnect(setAvailableTables);
					}}
				/>
				<TableButtons availableTables={availableTables} />
			</ButtonGroup>
		</div>
	);
};
