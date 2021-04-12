const { workerData, parentPort } = require("worker_threads");
const Fuse = require("fuse.js");

const data = workerData.data;
const SearchColumn = workerData.SearchColumn;
const query = workerData.query;
const limit = workerData.limit;

//Setup Fuse.js Fuzzy Searching
const fuse = new Fuse(data, {
	keys: [SearchColumn],
	includeScore: true,
});

const result = fuse.search(query, { limit: limit });
parentPort.postMessage(result);
