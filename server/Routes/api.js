const express = require('express');
const router = express.Router();
const IzvodjacController = require('../Controllers/IzvodjacController');
const Izvodjac = require("../Models/Izvodjac");
const Mesto = require("../Models/Mesto");


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

  router.get('/mesta', async (req, res) => {
    try {
      const mesta = await Mesto.findAll(); 
      res.json(mesta);
    } catch (error) {
      console.error('Error fetching cities:', error);
      res.status(500).json({ error: 'An error occurred while fetching cities.' });
    }
  });
  
module.exports = router;