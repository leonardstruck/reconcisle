import React, { useEffect, useState } from "react";
import { serviceHandler } from "../../../services/serviceHandler";

import { useSelector, useDispatch } from "react-redux";
import {
	Callout,
	Colors,
	Menu,
	MenuItem,
	NonIdealState,
	Icon,
	Spinner,
	InputGroup,
	Classes,
	FormGroup,
	ControlGroup,
	Button,
	ButtonGroup,
} from "@blueprintjs/core";
const selectStartProjectState = (state) => state.startProject;

import { NotificationObject } from "../../../services/Notifications";
import {
	Cell,
	Column,
	ColumnHeaderCell,
	RegionCardinality,
	SelectionModes,
	Table,
} from "@blueprintjs/table";
import { Tooltip2 } from "@blueprintjs/popover2";
import { Select } from "@blueprintjs/select";

export const ReconcParams = (props) => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	const [tableContent, setTableContent] = useState([]);
	const [isLoading, setIsLoading] = useState(true);
	const [configurationError, setConfigurationError] = useState(false);
	const returnAvailableColumns = () => {
		const keyArray = [];
		for (let key in tableContent[0]) {
			keyArray.push(key);
		}
		return keyArray;
	};

	const availableColumns = returnAvailableColumns();

	useEffect(() => {
		if (state.reconcParams.searchColumn && state.reconcParams.idColumn) {
			dispatch({ type: "Component/StartProject/ENABLE_NEXT_BUTTON" });
		} else {
			dispatch({ type: "Component/StartProject/DISABLE_NEXT_BUTTON" });
		}
	}, [state.reconcParams]);

	useEffect(() => {
		serviceHandler(state.sourceModule, "previewTable", state.sourceConfig).then(
			(response) => {
				console.log("This is the serviceHandler response ", response);
				if (response.status === "ok") {
					setTableContent(response.tableContent);
					setIsLoading(false);
				} else {
					setIsLoading(false);
					setConfigurationError(true);
					dispatch(NotificationObject(response.errorMessage, "danger"));
				}
			}
		);
	}, []);

	const PreviewTable = () => {
		const renderCells = (row, column) => {
			const keyArray = [];
			for (let key in tableContent[0]) {
				keyArray.push(key);
			}
			return (
				<Cell>
					<div style={{ width: "100%", height: "100%" }}>
						{tableContent[row][keyArray[column]]}
					</div>
				</Cell>
			);
		};

		const renderCellHeader = (column) => {
			const keyArray = [];
			for (let key in tableContent[0]) {
				keyArray.push(key);
			}
			const getIcon = (key) => {
				if (key == state.reconcParams.searchColumn) {
					return "search";
				} else if (key == state.reconcParams.idColumn) {
					return "tag";
				}
			};

			return (
				<ColumnHeaderCell>
					<div
						style={{
							paddingLeft: 10,
							paddingRight: 10,
							display: "flex",
							justifyContent: "space-between",
							alignItems: "center",
						}}
					>
						{keyArray[column]}
						<Icon icon={getIcon(keyArray[column])} />
					</div>
				</ColumnHeaderCell>
			);
		};

		const renderColumns = () => {
			const keyArray = [];
			for (let key in tableContent[0]) {
				keyArray.push(key);
			}
			const isBlue = (key) => state.reconcParams.searchColumn === key;
			const isOrange = (key) => state.reconcParams.idColumn === key;

			return keyArray.map((key) => (
				<Column
					style={{
						backgroundColor: isBlue(key)
							? Colors.BLUE4
							: isOrange(key)
							? Colors.ORANGE4
							: "",
					}}
					key={key}
					columnHeaderCellRenderer={renderCellHeader}
					cellRenderer={renderCells}
				/>
			));
		};

		return (
			<Table
				enableRowResizing={false}
				enableColumnResizing={false}
				selectionModes={SelectionModes.NONE}
				numRows={tableContent.length}
				className="selectColumnTable"
			>
				{renderColumns()}
			</Table>
		);
	};

	if (isLoading) {
		return <NonIdealState icon={<Spinner />} title="Requesting Data" />;
	} else if (configurationError) {
		return (
			<Callout intent="danger" title="Source Configuration Error">
				Something went wrong while loading your source configuration. Please
				head one step back and try again.
			</Callout>
		);
	} else {
		return (
			<div>
				<Callout intent="primary" title="Configure Reconciliation Service">
					<p>
						To be able to use the reconciliation service, you have to choose two
						columns from your Dataset:
					</p>
					<p>
						<b>Search Column:</b> is the primary column you want to use for
						matching.
					</p>
					<p>
						<b>ID Column:</b> is the column containing unique identifiers.
					</p>
				</Callout>
				<PreviewTable />
				<p className="bp3-text-small bp3-text-muted" style={{ padding: 5 }}>
					(This is just a preview. The whole dataset will be present when
					running the reconciliation service)
				</p>
				<FormGroup label="Select Columns">
					<ButtonGroup>
						<Select
							filterable={false}
							items={availableColumns.map((column) => {
								return { name: column };
							})}
							itemRenderer={(column) => {
								return (
									<MenuItem
										text={column.name}
										key={column.name}
										onClick={() => {
											dispatch({
												type:
													"Component/StartProject/SET_RECONCILIATION_PARAMS",
												payload: {
													...state.reconcParams,
													searchColumn: column.name,
												},
											});
										}}
									/>
								);
							}}
						>
							<Button
								text={
									"Search Column" +
									(state.reconcParams.searchColumn
										? ": " + state.reconcParams.searchColumn
										: "")
								}
								rightIcon="chevron-down"
								intent={state.reconcParams.searchColumn ? "success" : "primary"}
							/>
						</Select>
						<Select
							filterable={false}
							items={availableColumns.map((column) => {
								return { name: column };
							})}
							itemRenderer={(column) => {
								return (
									<MenuItem
										text={column.name}
										key={column.name}
										onClick={() => {
											dispatch({
												type:
													"Component/StartProject/SET_RECONCILIATION_PARAMS",
												payload: {
													...state.reconcParams,
													idColumn: column.name,
												},
											});
										}}
									/>
								);
							}}
						>
							<Button
								text={
									"ID Column" +
									(state.reconcParams.idColumn
										? ": " + state.reconcParams.idColumn
										: "")
								}
								rightIcon="chevron-down"
								intent={state.reconcParams.idColumn ? "success" : "primary"}
							/>
						</Select>
					</ButtonGroup>
				</FormGroup>
			</div>
		);
	}
};
