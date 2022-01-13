import fs from "fs";

function flattenInDir(dir) {
	const files = fs.readdirSync(dir);
	files.map((file) => {
		const filename = `${dir}/${file}`;
		if (fs.statSync(filename).isDirectory()) {
			return flattenInDir(filename);
		}
		if (filename.endsWith(".json")) {
			const content = JSON.parse(fs.readFileSync(filename, { encoding: "utf-8" }));
			fs.writeFileSync(filename, JSON.stringify(flatten(content), undefined, 2));
		}
	});
}

flattenInDir("src/wordings");

// https://stackoverflow.com/a/19101235
function flatten(data) {
	var result = {};
	function recurse(cur, prop) {
		if (Object(cur) !== cur) {
			result[prop] = cur;
		} else if (Array.isArray(cur)) {
			for (var i = 0, l = cur.length; i < l; i++) recurse(cur[i], prop + "[" + i + "]");
			if (l == 0) result[prop] = [];
		} else {
			var isEmpty = true;
			for (var p in cur) {
				isEmpty = false;
				recurse(cur[p], prop ? prop + "." + p : p);
			}
			if (isEmpty && prop) result[prop] = {};
		}
	}
	recurse(data, "");
	return result;
}
