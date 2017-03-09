const kxapi = require("keeex-api");

const currentView = () => new Promise((resolve, reject) => {
	kxapi.currentView((error, currentTopic) => {
		if (error) reject(`currentView error: ${error}`);
		resolve(currentTopic);
	});
});

const getAgreements = idx => new Promise((resolve, reject) => {
	kxapi.getAgreements(idx, (error, agreements) => {
		if (error) reject(`getAgreements error: ${error}`);
		resolve(agreements);
	});
});

const getComments = idx => new Promise((resolve, reject) => {
	kxapi.getComments(idx, (error, comments) => {
		if (error) reject(`getComments error: ${error}`);
		resolve(comments);
	});
});

const getEnv = name => new Promise((resolve, reject) => {
	kxapi.env(name, (error, data) => {
		if (error) reject(`getEnv error: ${error}`);
		resolve(data);
	});
});

const getLocations = idxs => new Promise((resolve, reject) => {
	kxapi.getLocations(idxs, (error, locations) => {
		if (error) reject(`getLocations error: ${error}`);
		resolve(locations);
	});
});

const getRefs = idxs => new Promise((resolve, reject) => {
	kxapi.getRefs(idxs, (error, refs) => {
		if (error) reject(`getLocations error: ${error}`);
		resolve(refs);
	});
});

const getShared = idx => new Promise((resolve, reject) => {
	kxapi.getShared(idx, (error, shared) => {
		if (error) reject(`getShared error: ${error}`);
		resolve(shared);
	});
});

const getToken = pluginName => new Promise((resolve, reject) => {
	kxapi.getToken(pluginName, (error, token) => {
		if (error) reject(`getToken error: ${error}`);
		resolve(token);
	});
});

const getTopics = idxs => new Promise((resolve, reject) => {
	kxapi.getTopics(idxs, (error, topics) => {
		if (error) reject(`getTopics error: ${error}`);
		resolve(topics);
	});
});

const getUsers = usersList => new Promise((resolve, reject) => {
	kxapi.getUsers(usersList, (error, data) => {
		if (error) reject(`getusers error: ${error}`);
		resolve(data);
	});
});

const keeex = (path, refs, prevs, description, options) => new Promise((resolve, reject) => {
	kxapi.keeex(path, refs, prevs, description, options, (error, keeexedfile) => {
		if (error) reject(`keeexing file error: ${error}`);
		resolve(keeexedfile);
	});
});

const share = (idx, path, recipients, options) => new Promise((resolve, reject) => {
	kxapi.share(idx, path, recipients, options, (error, sharedFile) => {
		if (error) reject(`share error: ${error}`);
		resolve(sharedFile);
	});
});

module.exports = {
	currentView,
	getAgreements,
	getComments,
	getEnv,
	getLocations,
	getShared,
	getToken,
	getTopics,
	getRefs,
	getUsers,
	keeex,
	share
};
