import uuid from "react-uuid";
import { ipcRenderer } from "electron";

export async function reconciliationServiceHandler(projectName, config) {
	const randomID = uuid();
	ipcRenderer.send("startReconciliationServer", {
		reqId: randomID,
		projectName: projectName,
		config: config,
	});
	const promise = new Promise((resolve) => {
		ipcRenderer.once(randomID, (event, data) => {
			resolve(data);
		});
	});
	return promise;
}

export const stopReconciliationServer = () => {
	ipcRenderer.send("stopReconciliationServer", []);
};
