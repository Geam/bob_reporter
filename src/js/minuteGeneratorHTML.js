const fs = require('mz/fs');
let css;
fs.readFile('./css/minute.css')
	.then(data => css = data.toString());

const userAvatar = u => {
	if (!u.avatar || u.avatar === "") return "";
	return `.${u.profileIdx}{background-image:url(data:image/png;` +
		`base64,${u.avatarb64})}`;
};

const head = (data, profile) => `<head><meta charset="utf-8"/>` +
	`<title>${data.fileName}</title><style type="text/css">${css}` +
	Object.keys(data.users).reduce((acc, cur) => acc +
		`${userAvatar(data.users[cur])}`, "") + `</style>`;

const headerElement = (label, value) => `<div>` +
	`<span class="infoElement infoElementLabel">${label}</span>` +
	`<span class="infoElement">${value}</span>` +
	`</div>`;

const documentHeader = (data, profile) => `<div class="documentHeader">` +
	`<h1>${data.topic.name}</h1><div>` +
	[
		{ label: "Created by:", value: data.users[data.topic.author[0]].name },
		{ label: "Creation Date:", value: data.topic.creationDate },
		{ label: "Description:", value: data.topic.description },
		{ label: "Comments:", value: "" }
	].reduce((acc, cur) => acc + headerElement(cur.label, cur.value), "") +
	`</div></div>`;

const getComment = (data, profile, comment) => {
	commentDate = date => data.moment(date).format(profile.options.commentDateFormat);
	return `<div class="comment"><div class="${comment.author[0]} avatar"></div>` +
		`<div class="commentBody"><div class="commentHeader">` +
		`<span class="author">${data.users[comment.author[0]].name}</span>` +
		`&nbsp;<span class="commentDate">${commentDate(comment.creationDate)}</span>` +
		`</div><div>${comment.name}</div></div></div>`;
};

const body = (data, profile) => '<body>' + documentHeader(data,profile) +
	'<div>' + data.comments.reduce((acc, cur) => acc + getComment(data, profile, cur), "") +
	'</div></body>';

const loadUsersAvatar = data => {
	const promiseSerie = w => w.reduce((q, fn) => q.then(fn), Promise.resolve());
	const addAvatar = u => () => fs.readFile(u.avatar)
		.then(data => u.avatarb64 = new Buffer(data).toString('base64'));
	return promiseSerie(Object.keys(data.users)
		.map(e => data.users[e])
		.filter(e => e.avatar)
		.map(addAvatar));
};

module.exports = (data, profile) => {
	return loadUsersAvatar(data)
		.then(() => {
			let str = '<!DOCTYPE html><html>';
			str += head(data, profile);
			str += body(data, profile);
			str += '</html>';
			return str;
		});
};
