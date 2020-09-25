
const db = require('./db');

const register = (name, accno, pin, password) => {
    return db.User.findOne({
      accno
    })
    .then(user => {
      // console.log(user);
      if(user) {
        return {
          status: false,
          statusCode: 422,
          message: "account already exists"
        }
      }
      const newUser = new db.User({
        name, accno, pin, password, balance:0, transactions:[]
      });
      newUser.save();
      return {
        status: true,
        statusCode: 200,
        message: "account succesfully created."
      }
    });
}
let currentUser;
const login = (req, accno, password) => {
  var accno1 = parseInt(accno);
    return db.User.findOne({
     accno: accno1, password
    })
    .then(user => {
    //  console.log(user)
      if(user) {
        req.session.currentUser = accno1;
        return {
          status: true,
          statusCode: 200,
          message: "logged in sucesfully",
          name: user.name
        }
      }
      return {
        status: false,
        statusCode: 422,
        message: "invalid username or pasword"
      }
    });   
}

const  deposit = (accno, pin, balance)=> { 
  return db.User.findOne({
      accno, pin
    })
    .then(user => {
      if(user) {
        // console.log(user.balance);
        user.balance += parseInt(balance);
        user.transactions.push({
          amount: balance,
          typeOfTransaction: "Credit"
        });
        user.save();
        return {
          status: true,
          statusCode: 200,
          message: "amount credited"
        }
      }
      return {
        status: false,
        statusCode: 422,
        message: "something went wrong"
      }
    });   
  }

  const withdrawal = (accno, pin, balance) => {       
    var amount = parseInt(balance);
    var account_num = parseInt(accno);

    return db.User.findOne({
      accno: account_num, pin
    })
    .then(user => {
      if(user) {
        if(user.balance > amount) {
        user.balance -= amount;
        user.transactions.push({
          amount: balance,
          typeOfTransaction: "Debit"
        });
        user.save();
        return {
          status: true,
          statusCode: 200,
          message: "amount debited"
        }
      }
    
      return {
        status: false,
        statusCode: 422,
        message: "insufficient balance"
      }
    }
    return {
      status: false,
      statusCode: 422,
      message: "invalid credentials"
    }
    
    });   
  }

  const getTransactions = (req) => {
    return db.User.findOne({
      accno:req.session.currentUser
    })
    .then(user => {
      if(user) {
        return  {
          status: true,
          statusCode: 200,
          transactions: user.transactions
        }
      }
      return {
        status: false,
        statusCode: 422,
        transactions: []
      }
    })
  }

  const deleteTransactions = (req, id) => {
    return db.User.findOne({
      accno: req.session.currentUser
    })
    .then(user => {
        user.transactions = user.transactions.filter(t => {
          if(t._id == id) {
            return false;
          }
          return true;
        })
    user.save();
    return {
      status: true,
      statusCode: 200,
      message: "selected transaction deleted sucesfully"
    }
  })
  }

module.exports = {
    register,
    login,
    deposit,
    withdrawal,
    getTransactions,
    deleteTransactions
}