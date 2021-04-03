import React, { useEffect, useState } from "react";
import { serviceHandler } from "../../../services/serviceHandler";
import {
	Callout,
	Menu,
	MenuItem,
	Icon,
	NonIdealState,
	Spinner,
	Colors,
	ButtonGroup,
	Button,
	AnchorButton,
} from "@blueprintjs/core";
import {
	Table,
	Column,
	Cell,
	SelectionModes,
	ColumnHeaderCell,
} from "@blueprintjs/table";
import { Popover2 } from "@blueprintjs/popover2";

export const ReconcParams = (props) => {
	useEffect(() => {
		if (
			props.projectSettings.reconcParams.searchColumn !== "" &&
			props.projectSettings.reconcParams.idColumn !== ""
		) {
			props.setNextButtonDisabled(false);
		} else {
			props.setNextButtonDisabled(true);
		}
	});
	const [isLoading, setIsLoading] = useState(true);
	const [tableContent, setTableContent] = useState();
	const [selectIsActive, setSelectIsActive] = useState(false);
	const [selectSearchColumnIsActive, setSelectSearchColumnIsActive] = useState(
		false
	);
	const [selectIdColumnIsActive, setSelectIdColumnIsActive] = useState(false);

	const handlePreviewTable = () => {
		setIsLoading(true);
		const sendObj = { ...props.projectSettings.sourceConfig };
		serviceHandler({
			service: props.projectSettings.general.source,
			method: "previewTable",
			obj: sendObj,
		}).then((response) => {
			console.log(response);
			setTableContent(response.tableContent);
			setIsLoading(false);
		});
	};

	const handleColumnClick = (columnname) => {
		if (selectIsActive) {
			if (selectSearchColumnIsActive) {
				props.setProjectSettings({
					...props.projectSettings,
					reconcParams: {
						...props.projectSettings.reconcParams,
						searchColumn: columnname,
					},
				});
			} else if (selectIdColumnIsActive) {
				props.setProjectSettings({
					...props.projectSettings,
					reconcParams: {
						...props.projectSettings.reconcParams,
						idColumn: columnname,
					},
				});
			}
			setSelectIdColumnIsActive(false);
			setSelectSearchColumnIsActive(false);
			setSelectIsActive(false);
		} else {
			console.log("not active");
		}
	};

	useEffect(() => {
		handlePreviewTable();
	}, []);

	const PreviewTable = () => {
		const renderCells = (row, column) => {
			const keyArray = [];
			for (let key in tableContent[0]) {
				keyArray.push(key);
			}
			return (
				<Cell>
					<div
						style={{ width: "100%", height: "100%" }}
						onClick={() => handleColumnClick(keyArray[column])}
					>
						{tableContent[row][keyArray[column]]}
					</div>
				</Cell>
			);
		};

		const renderCellHeaderMenu = (column) => {
			return (
				<Menu>
					<MenuItem text="Use as Search Column" />
				</Menu>
			);
		};

		const renderCellHeader = (column) => {
			const keyArray = [];
			for (let key in tableContent[0]) {
				keyArray.push(key);
			}
			const getIcon = (key) => {
				if (key == props.projectSettings.reconcParams.searchColumn) {
					return "search";
				} else if (key == props.projectSettings.reconcParams.idColumn) {
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
						onClick={() => {
							handleColumnClick(keyArray[column]);
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
			const isBlue = (key) =>
				props.projectSettings.reconcParams.searchColumn === key;

			const isOrange = (key) =>
				props.projectSettings.reconcParams.idColumn === key;

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

	const handleSelectButton = (type) => {
		setSelectIsActive(true);
		if (type === "searchColumn") {
			setSelectSearchColumnIsActive(true);
		} else if (type === "idColumn") {
			setSelectIdColumnIsActive(true);
		}
	};

	if (props.projectSettings.sourceConfig.status !== "ok") {
		return (
			<Callout intent="danger" title="Source Configuration Error">
				Something went wrong while loading your source configuration.
			</Callout>
		);
	} else if (isLoading) {
		return <NonIdealState icon={<Spinner />} title="Reading database" />;
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
						<b>ID Column:</b> is the column containing uniqe identifiers
					</p>
				</Callout>
				<ButtonGroup fill={true}>
					<Popover2
						isOpen={selectIdColumnIsActive}
						content={<div style={{ padding: 5 }}>click on a column</div>}
						placement="top"
					>
						<AnchorButton
							icon="tag"
							disabled={selectIsActive}
							onClick={() => handleSelectButton("idColumn")}
							loading={selectIdColumnIsActive}
							intent={
								props.projectSettings.reconcParams.idColumn !== ""
									? "success"
									: "none"
							}
						>
							Select ID Column
						</AnchorButton>
					</Popover2>
					<Popover2
						isOpen={selectSearchColumnIsActive}
						content={<div style={{ padding: 5 }}>click on a column</div>}
						placement="top"
					>
						<AnchorButton
							icon="search"
							disabled={selectIsActive}
							onClick={() => handleSelectButton("searchColumn")}
							loading={selectSearchColumnIsActive}
							intent={
								props.projectSettings.reconcParams.searchColumn !== ""
									? "success"
									: "none"
							}
						>
							Select Search Column
						</AnchorButton>
					</Popover2>
				</ButtonGroup>
				<PreviewTable />
				<p className="bp3-text-small bp3-text-muted" style={{ padding: 5 }}>
					(This is just a preview. The whole dataset will be present when
					running the reconciliation service)
				</p>
			</div>
		);
	}
};
