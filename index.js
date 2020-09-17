const express = require("express");
const app = express();
const dataService = require('./services/data.service');
const session = require("express-session");

app.use(session({
    secret: 'randomsecurestring',
    resave: false,
    saveUninitialized: false
}));

app.use(express.json());

const logMiddleWare = (req, res, next)=> {
    console.log(req.body);
    next();
}

app.use(logMiddleWare);

const authMiddleWare = (req, res, next) => {
    if(!req.session.currentUser) {
        return res.json({ 
            status: false,
            statusCode: 401,
            message: "please login"
        });
    }
    else {
        next();
    }
}

app.get("/", (req, res)=>{
    res.send("hello world..!!!")
})

app.get("/register", (req, res)=>{
    res.send("hello world..!!!")
});

app.post("/register", (req, res)=>{
    const result = dataService.register(req.body.name, req.body.accno, req.body.pin, req.body.password);
    res.status(result.statusCode).json(result);
});

app.post("/login", (req, res)=>{
    const result = dataService.login(req, req.body.accno, req.body.password);
    res.status(result.statusCode).json(result);
});

app.post("/deposit", (req, res)=>{
    app.use(authMiddleWare);
    const result = dataService.deposit(req.body.accno, req.body.pin, req.body.amount);
    res.status(result.statusCode).json(result);
});

app.post("/withdrawal", (req, res)=>{
    app.use(authMiddleWare);
    const result = dataService.withdrawal(req.body.accno, req.body.pin, req.body.amount);
    res.status(result.statusCode).json(result);
});

app.get("/getTransactions", (req, res)=>{
    app.use(authMiddleWare);
    const result = dataService.getTransactions(req);
    res.status(200).json(result);
});

app.listen(3000, ()=> {

    console.log("server is running on port 3000");
});