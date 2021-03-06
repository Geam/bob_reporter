const path = require('path');
const fs = require('mz/fs');
const kxapi = require('./js/kxapiPromise.js');
const minuteGenerator = require('./js/minuteGenerator.js');
const pjson = require('./package.json');

const escapeFileName = fileName => {
	if (process.platform === "win32") {
		return fileName.replace(/[<>:"/\\|?*]/g, '');
	} else {
		return fileName.replace(/\//g, '');
	}
};

const config = {
	profile: {
		default: {
			fileName: {
				str: "{NAME}_minutes_{DATE}.html",
			},
			description: {
				str: "{NAME} minutes {DATE}"
			},
			generator: "html",
			options: {
				comment: "{DATE} {NAME}> {MESSAGE}",
				eol: "\n"
			}
		}
	}
};

const getTopicAndComments = idx => Promise.all([
	kxapi.getTopics([idx]),
	kxapi.getShared(idx),
	kxapi.getRefs(idx),
	kxapi.getAgreements(idx)
])
	.then(([topics, shared, comments, agreements]) => Promise.all([
		topics,
		shared,
		comments.concat(agreements.filter(e => e))
	]))
	.then(([topics, shared, comments]) => Promise.all([
		topics[0],
		shared ? shared.shared : [],
		comments.sort((a, b) =>
			new Date(a.creationDate) - new Date(b.creationDate)),
		kxapi.getUsers(Array.from(comments.map(e => e.author[0])
			.reduce((acc, cur) => (acc.add(cur), acc), new Set([topics[0].author[0]]))))
	]))
	.then(([topic, shared, comments, users]) => ({topic, shared, comments,
		users: users.reduce((acc, cur) => (acc[cur.profileIdx] = cur, acc), {})}));

const writeKeeexShare = (data, str) => {
	const filePath = path.join(config.defaultPath, escapeFileName(data.fileName));
	const opt = {
		targetFolder: config.defaultPath,
		timestamp: false,
		name: escapeFileName(data.fileName),
		description: data.description
	};
	return fs.writeFile(filePath, str, 'utf8')
	//.then(() => Promise.reject("dev"))
		.then(() => kxapi.keeex(filePath, [data.topic.idx], [], data.description, opt))
		.then(keeexedFile => {
			if (!data.shared || data.shared.length === 0) return ;
			return kxapi.share(keeexedFile.topic.idx, keeexedFile.path, data.shared, {email: false});
		})
		.then(() => fs.unlink(filePath));
};

const generateMinutes = (idx, profileName) => getTopicAndComments(idx)
	.then(data => Promise.all([data, minuteGenerator(data, profileName, config)]))
	.then(([data, str]) => writeKeeexShare(data, str))
	.then(ret => console.log("Minutes done !"))
	.catch(console.log);

const loadConfig = () => fs.readFile(config.path, 'utf8')
	.then(data => {
	})
	.catch(err => {
	});

const handleGenerateMinutesClick = () => kxapi.currentView()
	.then(topic => generateMinutes(topic.idx))
	.then(() => {
		let el = document.querySelector("#done");
		el.style.display = "";
		setInterval(() => { el.style.display = "none"; }, 10000);
	})
	.catch(err => console.log(err));

document.onreadystatechange = () => {
	if (document.readyState !== "complete") return ;
	kxapi.getToken("bob reporter")
		.then(() => Promise.all([
			kxapi.getEnv("KEEEX_PATH"),
			kxapi.getEnv("KEEEXED_PATH")
		]))
		.then(([configPath, keeexedPath]) => {
			config.path = path.join(configPath.value, "plugins", pjson.name, "config");
			config.defaultPath = path.join(keeexedPath.value, pjson.name);
			return fs.mkdir(config.defaultPath)
				.catch(err => {
					if (err.code != 'EEXIST')
						throw err;
				});
		})
		.then(() => loadConfig())
		.catch(err => console.log(err));
};
