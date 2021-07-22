const express = require("express");
const axios = require("axios");

const router = express.Router();
const URL = "https://api.yelp.com/v3/businesses/search";
const API_KEY = "grd9edPIdc08b6nHwZNAPEEXk9dqwUITumOk1Pz-2YZDeKt2kd1iCZNIyjKG5-3q6WCFn4iFt9A2VmZ1dpbwr-3kKaAaoSsI84OUhxBmfTlae1rK2SFsH2YiADX2YHYx"

const roundAccurately = (number, decimalPlaces) => {
  return Number(Math.round(number + "e" + decimalPlaces) + "e-" + decimalPlaces);
}

// ROUTES

router.get("/", async (req, res) => {
  const location = req.query.location;
  const pageNumber = parseInt(req.query.pageNumber);
  const total = parseInt(req.query.total);
  let LIMIT =10;
  let start = (total - (((pageNumber + 1) - 1) * LIMIT));

  if (start < 0) {
    const diff = start + LIMIT;
    LIMIT = diff;
    start = 1;
  }

  try {
    const response = await axios({
      method: "GET",
      url: URL,
      params: {
        location: location,
        term: "parking",
        sort_by: "rating",
        limit: LIMIT,
        offset: start
      },
      headers: {
        Authorization: `Bearer ${API_KEY}`,
        "Content-type": "application/json"
      }
    });

    const updatedResults = response.data.businesses.map(business => {
      const score = (business.review_count * business.rating) / (business.review_count + 1);
      const roundedScore = roundAccurately(score, 1);
      const updatedBusiness = { ...business, rating: roundedScore, startIndex: start };
      return updatedBusiness;
    })

    const sortedResults = updatedResults.sort((a, b) => {
      return a.rating - b.rating;
    })

    return res.status(200).json({ businesses: sortedResults })
  } catch (error) {
    console.log(error);
  }
})

router.get("/total", async (req, res) => {
  const { location } = req.query;

  try {
    const response = await axios({
      method: "GET",
      url: URL,
      params: {
        location: location,
        term: "parking",
        sort_by: "rating",
        limit: 5
      },
      headers: { 
        Authorization: `Bearer ${API_KEY}`,
        "Content-type": "application/json"
      }
    });
    return res.status(200).json({ total: response.data.total });
  } catch (error) {
    console.log(error);
  }
  
})

module.exports = router;