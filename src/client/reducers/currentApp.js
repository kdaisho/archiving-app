const currentApp = (state = {}, action) => {
	if (action.type === "CHANGE_APP") {
		return action.payload;
	} else {
		return state;
	}
};

export default currentApp;
