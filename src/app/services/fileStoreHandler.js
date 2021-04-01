import uuid from 'react-uuid';
import { ipcRenderer } from 'electron';

export async function fileStoreHandler(req) {
    const randomID = uuid();
    ipcRenderer.send("fileStore", {reqId: randomID, store: req.store, method: req.method, obj: req.obj});
    const promise = new Promise((resolve, reject) => {
        ipcRenderer.once(randomID, (event, data) => {
            resolve(data);
        })
    })
    return promise;
}