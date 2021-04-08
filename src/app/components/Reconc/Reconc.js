import React, { useState } from "react";
import Lottie from "react-lottie-segments";
import * as animationData from "../../assets/statusAnimation.json";
import Helmet from "react-helmet";
import {
	Card,
	Elevation,
	Button,
	Spinner,
	NonIdealState,
	Callout,
} from "@blueprintjs/core";
import { Link, useLocation } from "react-router-dom";
import { fileStoreHandler } from "../../services/fileStoreHandler";

export const Reconc = (props) => {
	function useQuery() {
		return new URLSearchParams(useLocation().search);
	}
	let query = useQuery();

	const defaultOptions = {
		loop: true,
		autoplay: true,
		animationData: animationData.default,
	};
	return (
		<div>
			<Helmet>
				<title>reconcIsle - {query.get("name")}</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<h3 className="bp3-heading">{query.get("name")}</h3>
				<NonIdealState
					icon={<Lottie options={defaultOptions} height={200} width={200} />}
					title="This is a title"
					description="This is a description"
				/>
				<Link to="/Open">
					<Button
						icon="arrow-left"
						intent="primary"
						large={true}
						minimal={true}
					>
						Back
					</Button>
				</Link>
			</Card>
		</div>
	);
};
