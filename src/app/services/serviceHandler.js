import uuid from "react-uuid";
import { ipcRenderer } from "electron";

export async function serviceHandler(sourceModule, method, obj) {
	const randomID = uuid();
	ipcRenderer.send("service", {
		reqId: randomID,
		sourceModule: sourceModule,
		method: method,
		obj: obj,
	});
	const promise = new Promise((resolve, reject) => {
		ipcRenderer.once(randomID, (event, data) => {
			if (data.status === "error") {
				reject(data.errorMessage);
			}
			resolve(data);
		});
	});
	return promise;
}
