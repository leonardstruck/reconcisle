import { configView } from "./views/config/index";
import { service } from "./service/service";
import meta from "./module.json";

export default function () {
	return {
		meta: meta,
		uuid: meta.uuid,
		configView: configView,
		service: service,
	};
}
