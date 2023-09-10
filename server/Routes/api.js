const express = require('express');
const router = express.Router();
const IzvodjacController = require('../Controllers/IzvodjacController');
const Mesto = require("../Models/Mesto");
const Ulica = require("../Models/Ulica");
const Broj = require("../Models/Broj");
const Predracun = require("../Models/Predracun");
const VrstaPosla = require('../Models/VrstaPosla');
const PodvrstaPosla = require('../Models/PodvrstaPosla');
const JedinicaMere = require('../Models/JedinicaMere');
const app = express();
app.use(express.json());


const port = 3000;

router.post('/izvodjaci', async (req, res) => {
    try {
      console.log("ovo je requestt:  ",req.body)
      const newIzvodjac = await IzvodjacController.createIzvodjac(req.body);
      res.status(201).json(newIzvodjac);
    } catch (error) {
      console.error('Error creating Izvodjac:', error);
      res.status(500).json({ error: 'Unable to create Izvodjac.' });
    }
  });

  router.get('/izvodjaci', async (req, res) => {
      try {
        const izvodjaci = await IzvodjacController.findAllIzvodjaci(req, res);     
        res.json(izvodjaci);
      } catch (error) {
        console.error('Error retrieving izvodjaci:', error);
        res.status(500).json({ error: 'Unable to retrieve izvodjaci.' });
      }
    });

    router.put('/izvodjaci/:id', async (req, res) => {
      try {
        const updatedIzvodjac = await IzvodjacController.updateIzvodjac(req.body);

        res.json(updatedIzvodjac);
      } catch (error) {
        console.error('Error updating Izvodjac:', error);
        res.status(500).json({ error: 'Unable to update Izvodjac.' });
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

  router.get('/ulice/:ptt', async (req, res) => {
    const ptt = req.params.ptt; // Use req.params.ptt to access the value
    try {
      const ulice = await Ulica.findAll({ where: { ptt: ptt } });
      res.json(ulice);
    } catch (error) {
      console.error('Error fetching street:', error);
      res.status(500).json({ error: 'An error occurred while fetching street.' });
    }
  });


  router.get('/brojevi/:ptt/:id', async (req, res) => {
    const { ptt, id } = req.params;
    const idAsInt = parseInt(id, 10);
  
    try {
      const numbers = await Broj.findAll({ where: { ptt: ptt, idUlice: idAsInt } });
  
      if (numbers) {
        res.json(numbers);
      } else {
        res.status(404).json({ error: 'No number found for the provided PTT code and ID.' });
      }
    } catch (error) {
      console.error('Error retrieving nuumbers:', error);
      res.status(500).json({ error: 'Unable to retrieve numbers.' });
    }
  });

  router.get('/predracuni', async (req, res) => {
    try {
      const predracuni = await Predracun.findAll(); 
      res.json(predracuni);
    } catch (error) {
      console.error('Error fetching accountings:', error);
      res.status(500).json({ error: 'An error occurred while fetching accountings.' });
    }
  });

  router.get('/vrsta', async (req, res) => {
    try {
      const vrste = await VrstaPosla.findAll(); 
      res.json(vrste);
    } catch (error) {
      console.error('Error fetching types:', error);
      res.status(500).json({ error: 'An error occurred while fetching types.' });
    }
  });

  router.get('/podvrsta/:id', async (req, res) => {
    try {
      const idVrste = req.params.id;
      const podvrste = await PodvrstaPosla.findAll({ where: { idVrstaPosla: idVrste } }); 
      res.json(podvrste);
    } catch (error) {
      console.error('Error fetching types:', error);
      res.status(500).json({ error: 'An error occurred while fetching types.' });
    }
  });

  router.get('/mere', async (req, res) => {
    try {
      const mere = await JedinicaMere.findAll(); 
      res.json(mere);
    } catch (error) {
      console.error('Error fetching types:', error);
      res.status(500).json({ error: 'An error occurred while fetching types.' });
    }
  });
  
  
module.exports = router;