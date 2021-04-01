import React, { useState, useEffect } from "react";
import {
	HTMLTable,
	Button,
	Menu,
	Spinner,
	NonIdealState,
	MenuItem,
	MenuDivider,
	FocusStyleManager,
} from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";

FocusStyleManager.onlyShowFocusOnTabs();

import { fileStoreHandler } from "../../services/fileStoreHandler";
import { StartProject } from "./StartProject/StartProject";

const SubMenu = () => {
	return (
		<Popover
			content={
				<Menu>
					<MenuItem text="Rename" icon="edit" intent="primary" />
					<MenuItem text="Export" icon="share" intent="primary" />
					<MenuDivider />
					<MenuItem text="Delete" icon="trash" intent="danger" />
				</Menu>
			}
			placement="right-start"
		>
			<Button icon="more" minimal={true} />
		</Popover>
	);
};

const NoProjectsFound = () => {
	const [startProjectState, setStartProjectState] = useState({ isOpen: false });

	return (
		<div>
			<NonIdealState
				title="No projects found"
				icon="folder-new"
				action={
					<Button
						onClick={() => {
							setStartProjectState({ isOpen: true });
						}}
					>
						Start a new Project
					</Button>
				}
			/>
			<StartProject
				{...startProjectState}
				onClose={() => {
					setStartProjectState({ isOpen: false });
				}}
			/>
		</div>
	);
};

export const ProjectList = () => {
	const [isLoading, setIsLoading] = useState(true);
	const [projectCount, setProjectCount] = useState(0);
	useEffect(() => {
		fileStoreHandler({ store: "projects", method: "size" }).then((response) => {
			setProjectCount(response);
		});
		setIsLoading(false);
	});
	if (isLoading) {
		return <NonIdealState icon={<Spinner />} title="Reading Database" />;
	} else if (projectCount === 0) {
		return <NoProjectsFound />;
	} else {
		return (
			<HTMLTable style={{ flexGrow: 1 }} interactive={true}>
				<thead>
					<tr>
						<th>Please select a project</th>
					</tr>
				</thead>
				<tbody>
					<tr>
						<td>Projekt 1</td>
						<td>
							<SubMenu />
						</td>
					</tr>
					<tr>
						<td>Projekt 2</td>
						<td>
							<SubMenu />
						</td>
					</tr>
					<tr>
						<td>Projekt 3</td>
						<td>
							<SubMenu />
						</td>
					</tr>
				</tbody>
			</HTMLTable>
		);
	}
};
