
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
      console.log(user)
      if(user) {
        return {
          status: true,
          statusCode: 200,
          message: "logged in sucesfully"
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
    var amount = parseInt(balance);
    var account_num = parseInt(accno);
    return db.User.findOne({
      accno: account_num, pin, balance: amount
    })
    .then(user => {
      if(user) {
        console.log(user.balance);
        user.balance += amount;
        
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
    if (account_num in accountDetails) {
      var user_pin = accountDetails[account_num].pin;
      if (user_pin == pin) {
        if (amount < accountDetails[account_num].balance) {
          accountDetails[account_num].balance -= amount;
          accountDetails[account_num].transactions.push({
            tamount: amount,
            type: "withdrawal",
            id: Math.floor(Math.random()*1000)
          })
        //   this.saveDetails();
          return {
            status: true,
            statusCode: 200,
            message: "amount debited",
            bal: accountDetails[account_num].balance
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
        message: "incorrect pin"

     }
    }    
     return {
        status: false,
        statusCode: 422,
        message: "Invalid account number"
      }
  }

  const getTransactions = (req) => {
    //   console.log(accountDetails[accno]);
    return accountDetails[req.session.currentUser.accno].transactions;
 
 
  }

  const deleteTransactions = (req, id) => {
    let transactions = accountDetails[req.session.currentUser.accno].transactions;
    transactions = transactions.filter(t => {
      if(t.id == id){
        return false;
      }
      return true;
    });
    
    accountDetails[req.session.currentUser.accno].transactions = transactions;
    console.log(transactions);
    return {
      status: true,
      statusCode: 200,
      message: "selected transaction deleted sucesfully"
    }
  }

module.exports = {
    register,
    login,
    deposit,
    withdrawal,
    getTransactions,
    deleteTransactions
}