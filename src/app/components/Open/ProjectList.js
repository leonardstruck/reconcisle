import React, { useState, useEffect } from "react";
import {
	HTMLTable,
	Button,
	Menu,
	Spinner,
	NonIdealState,
	MenuItem,
	MenuDivider,
} from "@blueprintjs/core";
import { Popover2 as Popover } from "@blueprintjs/popover2";

import { fileStoreHandler } from "../../services/fileStoreHandler";

export const ProjectList = (props) => {
	const [isLoading, setIsLoading] = useState(true);
	const [projects, setProjects] = useState([]);

	const handleOpenCloseStartDialog = () => {
		props.setStartProjectState({ isOpen: !props.startProjectState.isOpen });
	};

	useEffect(() => {
		fileStoreHandler({ store: "projects", method: "get" }).then((response) => {
			setProjects(response);
			setIsLoading(false);
		});
	});
	if (isLoading) {
		return <NonIdealState icon={<Spinner />} title="Reading Database" />;
	} else if (projects.length === 0) {
		return (
			<NoProjectsFound
				handleOpenCloseStartDialog={handleOpenCloseStartDialog}
			/>
		);
	} else {
		return (
			<ListProjects
				handleOpenCloseStartDialog={handleOpenCloseStartDialog}
				projects={projects}
				setProjects={setProjects}
			/>
		);
	}
};

const SubMenu = (props) => {
	return (
		<Popover
			content={
				<Menu>
					<MenuItem text="Rename" icon="edit" intent="primary" />
					<MenuItem
						text="Export"
						icon="share"
						intent="primary"
						onClick={() =>
							fileStoreHandler({
								store: "project",
								method: "export",
								obj: { name: props.projectName },
							})
						}
					/>
					<MenuDivider />
					<MenuItem
						text="Delete"
						icon="trash"
						intent="danger"
						onClick={() =>
							fileStoreHandler({
								store: "projects",
								method: "delete",
								obj: { name: props.projectName },
							})
						}
					/>
				</Menu>
			}
			placement="right-start"
		>
			<Button icon="more" minimal={true} />
		</Popover>
	);
};

const ListProjects = (props) => {
	return (
		<div className="projectList">
			<HTMLTable style={{ flexGrow: 1, width: "100%" }} interactive={true}>
				<thead>
					<tr>
						<th>Select a project</th>
					</tr>
				</thead>
				<tbody>
					{props.projects.map((project) => {
						return (
							<tr key={project.name}>
								<td>{project.name}</td>
								<td className="projectListActionTd">
									<SubMenu projectName={project.name} />
								</td>
							</tr>
						);
					})}
				</tbody>
			</HTMLTable>
			<Button
				onClick={() => {
					props.handleOpenCloseStartDialog();
				}}
				minimal={true}
				intent="success"
				rightIcon="clean"
				large={true}
				fill={true}
			>
				Start a new Project
			</Button>
		</div>
	);
};

const NoProjectsFound = (props) => {
	return (
		<NonIdealState
			title="No projects found"
			icon="folder-new"
			action={
				<div>
					<Button
						onClick={() => {
							props.handleOpenCloseStartDialog();
						}}
						minimal={true}
						intent="primary"
						rightIcon="clean"
						large={true}
					>
						Start a new Project
					</Button>
				</div>
			}
		/>
	);
};
