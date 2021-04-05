import { dialog } from "electron";
import Store from "electron-store";
import path from "path";
import fs from "fs";

const projects = new Store({
	name: "projects",
	defaults: {
		projects: [],
	},
});

export const fileStore = (store, method, obj, userDataPath) => {
	switch (store) {
		case "projects":
			switch (method) {
				case "get":
					return projects.get("projects");
				case "delete":
					const projectPath = path.join(userDataPath, obj.name + ".json");
					fs.unlink(projectPath, (err) => {
						if (err) {
							throw new Error("Couldn't delete project file");
						} else {
							const projectsWithDeleted = projects.get("projects");
							const projectsWithoutDeleted = projectsWithDeleted.filter(
								(project) => project.name !== obj.name
							);
							projects.set("projects", projectsWithoutDeleted);
						}
					});
				case "checkduplicate":
					const storedProjects = projects.get("projects");
					if (storedProjects.length === 0) {
						return "ok";
					}
					const duplicates = storedProjects.filter(
						(project) => project.name === obj
					);
					if (duplicates.length === 0) {
						return "ok";
					} else {
						return "duplicate";
					}
			}
			break;

		case "project":
			switch (method) {
				case "newProject":
					const newProject = new Store({
						name: obj.general.name,
					});
					newProject.set("config", obj);
					const allProjects = projects.get("projects");
					allProjects.push(obj.general);
					projects.set("projects", allProjects);
					return { status: "ok" };
				case "export":
					dialog
						.showSaveDialog({
							defaultPath: obj.name + ".risle",
						})
						.then((res) => {
							const projectStore = new Store({
								name: obj.name,
							});
							const stringified = JSON.stringify(projectStore.store);
							fs.writeFile(res.filePath, stringified, (err) => {
								if (err) throw new err();
								return { status: "ok" };
							});
						});
				default:
					return { status: "error" };
			}

		default:
			throw new Error("call to unknown store");
	}
};
