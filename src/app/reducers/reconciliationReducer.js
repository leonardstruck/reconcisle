const initialState = {
	serviceStatus: "inactive",
	loading: false,
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
		default:
			return state;
	}
};
