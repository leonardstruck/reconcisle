import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Toaster, Toast, Position } from "@blueprintjs/core";
const selectNotificationState = (state) => state.notification;

export const Notifications = () => {
	const dispatch = useDispatch();
	const state = useSelector(selectNotificationState);
	const toasts = state;
	return (
		<Toaster position={Position.TOP}>
			{toasts.map((toast) => (
				<Toast
					{...toast}
					key={toast.message}
					onDismiss={() => {
						dispatch({ type: "Notification/CLEAR" });
					}}
				/>
			))}
		</Toaster>
	);
};

export const NotificationObject = (message, intent) => {
	return {
		type: "Notification/ADD",
		payload: { message: message, intent: intent },
	};
};
