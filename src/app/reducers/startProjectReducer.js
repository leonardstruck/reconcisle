const initialState = {
	nextButtonDisabled: true,
	name: "",
	sourceModule: "",
	toasts: [],
	sourceConfig: {},
	reconcParams: {},
};

export const startProjectReducer = (state = initialState, action) => {
	switch (action.type) {
		// Reducers that Change Form Values
		case "Component/StartProject/CHANGE_NAME":
			return { ...state, name: action.payload };
		case "Component/StartProject/CHANGE_SOURCE_MODULE":
			return { ...state, sourceModule: action.payload };

		// Reducers that Change Form State
		case "Component/StartProject/ENABLE_NEXT_BUTTON":
			return { ...state, nextButtonDisabled: false };
		case "Component/StartProject/DISABLE_NEXT_BUTTON":
			return { ...state, nextButtonDisabled: true };
		case "Component/StartProject/RESET_FORM_STATE":
			return initialState;

		// Reducers that Change SourceConfig State
		case "Component/StartProject/SET_SOURCE_CONFIG":
			return { ...state, sourceConfig: action.payload };

		case "Component/StartProject/SET_RECONCILIATION_PARAMS":
			return { ...state, reconcParams: action.payload };

		default:
			return state;
	}
};
