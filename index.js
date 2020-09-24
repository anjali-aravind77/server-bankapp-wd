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
        return res.status(401).json({ 
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
    dataService.register(req.body.name, req.body.accno, req.body.pin, req.body.password)
    .then(result => {
        res.status(result.statusCode).json(result);
    });
    // res.status.json(result);
    // const result = dataService.register(req.body.name, req.body.accno, req.body.pin, req.body.password);
    // res.status(result.statusCode).json(result);

});

app.post("/login", (req, res)=>{
     dataService.login(req, req.body.accno, req.body.password)
    .then(result => {
        res.status(result.statusCode).json(result);
    });
});

app.post("/deposit", authMiddleWare, (req, res)=>{
    // app.use(authMiddleWare);
     dataService.deposit(req.body.accno, req.body.pin, req.body.amount)
     .then(result => {
         res.status(res.statusCode).json(result);
     })
    // res.status(result.statusCode).json(result);
});

app.post("/withdrawal", authMiddleWare, (req, res)=>{
    // app.use(authMiddleWare);
    dataService.withdrawal(req.body.accno, req.body.pin, req.body.amount)
    .then(result => {
        res.status(result.statusCode).json(result);
    })
   
});

app.get("/getTransactions", authMiddleWare, (req, res)=>{   
    // app.use(authMiddleWare);
    dataService.getTransactions(req)
    .then(result => {
        res.status(200).json(result);
    })
    
});

app.delete("/getTransactions/:id", authMiddleWare, (req, res)=>{   
    // app.use(authMiddleWare);
    dataService.deleteTransactions(req,req.params.id)
    .then(result => {
        res.status(200).json(result);
    })
  
});

app.listen(3000, ()=> {

    console.log("server is running on port 3000");
});