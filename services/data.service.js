

let accountDetails = {
    1001: { name: "user1", accno: 1001, pin: 1234, password: "userone", balance: 3000, transactions: [] },
    1002: { name: "user2", accno: 1002, pin: 1244, password: "usertwo", balance: 2900, transactions: [] },
    1003: { name: "user3", accno: 1003, pin: 1254, password: "userthr", balance: 3000, transactions: [] },
    1004: { name: "user3", accno: 1004, pin: 1255, password: "userfour", balance: 5000, transactions: [] },
    1005: { name: "user3", accno: 1005, pin: 1257, password: "userfive", balance: 3100, transactions: [] },

}

const register = (name, accno, pin, password) => {
    if (accno in accountDetails) {
        return {
            status: false,
            statusCode: 422,
            message: 'account already existed. Please login.'
        }

    }
    accountDetails[accno] = {
        name, accno, pin, password, balance: 0, transactions: []
    }
    //this.saveDetails();
    return {
        status: true,
        statusCode: 200,
        message: 'account created.Please login.'
    }
}
let currentUser;
const login = (req, accno, password) => {
    // if(! req.session.currentUser){
    //     return {
    //         status: false,
    //         statusCode: 401,
    //         message: "please login"
    //     }
    // }
    var accnum = parseInt(accno);
    // var data = accountDetails;
    if (accnum in accountDetails) {
        var pwd = accountDetails[accnum].password;
        if (password == pwd) {
            req.session.currentUser = accountDetails[accnum];
            // this.saveDetails();
            return {
                status: true,
                statusCode: 200,
                message: "logged succesfully."
            }
        }
        return {
            status: false,
            statusCode: 422,
            message: "incorrect password"
        }
    }

    return {
        status: false,
        statusCode: 422,
        message: "invalid account number."

    }
}

const  deposit = (accno, pin, balance)=> {    
  
    var amount = parseInt(balance);
    var account_num = parseInt(accno);
    if (account_num in accountDetails) {
      var user_pin = accountDetails[account_num].pin;
      if (user_pin == pin) {
        accountDetails[account_num].balance += amount;
        // msg = "Amount of Rs." + amount + " is credited to your account. Available balance is " + accountDetails[account_num].balance + ".";
        // alert(data[account_num].balance);

        accountDetails[account_num].transactions.push({
          tamount: amount,
          type: "deposit"
        })
       // this.saveDetails();
        return {
            status: true,
            statusCode: 200,
            message: "amount deposited"
        }
      }
      
       return{
           status: false,
           statusCode: 422,
           message: "incorrect pin"
       }
    }   
        return{
            status: false,
            statusCode: 422,
            message: "invalid credentials."
        }   

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
            type: "withdrawal"
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

module.exports = {
    register,
    login,
    deposit,
    withdrawal,
    getTransactions
}