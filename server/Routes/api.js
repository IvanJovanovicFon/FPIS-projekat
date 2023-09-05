const express = require('express');
const router = express.Router();
const IzvodjacController = require('../Controllers/IzvodjacController');
const Izvodjac = require("../Models/izvodjac");


const app = express();
const port = 3000;


router.get('/izvodjaci', async (req, res) => {
    try {

      const izvodjaci = await IzvodjacController.findAllIzvodjaci(req, res);     
      res.json(izvodjaci);
    } catch (error) {
      console.error('Error retrieving izvodjaci:', error);
      res.status(500).json({ error: 'Unable to retrieve izvodjaci.' });
    }
  });
  
module.exports = router;