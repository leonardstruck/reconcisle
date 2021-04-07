import database from "./database/module";

export default function () {
	const modules = [database];
	const getConfigView = (uuid) => {
		return modules.find((module) => module().uuid === uuid)().configView;
	};
	return { modules, getConfigView };
}
