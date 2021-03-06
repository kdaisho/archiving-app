const fs = require("fs");
const path = require("path");
const multer = require("multer");
const jimp = require("jimp");
const storage = multer.memoryStorage();
const upload = multer({ storage }).single("file");
const { deleteFile, writeItem, setLastUpdated } = require("../helpers");

const appListPath = path.join(__dirname, "../data/applications.json");
const getAppPath = (appId) => path.join(__dirname, `../data/applications/${appId}.json`);

exports.init = (req, res) => {
	const data = fs.existsSync(appListPath) ? JSON.parse(fs.readFileSync(appListPath)) : {};
	res.json(data);
};

exports.getList = (req, res) => {
	fs.readFile(getAppPath(req.params.appId), (error, buffer) => {
		if (error) throw error;
		const dataObj = {
			list: buffer.length ? JSON.parse(buffer) : initDataFile(),
			ts: JSON.parse(fs.readFileSync(appListPath))[req.params.appId]["lastUpdated"]
		};
		res.send(dataObj);
	});

	function initDataFile() {
		fs.writeFileSync(getAppPath(req.body.appId), "[]");
		return [];
	}
};

exports.uploadFile = (req, res) => {
	upload(req, res, (error) => {
		if (error) {
			return res.status(500).json(error);
		}
		//Reading image from buffer so that Jimp can resize
		//Buffer is available when storage instance is created from memoryStorage instead of diskStorage
		jimp
			.read(req.file.buffer)
			.then((img) => {
				const width = img.bitmap.width > 960 ? 960 : img.bitmap.width;
				return img
					.resize(width, jimp.AUTO)
					.quality(70)
					.write(
						`${path.join(__dirname, `../dist/images/uploads/${req.body.appId}/`)}${
							req.body.fileName
						}`,
						(error, response) => {
							if (error) throw error;
							res.status(200).send(req.file);
						}
					);
			})
			.catch((error) => console.error(error));
	});
};

exports.addItem = (req, res) => {
	const data = getResolvedData(JSON.parse(fs.readFileSync(getAppPath(req.body.appId))), req.body);
	writeItem(JSON.stringify(data, null, 4), req.body.appId, req.body.id, setLastUpdated).then(
		res.json(data)
	);

	function getResolvedData(targetArray, reqObj) {
		const getCategoryObj = (id, name) => {
			return (obj = { id, name, subcategories: [] });
		};

		const getSubcatObj = (id, name, filename, status) => {
			return (obj = { id, name, filename, status });
		};

		for (let i = 0; i < targetArray.length; i++) {
			if (targetArray[i].name.toLowerCase() === reqObj.category.toLowerCase()) {
				for (let j = 0; j < targetArray[i].subcategories.length; j++) {
					if (
						targetArray[i].subcategories[j].name.toLowerCase() ===
							reqObj.subcategory.toLowerCase() &&
						!reqObj.editing
					) {
						return targetArray;
					} else if (
						targetArray[i].subcategories[j].name.toLowerCase() ===
							reqObj.subcategory.toLowerCase() &&
						reqObj.editing &&
						reqObj.fileName
					) {
						const returnedObj = Object.assign(
							targetArray[i].subcategories[j],
							getSubcatObj(targetArray[i].subcategories[j].name, reqObj.fileName, reqObj.status)
						);
						targetArray[i].subcategories[j] = returnedObj;
						return targetArray;
					}
				}
				targetArray[i].subcategories.push(
					getSubcatObj(reqObj.id, reqObj.subcategory, reqObj.fileName, reqObj.status)
				);
				return targetArray;
			}
		}
		const categoryObj = getCategoryObj(reqObj.id, reqObj.category);
		categoryObj.subcategories.push(
			getSubcatObj(reqObj.id, reqObj.subcategory, reqObj.fileName, reqObj.status)
		);

		targetArray.push(categoryObj);
		return targetArray;
	}
};

exports.deleteItem = (req, res) => {
	const { appId, category, subcategory, image, ts } = req.body;
	fs.readFile(getAppPath(appId), (error, data) => {
		if (error) throw error;
		data = JSON.parse(data).slice();
		const [cat] = data.filter((cat) => {
			return cat.name === category;
		});
		cat.subcategories = cat.subcategories.filter((subcat) => {
			subcat.name !== subcategory;
		});
		deleteFile(appId, image);
		writeItem(
			JSON.stringify(removeCategoryWithNoSubcategory(data, cat), null, 4),
			appId,
			ts,
			setLastUpdated
		).then(res.json(data));
	});

	function removeCategoryWithNoSubcategory(data, cat) {
		if (cat.subcategories.length <= 0) {
			for (let i = 0; i < data.length; i++) {
				if (data[i].name === cat.name) {
					data.splice(i, 1);
				}
			}
		}
		return data;
	}
};

exports.getItem = (req, res) => {
	let category = {};
	const returnSubcat = [];
	fs.readFile(getAppPath(req.params.appId), (error, data) => {
		if (error) throw error;
		data = JSON.parse(data).slice();
		data.forEach((cat, i) => {
			cat.subcategories.forEach((subcat) => {
				if (subcat.id.toString() === req.params.id) {
					category = data[i];
					returnSubcat.push(subcat);
					category.subcategories = returnSubcat;
				}
			});
		});
		res.json(category);
	});
};

exports.saveEditItem = (req, res) => {
	fs.readFile(getAppPath(req.body.appId), (error, data) => {
		if (error) throw error;
		data = JSON.parse(data).slice();
		data.forEach((cat, i) => {
			cat.subcategories.forEach((subcat, index) => {
				if (subcat.id.toString() === req.params.id) {
					subcat.id = req.body.ts;
					subcat.name = req.body.subcategory;
					subcat.status = req.body.status;
					if (req.body.fileName) {
						deleteFile(req.body.appId, subcat.filename);
						subcat.id = req.body.ts;
						subcat.filename = req.body.fileName;
					}
					cat.subcategories[index] = subcat;
					data[i] = cat;
				}
			});
		});

		writeItem(JSON.stringify(data, null, 4), req.body.appId, req.body.ts, setLastUpdated).then(
			res.json(data)
		);
	});
};
