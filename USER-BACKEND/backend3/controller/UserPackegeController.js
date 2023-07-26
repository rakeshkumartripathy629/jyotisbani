const conn = require('../database/config');
const express = require('express');
//app.use(express.json());
const app = express();



const moment = require("moment");

module.exports = {
  // .......................................................package creation using user id...................................................//

  createUserPackage: (req, res) => {
    const { user_id, package_id, package_type } = req.body;
    const package_status = "active";
    const current_date = new Date();
  
    let package_price, package_validity;
    // this function "priceAndExpiration" is used to set the package_validity
    function priceAndExpiration(days) {
      const today = moment();
      const expirationDate = today.add(days, "days");
      const expirationDateString = expirationDate.format("YYYY-MM-DD");
      return expirationDateString;
    }
  
    if (package_type === "silver") {
      package_price = 1000;
      package_validity = priceAndExpiration(30);
    } else if (package_type === "gold") {
      package_price = 3000;
      package_validity = priceAndExpiration(60);
    } else if (package_type === "platinum") {
      package_price = 6000;
      package_validity = priceAndExpiration(90);
    }
    
    const getUser = "SELECT * FROM user_packege WHERE user_id = ?";
    conn.query(getUser, [user_id], (error, result) => {
      if (error) console.error(error);
      if (!result || result.length === 0) {
        const createPackage =
          "INSERT INTO user_packege (package_id, user_id, package_type, package_price, package_validity, date, package_status) VALUES (?, ?, ?, ?, ?, ?, ?)";
        conn.query(
          createPackage,
          [
            package_id,
            user_id,
            package_type,
            package_price,
            package_validity,
            current_date,
            package_status,
          ],
          (error, result) => {
            if (error) console.error(error);
            res.json({ message: "Package created" });
          }
        );
      } else {
        res.status(400).json({
          message: `You already have a package: ${result[0].package_type}`,
        });
      }
    });
  },
  
  //................................................. get package of user by user id..................................................//

  getUserPackage: (req, res) => {
    const user_id = req.params.user_id;
    let sql = "SELECT * FROM user_packege WHERE user_id = ?";
    const current_date = new Date();
  
    conn.query(sql, [user_id], (error, result) => {
      if (error) console.error(error);
  
      function isActive() {
        if (result && result.length > 0) {
          const package_validity = new Date(result[0].package_validity);
          if (
            (current_date.getFullYear() < package_validity.getFullYear()) ||
            (current_date.getFullYear() === package_validity.getFullYear() &&
              current_date.getMonth() < package_validity.getMonth()) ||
            (current_date.getFullYear() === package_validity.getFullYear() &&
              current_date.getMonth() === package_validity.getMonth() &&
              current_date.getDate() < package_validity.getDate())
          ) {
            return true;
          }
        }
        return false;
      }
      
      if (!result || result.length === 0) {
        res.json({ message: "Get a package first" });
      } else if (isActive()) {
        res.status(200).json({ package_details: result[0] });
      } else {
        const package_status = "not active";
        const updateSql = "UPDATE user_packege SET package_status = ? WHERE user_id = ?";
        conn.query(updateSql, [package_status, user_id], (error, result) => {
          if (error) console.log(error);
          res
            .status(400)
            .json({ result: "Renew package. Your package has expired" });
        });
      }
    });
  },
  //--------------------------------------------------------update package---------------------------------------------------------//
  updatePackage: (req, res) => {
    const { user_id, package_id, package_type } = req.body;
    const current_date = new Date();

    let package_price, package_validity;

    // Function to calculate the package validity
    function priceAndExpiration(days) {
      const today = moment();
      const expirationDate = today.add(days, "days");
      const expirationDateString = expirationDate.format("YYYY-MM-DD");
      return expirationDateString;
    }

    if (package_type === "silver") {
      package_price = 1000;
      package_validity = priceAndExpiration(30);
    } else if (package_type === "gold") {
      package_price = 3000;
      package_validity = priceAndExpiration(60);
    } else if (package_type === "platinum") {
      package_price = 6000;
      package_validity = priceAndExpiration(90);
    }

    const updatePackageQuery = `
      UPDATE user_packege
      SET package_id = ?,
          package_type = ?,
          package_price = ?,
          package_validity = ?,
          date = ?
      WHERE user_id = ?`;

    conn.query(
      updatePackageQuery,
      [package_id, package_type, package_price, package_validity, current_date, user_id],
      (error, result) => {
        if (error) console.error(error);
        if (result.affectedRows > 0) {
          res.json({ message: "Package updated" });
        } else {
          res.status(400).json({ message: "Failed to update package" });
        }
      }
    );
  },

  // ...
};

  
