import uuid from "react-uuid";
import { ipcRenderer } from "electron";

export async function fileStoreHandler(req) {
	const randomID = uuid();
	const promise = new Promise((resolve, reject) => {
		ipcRenderer.send("fileStore", {
			reqId: randomID,
			store: req.store,
			method: req.method,
			obj: req.obj,
		});
		ipcRenderer.once(randomID, (event, data) => {
			resolve(data);
		});
	});
	return promise;
}
