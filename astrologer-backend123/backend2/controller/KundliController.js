const conn = require("../database/config");
const axios = require("axios");
require("dotenv").config()
const createKundliBoysGirls = async (req, res) => {
  const {
    boy_name,
    boys_id,
    boy_gender,
    boy_date_of_birth,
    boy_time_of_birth,
    boy_place,
  } = req.body;
  const {
    girl_name,
    girls_id,
    girl_gender,
    girl_date_of_birth,
    girl_time_of_birth,
    girl_place,
  } = req.body;
  if (
    !boy_name ||
    !boys_id ||
    !boy_gender ||
    !boy_date_of_birth ||
    !boy_time_of_birth ||
    !boy_place ||
    !girl_name ||
    !girls_id ||
    !girl_gender ||
    !girl_date_of_birth ||
    !girl_time_of_birth ||
    !girl_place
  ) {
    return res.status(400).json({ error: "All fields are required3" });
  }
  const girlDOB = new Date(girl_date_of_birth); // Replace with the actual girl's date of birth
  const boyDOB = new Date(boy_date_of_birth); // Replace with the actual boy's date of birth

  const formattedGirlDOB = girlDOB.toISOString();
  const formattedBoyDOB = boyDOB.toISOString();

  // const axios = require("axios");

  // const geocodeAddress = async (address) => {
  //   const apiKey = "YOUR_API_KEY"; // Replace with your OpenCage Geocoding API key
  //   const apiUrl = `https://api.opencagedata.com/geocode/v1/json?q=${encodeURIComponent(address)}&key=${apiKey}`;

  //   try {
  //     const response = await axios.get(apiUrl);
  //     const { results } = response.data;

  //     if (results.length > 0) {
  //       const { lat, lng } = results[0].geometry;
  //       console.log(`Coordinates for ${address}: ${lat}, ${lng}`);m
  //       return { lat, lng };
  //     } else {
  //       console.log("No results found for the address");
  //       return null;
  //     }
  //   } catch (error) {
  //     console.error("Error geocoding address:", error.message);
  //     return null;
  //   }
  // };

  // const boy_geo_loc = geocodeAddress(boy_place);
  // const girl_geo_loc = geocodeAddress(girl_place);
  

  const boy_query =
    "INSERT INTO boys_kundli ( boys_id,name, gender, date_of_birth, time_of_birth, place) VALUES (?, ?, ?, ?, ?, ?)";
  const girl_query =
    "INSERT INTO girls_kundali ( girls_id,name, gender, date_of_birth, time_of_birth, place) VALUES (?, ?, ?, ?, ?, ?)";

  const boy_values = [
    boys_id,
    boy_name,
    
    boy_gender,
    boy_date_of_birth,
    boy_time_of_birth,
    boy_place,
  ];
  const girl_values = [
    girls_id,
    girl_name,
    
    girl_gender,
    girl_date_of_birth,
    girl_time_of_birth,
    girl_place,
  ];

  let boy_promise = new Promise((resolve, reject) => {
    conn.query(boy_query, boy_values, (error, results) => {
      if (error) {
        console.error("Error creating Kundli:", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  let girl_promise = new Promise((resolve, reject) => {
    conn.query(girl_query, girl_values, (error, results) => {
      if (error) {
        console.error("Error creating Kundli: ", error);
        reject(error);
      } else {
        resolve(results);
      }
    });
  });

  Promise.all([boy_promise, girl_promise])
    .then(async (result) => {
      const head = await axios
        .post(`https://api.prokerala.com/token`, {
          grant_type: "client_credentials",
          client_id: process.env.PROKERALA_CLIENT_ID,
          client_secret: process.env.PROKERALA_CLIENT_SECRET,
        })
        .then((res) => {
          return res.data;
        });

      const headerr = `${head.token_type} ${head.access_token}`;

      const config = {
        headers: {
          Authorization: headerr,
          "Content-Type": "application/json",
        },
      };
      let ayanamsa = 1;

      const data = await axios
        .get(
          `https://api.prokerala.com/v2/astrology/kundli-matching?ayanamsa=${ayanamsa}&girl_coordinates=${girl_place}&girl_dob=${formattedGirlDOB}&boy_coordinates=${boy_place}&boy_dob=${formattedBoyDOB}`,
          config
        )
        .then((res) => {
          // console.log(res.data.data.message);
          return res.data;
        });
      // res.send(data.data);
      const insertMatchingScore =
        "insert into kundali_match (boy_id,girl_id,match_score) values (?,?,?)";
      conn.query(
        insertMatchingScore,
        [boys_id, girls_id, data.data.guna_milan.total_points],
        (error, result) => {
          if (error) {
            console.error(error);
            res
              .status(500)
              .json({ message: "failed to insert matching score " });
          } else return res.status(200).json({ score: data.data.guna_milan, message:data.data.message,data:data.data });
        }
      );
    })
    .catch((error) => {
      console.log(error);
      return res
        .status(500)
        .json({ error: "An error occurred while getting kundli details " });
    });
};

module.exports = {
  createKundliBoysGirls,
};