import React, { useEffect, useState } from "react";
import slugify from "slugify";
import {
	FormGroup,
	InputGroup,
	Callout,
	Radio,
	RadioGroup,
} from "@blueprintjs/core";

export const GeneralDialog = (props) => {
	useEffect(() => {
		if (
			props.projectSettings.general.name !== "" &&
			props.projectSettings.general.source !== ""
		) {
			props.setNextButtonDisabled(false);
		} else {
			props.setNextButtonDisabled(true);
		}
	});
	const handleNameChange = (e) => {
		const replaceSpace = e.currentTarget.value.replace(/\s+/g, "-");
		const withoutSpace = slugify(replaceSpace, {
			lower: true,
			remove: /[*_+~,=?{%§$^°}.#`´;‚ç/()'"!:@]/g,
		});
		e.currentTarget.value = withoutSpace;
		props.setProjectSettings({
			...props.projectSettings,
			general: { ...props.projectSettings.general, name: withoutSpace },
		});
	};
	return (
		<div>
			<FormGroup label="Project name" labelInfo="(required)">
				<InputGroup
					id="name"
					onChange={handleNameChange}
					value={props.projectSettings.general.name}
				/>
			</FormGroup>
			<Callout title="Valid Project Names" intent="primary">
				Supported characters for a project name are: letters, numbers and
				dashes. Dashes must not be entered next to another.
			</Callout>
			<FormGroup label="Source">
				<RadioGroup
					selectedValue={props.projectSettings.general.source}
					onChange={(e) => {
						props.setProjectSettings({
							...props.projectSettings,
							general: {
								...props.projectSettings.general,
								source: e.currentTarget.value,
							},
						});
					}}
				>
					<Radio
						label="Postgres, MySQL, MariaDB, SQLite, Microsoft SQL Server"
						value="database"
					/>
					<Radio label="CSV (coming soon...)" value="csv" disabled={true} />
					<Radio label="Excel (coming soon...)" value="excel" disabled={true} />
				</RadioGroup>
			</FormGroup>
		</div>
	);
};
