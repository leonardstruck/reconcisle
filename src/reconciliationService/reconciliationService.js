const fastify = require("fastify")({ logger: true });
fastify.register(require("fastify-formbody"));
const yargs = require("yargs");
const jsrender = require("jsrender");
const argv = yargs(process.argv).argv;
const port = argv.port;
const Fuse = require("fuse.js");

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

console.log(
	"I found the following Reconciliation Parameters: " +
		SearchColumn +
		" & " +
		IDColumn
);

//Setup Fuse.js Fuzzy Searching
const fuse = new Fuse(data, {
	keys: [SearchColumn],
	includeScore: true,
});

const search = async (query, limit) => {
	if (!query) {
		return [];
	}
	const searchResult = await fuse.search(query, { limit: limit || 10 });
	const matches = [];
	searchResult.map((entity) => {
		matches.push({
			id: entity.item[IDColumn],
			name: entity.item[SearchColumn],
			score: (1 - entity.score) * 100,
			match: (1 - entity.score) * 100 > 98,
			type: [
				{
					id: "/reconcIsle/",
					name: "reconcIsle",
				},
			],
		});
	});
	return matches;
};

const reconcile = async (query, request, reply) => {
	let responseObj = {};
	switch (typeof query) {
		case "object":
			const queries = JSON.parse(query.queries);
			const searchResults = await Promise.all(
				Object.keys(queries).map(async function (key) {
					let searchResponse = await search(
						queries[key].query,
						queries[key].limit
					);
					return { [key]: { result: searchResponse } };
				})
			);
			responseObj = Object.assign({}, ...searchResults);
			break;
		default:
			console.log("Type not programmed");
	}
	jsonpify(request, reply, responseObj);
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

//Render Data to HTML for preview
const renderItem = (id) => {
	const item = data.find((o) => o[IDColumn] == id);
	let html = "<table border ='1'>";
	for (x in item) {
		html += "<tr><td>" + x + "</td><td>" + item[x] + "</td></tr>";
	}
	html += "</table>";
	return html;
};

//Declare Routes
fastify.get("/", (request, reply) => {
	if (request.query.callback) {
		jsonpify(request, reply, serviceMetadata);
	} else {
		reply.type("text/html");
		reply.send(infoHTML);
	}
});

fastify.get("/reconcile", (request, reply) => {
	if (request.query.query) {
		reconcile(request.query.query, request, reply);
	} else if (request.query.queries) {
		reconcile(request.query.queries, request, reply);
	} else if (request.body) {
		reconcile(request.body, request, reply);
	} else {
		jsonpify(request, reply, serviceMetadata);
	}
});

fastify.post("/reconcile", (request, reply) => {
	if (request.query.query) {
		reconcile(request.query.query, request, reply);
	} else if (request.query.queries) {
		reconcile(request.query.queries, request, reply);
	} else if (request.body) {
		reconcile(request.body, request, reply);
	} else {
		jsonpify(request, reply, serviceMetadata);
	}
});

fastify.get("/view/:params", (request, reply) => {
	reply.type("text/html");
	reply.send(renderItem(request.params.params));
});

fastify.get("/data", (request, reply) => {});

fastify.get("/suggest", (request, reply) => {});

fastify.get("/flyout", (request, reply) => {});

fastify.get("/private/flyout", (request, reply) => {});

fastify.get("*", (req, res) => {
	res.status(404).send("Error 404");
});

//Start the server
fastify.listen(port, (err) => {
	if (err) {
		console.log(err);
		process.exit(1);
	}
	console.log("Service is running on port", port);
});
