import React from "react";

import { useLottie } from "lottie-react";
import statusAnimation from "../../assets/statusAnimation.json";

export const StatusAnimation = (props) => {
	const style = {
		height: 150,
		width: 150,
	};
	const options = {
		animationData: statusAnimation,
		autoplay: false,
		loop: false,
	};
	const { View, playSegments, setDirection } = useLottie(options, style);
	switch (props.animationState) {
		case "startFromInactive":
			{
				playSegments([300, 290], true);
				setDirection(-1);
			}
			break;
		case "stopFromActive":
			{
				playSegments([190, 180], true);
				setDirection(-1);
			}
			break;
		case "startFromStopped":
			{
				setDirection(1);
				playSegments([180, 190], true);
			}
			break;
		case "inactive":
			{
				playSegments([305, 310], true);
			}
			break;
	}
	return View;
};
