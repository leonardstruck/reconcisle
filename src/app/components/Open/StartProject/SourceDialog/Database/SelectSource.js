import React from "react";
import { Callout, FormGroup, RadioGroup, Radio } from "@blueprintjs/core";

export const SelectSource = (props) => {
	return (
		<div>
			<Callout title="Explore your databases" intent="primary">
				reconcIsle is compatible with the following relational databases:
			</Callout>
			<FormGroup label="Source">
				<RadioGroup
					inline={true}
					onChange={(e) => {
						props.setProjectSettings({
							...props.projectSettings,
							sourceConfig: {
								...props.projectSettings.sourceConfig,
								driver: e.currentTarget.value,
							},
						});
					}}
					selectedValue={props.projectSettings.sourceConfig.driver || ""}
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
