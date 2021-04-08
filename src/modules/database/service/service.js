import mysql from "./mysql";

export const service = (method, obj) => {
	const promise = new Promise((resolve, reject) => {
		switch (obj.driver) {
			case "mysql":
				mysql(method, obj).then((res) => {
					resolve(res);
				});
		}
	});
	return promise;
};
