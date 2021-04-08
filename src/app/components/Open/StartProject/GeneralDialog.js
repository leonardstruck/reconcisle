import React, { useEffect, useState } from "react";
import slugify from "slugify";
import {
	FormGroup,
	InputGroup,
	Callout,
	Radio,
	RadioGroup,
	Tag,
} from "@blueprintjs/core";

import { fileStoreHandler } from "../../../services/fileStoreHandler";
import { ListSourceModules } from "./ListSourceModules";

import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

export const GeneralDialog = (props) => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	const [isDuplicate, setIsDuplicate] = useState(false);
	useEffect(() => {
		fileStoreHandler({
			store: "projects",
			method: "checkduplicate",
			obj: state.name,
		}).then((res) => {
			if (res === "duplicate") {
				setIsDuplicate(true);
			} else {
				setIsDuplicate(false);
			}
		});
		if (state.name !== "" && state.sourceModule !== "" && !isDuplicate) {
			dispatch({ type: "Component/StartProject/ENABLE_NEXT_BUTTON" });
		} else {
			dispatch({ type: "Component/StartProject/DISABLE_NEXT_BUTTON" });
		}
	}, [state.name, state.sourceModule, isDuplicate]);
	const handleNameChange = (e) => {
		const replaceSpace = e.currentTarget.value.replace(/\s+/g, "-");
		const withoutSpace = slugify(replaceSpace, {
			lower: true,
			remove: /[*_+~,=?{%§$^°}.#`´;‚ç/()'"!:@]/g,
		});
		e.currentTarget.value = withoutSpace;
		dispatch({
			type: "Component/StartProject/CHANGE_NAME",
			payload: withoutSpace,
		});
	};
	return (
		<div>
			<FormGroup label="Project name" labelInfo="(required)">
				<InputGroup
					id="name"
					onChange={handleNameChange}
					value={state.name}
					intent={isDuplicate ? "danger" : "none"}
					rightElement={
						isDuplicate ? (
							<Tag intent="danger" minimal={true}>
								This project name is already taken
							</Tag>
						) : (
							""
						)
					}
				/>
			</FormGroup>
			<Callout title="Valid Project Names" intent="primary">
				Supported characters for a project name are: letters, numbers and
				dashes. Dashes must not be entered next to another.
			</Callout>
			<ListSourceModules />
		</div>
	);
};
