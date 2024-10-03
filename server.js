
const express = require('express');
const controller = require('./controller');
const sequelize = require('./config/connection');
const app = express();
const PORT = process.env.PORT || 3001;
const path = require('path');
const exphbs = require('express-handlebars');
const hbs = exphbs.create({});
const busboy = require('connect-busboy');
const session = require('express-session');
const SequelizeStore = require('connect-session-sequelize')(session.Store);
const models = require('./models');

process.env.TZ = "America/Chicago";

const sess = {
    secret: process.env.SECRET,
    cookie: {},
    resave: false,
    saveUninitialized: true,
    store: new SequelizeStore({
        db: sequelize
    })
};

app.use(busboy());
app.use(session(sess));
app.engine('handlebars', hbs.engine);

app.set('view engine', 'handlebars');

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.use(express.static(path.join(__dirname, 'public')));
app.use(controller);

sequelize.sync({ force: true }).then(() => {
    app.listen(PORT, () => {
        console.log(`listening on port ${PORT}`);
    });
});