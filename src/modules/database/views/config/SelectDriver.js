import { Callout, FormGroup, Radio, RadioGroup } from "@blueprintjs/core";
import React from "react";
import { useSelector, useDispatch } from "react-redux";
const selectStartProjectState = (state) => state.startProject;

export const SelectDriver = () => {
	const dispatch = useDispatch();
	const state = useSelector(selectStartProjectState);
	return (
		<div>
			<Callout title="Explore your databases" intent="primary">
				reconcIsle is compatible with the following relational databases:
			</Callout>
			<FormGroup>
				<RadioGroup
					inline={true}
					selectedValue={state.sourceConfig.driver}
					onChange={(e) => {
						dispatch({
							type: "Component/StartProject/SET_SOURCE_CONFIG",
							payload: {
								...state.sourceConfig,
								driver: e.currentTarget.value,
							},
						});
					}}
				>
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
