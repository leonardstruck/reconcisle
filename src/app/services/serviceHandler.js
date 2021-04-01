import uuid from "react-uuid";
import { ipcRenderer } from "electron";

export async function serviceHandler(req) {
	const randomID = uuid();
	ipcRenderer.send("service", {
		reqId: randomID,
		service: req.service,
		method: req.method,
		obj: req.obj,
	});
	const promise = new Promise((resolve) => {
		ipcRenderer.once(randomID, (event, data) => {
			resolve(data);
		});
	});
	return promise;
}
