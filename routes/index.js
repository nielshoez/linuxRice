const express = require('express');
const router  = express.Router();
const {ensureAuthenticated} = require('../config/auth'); 
const { db } = require('../models/user');
const updateUser = require('../helpers/updateUser')
const scriptMaker = require('../helpers/scriptMaker')

//login page
router.get('/', (req,res)=>{
    res.render('welcome');
})
//register page
router.get('/register', (req,res)=>{
    res.render('register');
})

router.get('/home', ensureAuthenticated, (req,res)=>{
    res.render('home', {user: req.user})
})

router.post('/home', ensureAuthenticated, (req, res) => {
    const fileName = scriptMaker.createScript(req.body)
    const file = "./scripts/" + fileName
    res.download(file)
})

router.get('/settings/profile', ensureAuthenticated, (req,res)=>{
    res.render('profile', {user: req.user})
})

router.get('/settings/account', ensureAuthenticated, (req,res)=>{
    res.render('account', {user: req.user})
})

router.post('/settings/account', ensureAuthenticated, (req,res)=>{
    updateUser.updateUser(req.user._id, req.body.name, req.body.email)
    res.redirect('/settings/account');
})

router.get('/settings/preferences', ensureAuthenticated, (req,res)=>{
    res.render('preferences', {user: req.user})
})

router.post('/settings/preferences', ensureAuthenticated, (req,res)=>{
    updateUser.deleteUser(req.user._id)
    res.redirect('/')
})

/*router.get('/dashboard',ensureAuthenticated, async (req,res)=>{
    var weather = await weatherApi.meteoLocationWidget(req.user._id);
    var airQuality = await weatherApi.airQualityWidget(req.user._id);
    var corona = await coronaApi.getAllCorona(req.user._id);
    var coronaTest = await coronaApi.getAllCoronaTest(req.user._id);
    var word = await wordsApi.getAllWordDef(req.user._id);
    var wordPron  = await wordsApi.getAllWordDefPron(req.user._id);
    res.render('dashboard',{
        data : {
            user: req.user,
            weather: weather,
            air: airQuality,
            corona: corona,
            coronaTest: coronaTest,
            word : word,
            wordPron : wordPron,
        }
    });
})
//widgets
router.get('/widgets',ensureAuthenticated,(req,res)=>{
    res.render('widgets',{
        user: req.user
    });
})

//services
router.get('/services',ensureAuthenticated,(req,res)=>{
    res.render('services',{
        user: req.user
    });
})

router.post('/widgets',ensureAuthenticated,(req,res)=>{
    widgetCreator.create(req.user._id, req.body);
    res.redirect('dashboard');
})

router.post('/services',ensureAuthenticated,(req,res)=>{

    var body = req.body;
    var services = [];
    if (body.widget1 && !services.includes(body.widget1)) {
        services.push(body.widget1);
    }
    if (body.widget2 && !services.includes(body.widget2))
        services.push(body.widget2);
    if (body.widget3 && !services.includes(body.widget3))
        services.push(body.widget3);
    userUpdate.updateUser(req.user._id, services);
    res.redirect('dashboard');
})

router.get('/about.json', (req,res)=>
{
    var date = new Date().getTime();
    let rawdata = fs.readFileSync('./about.json');
    let about = JSON.parse(rawdata);
    var ip = req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
    ip = ip.split(',')[0];
    ip = ip.split(':').slice(-1);
    about.client.host = ip[0];
    about.server.current_time = date;
    res.json(about);
})*/
module.exports = router; 