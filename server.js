const express = require('express');
const path = require('path');
const cfenv = require('cfenv').getAppEnv();
const nodemailer = require('nodemailer');

const NODE_ENV = process.env.NODE_ENV || 'development';
const CACHE_CONTROL = {};

if (NODE_ENV !== 'production') {
    require("dotenv").load();
}

const GMAIL_USERNAME = process.env.GMAIL_USERNAME || '';
const GMAIL_PASSWORD = process.env.GMAIL_PASSWORD || '';

const app = express();
const parser = {
    body: require('body-parser'),
    cookie: require('cookie-parser')
};

app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
if (NODE_ENV !== 'production') {
    const sass = require('node-sass-middleware');
    app.use(sass({
        src: __dirname + '/sass',
        dest: __dirname + '/public',
        // debug: true,
        outputStyle: 'compressed'
    }));
} else {
    app.set('view cache', true);
    app.use(require('compression')());
    CACHE_CONTROL.maxAge = 2592000000;
}
app.use(express.static(__dirname + '/public', CACHE_CONTROL));
app.use(parser.cookie());
app.use(parser.body.urlencoded({ extended: false }));
app.use(parser.body.json());

app.get('/', function(req, res) {
    res.redirect('/about');
});

app.get('/home', function(req, res) {
    res.redirect('/');
});

app.get('/about', function(req, res) {
    res.render('about', { env: NODE_ENV, skillsets: require('./data/skillset.json') });
});

app.get('/projects', function(req, res) {
    res.render('project', { env: NODE_ENV, projects: require('./data/project.json') });
});

app.get('/p/:code', function(req, res) {
    const projects = require('./data/project.json');
    res.render('entity', {
        env: NODE_ENV,
        project: projects.find(function(project) {
            return project._id === req.params.code;
        })
    });
});

app.get('/contact', function(req, res) {
    res.render('contact', { env: NODE_ENV });
    // res.render('about', { env: NODE_ENV, skillsets: require('./data/skillset.json') });
});

app.get('/resume', function(req, res) {
    res.sendFile(path.join(__dirname, '/public', '/media/documents/resume.pdf'));
});

app.post('/mail', function(req, res) {
    if (!req || !req.body || !req.body._email || !req.body.subject || !req.body.content) {
        res.status(500).json({ status: 500, message: 'error parsing data' });
    } else {
        const transporter = nodemailer.createTransport({
            service: 'Gmail',
            port: 25,
            server: 'smtp.gmail.com',
            auth: {
                user: GMAIL_USERNAME + '@gmail.com',
                pass: GMAIL_PASSWORD
            }
        });
        transporter.sendMail({
            from: req.body.name + ' <noreply@briansoe.com>',
            to: 'brian.soe003@gmail.com',
            subject: '[FROM WEBSITE] | ' + req.body.subject,
            // html: req.body.content,
            text: 'Sender Email: ' + req.body._email + '\n\n' + req.body.content
        }, function(error, info) {
            if (error) {
                console.log(error);
                transporter.close();
                res.status(500).json({ status: 500, message: error });
            } else {
                console.log('Message sent: ' + info.response);
                transporter.close();
                res.status(200).json({ status: 200, message: 'Message sent: ' + info.response });
            }
        });
    }
});

app.listen(cfenv.port, '0.0.0.0', function() {
    console.log("Server starting on " + cfenv.url);
});
