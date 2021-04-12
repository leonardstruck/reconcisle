import uuid from "react-uuid";
import { ipcRenderer } from "electron";

export async function reconciliationServiceHandler(data, config) {
	const randomID = uuid();
	ipcRenderer.send("startReconciliationServer", {
		reqId: randomID,
		data: data,
		config: config,
	});
	const promise = new Promise((resolve) => {
		ipcRenderer.once(randomID, (event, data) => {
			resolve(data);
		});
	});
	return promise;
}
