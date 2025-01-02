
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const { DateTime } = require('luxon');
const { getFlagEmoji } = require('./helpers');

hbs.handlebars.registerHelper('basepath', () => {
    return process.env.BASEPATH;
});

hbs.handlebars.registerHelper('is', (value1, value2) => {
    return value1 == value2;
})

hbs.handlebars.registerHelper('dateTimeFormat', (date, format) => {
    if(!date) return '';
    return DateTime.fromJSDate(date).setZone('America/Chicago').toFormat(format);
});

hbs.handlebars.registerHelper('dateFormat', (date, format) => {
    if(!date) return '';
    return DateTime.fromISO(date).toFormat(format);
});

hbs.handlebars.registerHelper('getAge', (date) => {
    if(!date) return '';
    const today = DateTime.now();
    const birthday = DateTime.fromISO(date);
    const diff = today.diff(birthday, ["years"]).toObject();
    return Math.floor(diff.years);
});

hbs.handlebars.registerHelper('getHeight', (heightFeet, heightInches) => {
    return ((!heightFeet && heightFeet !=0) || (!heightFeet && heightFeet !=0)) ? '' : `${heightFeet}-${heightInches}`;
});

hbs.handlebars.registerHelper('getFlagEmoji', (countryCode) => {
    if(!countryCode) return '';
    return `<span class="fi fi-${countryCode.toLowerCase()}"></span>`;
});

hbs.handlebars.registerHelper('evaluateMatchResult', match => {
    const now = DateTime.now();
    const startTime = DateTime.fromJSDate(match.startTime);

    if(now < startTime) return 'Result Pending';

    const result = (match.ourScore > match.opponentScore) ? 'W' : (match.ourScore == match.opponentScore) ? 'D' : 'L';
    return `${match.ourScore || 0} - ${match.opponentScore || 0} ${result}`;
});

module.exports = hbs;