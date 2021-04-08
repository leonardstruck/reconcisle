export const notificationReducer = (state = [], action) => {
	switch (action.type) {
		case "Notification/ADD":
			return [...state, action.payload];

		case "Notification/CLEAR":
			return [];

		default:
			return state;
	}
};
