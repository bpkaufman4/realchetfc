
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const { DateTime } = require('luxon');

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

hbs.handlebars.registerHelper('getHeight', (heightFeet, heightInches) => {
    return (heightFeet && heightInches) ? `${heightFeet}'${heightInches}"` : '';
});

hbs.handlebars.registerHelper('evaluateMatchResult', match => {
    const now = DateTime.now();
    const startTime = DateTime.fromJSDate(match.startTime);

    if(now < startTime) return 'Result Pending';

    const result = (match.ourScore > match.opponentScore) ? 'W' : (match.ourScore == match.opponentScore) ? 'D' : 'L';
    return `${match.ourScore} - ${match.opponentScore} ${result}`;
})



module.exports = hbs;