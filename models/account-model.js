const pool = require("../database")
const bcrypt = require("bcryptjs");

/* *****************************
*   Register new account
* *************************** */
async function registerAccount(account_firstname, account_lastname, account_email, account_password){
    try {
      const sql = "INSERT INTO account (account_firstname, account_lastname, account_email, account_password, account_type) VALUES ($1, $2, $3, $4, 'Client') RETURNING *"
      return await pool.query(sql, [account_firstname, account_lastname, account_email, account_password])
    } catch (error) {
      return error.message
    }
}

/* *****************************
*   Login into existing account
* *************************** */
// async function loginAccount(account_email, account_password) {
//   try {
//     const sql = "SELECT * FROM account WHERE account_email = $1"
//     const result = await pool.query(sql, [account_email])

//     // Check if there are results
//     if (result.rows.length > 0) {
//       // Get the hashed password from the database
//       const storedPassword = result.rows[0].account_password
      
//       // Compare the stored password with the given password
//       const isPasswordMatch = await bcrypt.compare(account_password, storedPassword)

//       if (isPasswordMatch) {
//         // succesfull authentication, return account details
//         return result.rows[0]
//       }
//     }

//     // fail authentication
//     return null
//   } catch (error) {
//     return error.message
//   }
// }

async function checkExistingEmail(account_email){
  try {
    const sql = "SELECT * FROM account WHERE account_email = $1"
    const email = await pool.query(sql, [account_email])
    return email.rowCount
  } catch (error) {
    return error.message
  }
}

/* *****************************
* Return account data using email address
* ***************************** */
async function getAccountByEmail (account_email) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_email = $1',
      [account_email])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching email found")
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail }