const initialState = {
	nextButtonDisabled: true,
	name: "",
	sourceModule: "",
	toasts: [],
};

export const startProjectReducer = (state = initialState, action) => {
	switch (action.type) {
		// Reducers that Change Form Values
		case "Component/StartProject/CHANGE_NAME":
			return { ...state, name: action.name };
		case "Component/StartProject/CHANGE_SOURCE_MODULE":
			return { ...state, sourceModule: action.sourceModule };

		// Reducers that Change Form State
		case "Component/StartProject/ENABLE_NEXT_BUTTON":
			return { ...state, nextButtonDisabled: false };
		case "Component/StartProject/DISABLE_NEXT_BUTTON":
			return { ...state, nextButtonDisabled: true };
		case "Component/StartProject/RESET_FORM_STATE":
			return initialState;

		// Notifications

		default:
			return state;
	}
};
