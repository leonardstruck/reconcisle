import database from "./database/module";

export default function () {
	const modules = [database];
	const getConfigView = (uuid) => {
		return modules.find((module) => module().uuid === uuid)().configView;
	};
	const getService = (uuid) => {
		return modules.find((module) => module().uuid === uuid)().service;
	};

	const getMetaData = (uuid) => {
		return modules.find((module) => module().uuid === uuid)().meta;
	};

	return { modules, getConfigView, getService, getMetaData };
}
