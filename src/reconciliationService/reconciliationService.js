const { Worker, workerData } = require("worker_threads");
const Fastify = require("fastify");
const fastify = Fastify({ logger: true });
const fastifyFormbody = require("fastify-formbody");
fastify.register(fastifyFormbody);
const path = require("path");
const port = workerData.port;
const projectName = workerData.projectName;
const storagePath = workerData.storagePath;
if (!port) {
	console.log("You have to specify a port using the --port argument");
	process.exit(1);
}
if (!projectName) {
	console.log(
		"You have to specify the project's name using the --projectName argument"
	);
	process.exit(1);
}
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

const runService = (data) => {
	return new Promise((resolve, reject) => {
		const workerPath = path.join(workerData.path, "worker.js");
		const worker = new Worker(workerPath, {
			workerData: {
				data: data.data,
				SearchColumn: data.SearchColumn,
				query: data.query,
				limit: data.limit,
			},
		});
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
					score: (100 - entity.score * 100).toFixed(5),
					match: 100 - entity.score * 100 > 98,
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

const renderItem = (id) => {
	const item = data.find((o) => o[IDColumn] == id);
	let html = "<table border ='1'>";
	for (x in item) {
		html += "<tr><td>" + x + "</td><td>" + item[x] + "</td></tr>";
	}
	html += "</table>";
	return html;
};

//JSONP
const jsonpify = (request, reply, obj) => {
	if (request.query.callback) {
		reply.type("application/javascript");
		const rep = request.query.callback + "(" + JSON.stringify(obj) + ")";
		const repEscaped = rep.replace(/\//g, "\\/");
		console.log("This is the reply sent back", repEscaped);
		reply.send(repEscaped);
	} else {
		reply.send(obj);
	}
};

//Routes
fastify.get("/", (request, reply) => {
	if (request.query.callback) {
		jsonpify(request, reply, serviceMetadata);
	} else {
		reply.type("text/html; charset=utf-8");
		reply.send(infoHTML);
	}
});

fastify.get("/reconcile", (request, reply) => {
	if (request.query.callback) {
		jsonpify(request, reply, serviceMetadata);
	}
});

fastify.post("/reconcile", (request, reply) => {
	reconcileQueries(request.body.queries).then((result) => {
		reply.send(result);
	});
});

fastify.get("/view/:params", (request, reply) => {
	reply.type("text/html");
	reply.send(renderItem(request.params.params));
});

fastify.get("*", (request, reply) => {
	request.status(404).send("ERROR 404");
});

//Start Server
fastify.listen(port, (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	console.log("Service is running on port", port);
});
