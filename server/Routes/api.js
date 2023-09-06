const express = require('express');
const router = express.Router();
const IzvodjacController = require('../Controllers/IzvodjacController');
const AdresaController = require('../Controllers/AdresaController');
const Izvodjac = require("../Models/Izvodjac");
const Mesto = require("../Models/Mesto");
const Ulica = require("../Models/Ulica");


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

  router.get('/ulice', async (req, res) => {
    try {
      const mesta = await AdresaController.findAllUlicaForPTT(); 
      res.json(mesta);
    } catch (error) {
      console.error('Error fetching street:', error);
      res.status(500).json({ error: 'An error occurred while fetching street.' });
    }
  });


  router.get('/ulice/:ptt', async (req, res) => {
    const { ptt } = req.params;
  
    try {
     
      const streets = await Ulica.findAll({ where: { ptt: ptt } });
  
      if (streets) {
        res.json(streets);
      } else {
        res.status(404).json({ error: 'No streets found for the provided PTT code.' });
      }
    } catch (error) {
      console.error('Error retrieving streets:', error);
      res.status(500).json({ error: 'Unable to retrieve streets.' });
    }
  });
  
module.exports = router;