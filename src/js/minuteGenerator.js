const generator = {
	irc: require('./minuteGeneratorIRCStyle.js'),
	html: require('./minuteGeneratorHTML.js')
};

const generateString = (data, input, date) => input.str
	.replace(/{NAME}/g, data.topic.name)
	.replace(/{DATE}/g, data.moment(date).format(input.dateFormat));

const getFormatedString = (data, profile) => {
	const date = new Date();
	[ "fileName", "description" ].reduce((acc, cur) => (
		acc[cur] = generateString(data, profile[cur], date), acc
	), data);
};

module.exports = (data, profileName, config) => {
	const profile = config.profile[profileName] || config.profile.default;
	if (config.profile[profileName] !== 'undefined') {
		[ "fileName", "keeexName" ].reduce((acc, cur) => (
			acc[cur] = profile[cur] && profile[cur].str ?  profile[cur] :
			config.profile.default[cur], acc), profile);
		profile.generator = profile.generator || config.profile.default.generator;
	}

	data.moment = require('moment');
	data.moment.locale(profile.dateLocale);
	getFormatedString(data, profile);
	return generator[profile.generator](data, profile);
};
