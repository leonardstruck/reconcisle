const yargs = require("yargs");
const argv = yargs(process.argv).argv;
const port = argv.port || 1234;
const express = require("express");
const morgan = require("morgan");
const { Worker } = require("worker_threads");

const app = express();

app.use(morgan("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (!port) {
	console.log("You have to specify a port using the --port argument");
	process.exit(1);
}
const projectName = argv.projectName;
if (!projectName) {
	console.log(
		"You have to specify the project's name using the --projectName argument"
	);
	process.exit(1);
}
const storagePath = argv.storagePath;
if (!storagePath) {
	console.log(
		"You have to specify the UserData path using the --storagePath argument"
	);
	process.exit(1);
}
const infoHTML = require("./infoHTML.js").getHTML(port);
const serviceMetadata = require("./serviceMetadata").get(port);

//get Data from Store
const Store = require("electron-store");
const store = new Store({ name: projectName, cwd: storagePath });
const data = store.get("data");
//get Reconciliation Parameters from Project File
const SearchColumn = store.get("config").reconcParams.searchColumn;
const IDColumn = store.get("config").reconcParams.idColumn;
const filteredData = data.map((item) => {
	const filteredObject = {
		[SearchColumn]: item[SearchColumn],
		[IDColumn]: item[IDColumn],
	};
	return filteredObject;
});

const runService = (workerData) => {
	return new Promise((resolve, reject) => {
		const worker = new Worker("./worker.js", { workerData });
		worker.on("message", resolve);
		worker.on("error", reject);
		worker.on("exit", (code) => {
			if (code !== 0) {
				reject(new Error("Worker stopped with exit code " + code));
			}
		});
	});
};

const search = async (query, limit, key) => {
	return new Promise((resolve, reject) => {
		runService({
			data: filteredData,
			SearchColumn: SearchColumn,
			query: query,
			limit: limit,
		}).then((result) => {
			let matches = [];
			result.map((entity) => {
				matches.push({
					id: entity.item[IDColumn],
					name: entity.item[SearchColumn],
					score: (1 - entity.score) * 100,
					match: (1 - entity.score) * 100 > 98,
					type: [{ id: "/reconcIsle/", name: "reconcIsle" }],
				});
			});
			resolve({ [key]: { result: matches } });
		});
	});
};

const reconcileQueries = (rawQueries) => {
	const promise = new Promise((resolve, reject) => {
		const queries = JSON.parse(rawQueries);
		const promises = Object.keys(queries).map((key) => {
			return search(queries[key].query, queries[key].limit || 10, key);
		});
		Promise.all(promises).then((res) => {
			resolve(Object.assign({}, ...res));
		});
	});
	return promise;
};

//Routes
app.get("/", (req, res) => {
	if (req.query.callback) {
		res.jsonp(serviceMetadata);
	} else {
		res.send(infoHTML);
	}
});

app.get("/reconcile", (req, res) => {
	if (req.query.callback) {
		res.jsonp(serviceMetadata);
	}
});

app.post("/reconcile", (req, res) => {
	reconcileQueries(req.body.queries).then((result) => {
		res.send(result);
	});
});

app.get("/view/:params", (req, res) => {
	res.send(req.params.params);
});

app.get("*", (req, res) => {
	res.status(404).send("ERROR 404");
});

//Start Server
app.listen(port, () => {
	console.log(
		"Reconciliation Service is listening at http://localhost:" + port
	);
});
