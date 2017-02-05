module.exports = (data, profile) => {
	const commentDate = date => data.moment(date).format(profile.options.commentDateFormat);
	const eol = profile.options.eol || '\n';
	let str = `Document: ${data.topic.name}${eol}`;
	str += `Created by: ${data.users[data.topic.author[0]].name}${eol}`;
	str += `Creation date: ${data.topic.creationDate}${eol}`;
	str += `Description:${eol}`;
	str += data.topic.description.replace(/<br>/g, eol) + eol;
	str += `Comments:${eol}`;
	str = data.comments.reduce((acc, cur) => acc + profile.options.comment
		.replace(/{NAME}/g, data.users[cur.author[0]].name)
		.replace(/{DATE}/g, commentDate(cur.creationDate))
		.replace(/{MESSAGE}/g, cur.name) + eol, str);
	return str;
};
