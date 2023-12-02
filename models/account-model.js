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

/* *****************************
* Return account data using id
* ***************************** */
async function getAccountById (account_id) {
  try {
    const result = await pool.query(
      'SELECT account_id, account_firstname, account_lastname, account_email, account_type, account_password FROM account WHERE account_id = $1',
      [account_id])
    return result.rows[0]
  } catch (error) {
    return new Error("No matching account id found")
  }
}

/* ***************************
 *  Update Account Information
 * ************************** */
async function updateAccountData(
  account_id,
  account_firstname,
  account_lastname,
  account_email
  ) {
  try {
    const sql = "UPDATE public.account SET account_firstname = $1, account_lastname = $2, account_email = $3 WHERE account_id = $4 RETURNING *";
    const data = await pool.query(sql, [
      account_firstname,
      account_lastname,
      account_email,
      account_id
    ]);
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Change Account Password
 * ************************** */
async function changeAccountPassword(
  account_id,
  account_password
  ) {
  try {
    const sql = "UPDATE public.account SET account_password = $1 WHERE account_id = $2 RETURNING *";
    const data = await pool.query(sql, [
      account_password,
      account_id
    ]);
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

module.exports = { registerAccount, checkExistingEmail, getAccountByEmail, getAccountById, updateAccountData, changeAccountPassword }