import React from "react";
import {
	Callout,
	FormGroup,
	RadioGroup,
	Radio,
	Checkbox,
} from "@blueprintjs/core";

export const SelectDriver = (props) => {
	return (
		<div>
			<Callout title="Explore your databases" intent="primary">
				reconcIsle is compatible with the following relational databases:
			</Callout>
			<FormGroup>
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
				<Checkbox
					labelElement={
						<span>
							use custom queries <i>(not recommended)</i>
						</span>
					}
					checked={props.projectSettings.sourceConfig.advanced || false}
					onChange={(e) => {
						props.setProjectSettings({
							...props.projectSettings,
							sourceConfig: {
								...props.projectSettings.sourceConfig,
								advanced: e.currentTarget.checked,
							},
						});
					}}
				/>
			</FormGroup>
		</div>
	);
};
