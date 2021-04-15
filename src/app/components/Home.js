import * as React from "react";
import { Link } from "react-router-dom";
import { Helmet } from "react-helmet";
import Lottie from "lottie-react";
import logoAnimation from "../assets/logoAnimation.json";
import { Button, Card, Elevation } from "@blueprintjs/core";

export const Home = () => {
	return (
		<>
			<Helmet>
				<title>reconcIsle</title>
			</Helmet>
			<Card elevation={Elevation.FOUR} className="centeredCard">
				<div className="app_logo">
					<Lottie animationData={logoAnimation} />
				</div>
				<div>
					<h3 className="bp3-heading">reconcIsle</h3>
					<p className="bp3-text-large">
						A tool to easily build reconciliation services from your own data
					</p>
					<Link to="/open">
						<Button
							rightIcon="arrow-right"
							large={true}
							intent="primary"
							minimal={true}
							fill={true}
						>
							Let's get started
						</Button>
					</Link>
				</div>
			</Card>
		</>
	);
};
