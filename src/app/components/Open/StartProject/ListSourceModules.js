import { FormGroup, Radio, RadioGroup } from "@blueprintjs/core";
import React from "react";
import modules from "../../../../modules/modules";
import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

const Modules = modules();

export const ListSourceModules = () => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	return (
		<FormGroup label="Source">
			<RadioGroup
				selectedValue={state.sourceModule}
				onChange={(e) => {
					dispatch({
						type: "Component/StartProject/CHANGE_SOURCE_MODULE",
						payload: e.currentTarget.value,
					});
				}}
			>
				{Modules.modules.map((module) => {
					return (
						<Radio value={module().meta.uuid} key={module().meta.uuid}>
							{module().meta.name}: {module().meta.description}
						</Radio>
					);
				})}
			</RadioGroup>
		</FormGroup>
	);
};
