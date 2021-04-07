import { configView } from "./views/config/index";
import meta from "./module.json";

export default function () {
	return {
		meta: meta,
		uuid: meta.uuid,
		configView: configView,
	};
}
