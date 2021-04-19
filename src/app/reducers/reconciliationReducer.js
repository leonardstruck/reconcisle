const initialState = {
	serviceStatus: "inactive",
	refreshIsLoading: false,
	configuration: {},
};

export const reconciliationReducer = (state = initialState, action) => {
	switch (action.type) {
		case "Reconciliation/SERVICE_STARTED":
			return { ...state, serviceStatus: "started" };

		case "Reconciliation/SERVICE_STOPPED":
			return { ...state, serviceStatus: "stopped" };

		case "Reconciliation/SERVICE_INACTIVE":
			return { ...state, serviceStatus: "inactive" };

		case "Reconciliation/SERVICE_ISLOADING":
			return { ...state, loading: action.payload };

		case "Reconciliation/TOGGLE_ISREFRESHING":
			return { ...state, refreshIsLoading: !state.refreshIsLoading };

		case "Reconciliation/SET_CONFIG":
			return { ...state, configuration: action.payload };

		case "Reconciliation/CLEAR_CONFIG":
			return initialState;

		default:
			return state;
	}
};
