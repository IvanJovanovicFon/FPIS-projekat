const express = require('express');
const router = express.Router();
const IzvodjacController = require('../Controllers/IzvodjacController');
const RacunController = require('../Controllers/RacunController');
const Mesto = require("../Models/Mesto");
const Ulica = require("../Models/Ulica");
const Broj = require("../Models/Broj");
const Predracun = require("../Models/Predracun");
const VrstaPosla = require('../Models/VrstaPosla');
const PodvrstaPosla = require('../Models/PodvrstaPosla');
const JedinicaMere = require('../Models/JedinicaMere');
const Izvodjac = require('../Models/Izvodjac');
const mongoose = require("mongoose");
const app = express();
const User = require("../Models/User");
const jwt = require('jsonwebtoken');


app.use(express.json());

router.post("/login",
    async (req, res, next) => {
        let { email, password } = req.body;
 
        let existingUser;
        try {
            existingUser =
                await User.findOne({ email: email });
        } catch {
            const error =
                new Error(
                    "Error! Something went wrong."
                );
            return next(error);
        }
        if (!existingUser
            || existingUser.password
            != password) {
            const error =
                Error(
                    "Wrong details please check at once"
                );
            return next(error);
        }
        let token;
        try {
            //Creating jwt token
            token = jwt.sign(
                {
                    userId: existingUser.id,
                    role: existingUser.role,
                    firstname: existingUser.firstname
                },
                "secretkeyappearshere",
                { expiresIn: "1h" }
            );
        } catch (err) {
            console.log(err);
            const error =
                new Error("Error! Something went wrong.");
            return next(error);
        }
 
        res
            .status(200)
            .json({
                success: true,
                data: {
                    userId: existingUser.id,
                    email: existingUser.email,
                    role: existingUser.role,
                    token: token,
                },
            });
            console.log(existingUser.role)
    });


router.post("/register", async (req, res, next) => {
  const { firstname, lastname, email, password, birthdate } = req.body;
const newUser = new User({
  firstname,
  lastname,
  email,
  password,
  birthdate,
});

try {
  await newUser.save();
} catch (error) {
  console.error(error);
  const errorMessage = "Error! Something went wrong.";
  return res.status(500).json({ success: false, error: errorMessage });
}

res.status(201).json({
  success: true,
  data: {
    userId: newUser.id,
    email: newUser.email,
  },
});
});


const port = 3000;

    router.post('/izvodjaci', async (req, res) => {
      try {
        const newIzvodjac = await IzvodjacController.createIzvodjac(req.body);
        if (newIzvodjac.error === "ServerError") {
          res.status(500).json({ error: 'Unable to create contractor.' });
        }
        else if(newIzvodjac.error === "uniqueConstraintError"){
          return res.status(400).json({ error: "PIB, broj računa i naziv moraju biti jedinstveni!" });
        }
        else {
          return res.status(201);
        }
      } catch (error) {
        console.error('Error creating Izvodjac:', error);
        res.status(500).json({ error: 'Unable to create contractor.' });
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

    router.get('/izvodjaci/:id', async (req, res) => {
      try {
        const izvodjac = await IzvodjacController.findIzvodjacById(req, res);     
        res.json(izvodjac);
      } catch (error) {
        console.error('Error retrieving izvodjac:', error);
        res.status(500).json({ error: 'Unable to retrieve izvodjac.' });
      }
    });

    router.get('/izvodjac/:name', async (req, res) => {
      try {
        const izvodjac = await IzvodjacController.findIzvodjacByName(req, res);     
        res.json(izvodjac);
      } catch (error) {
        console.error('Error retrieving izvodjac:', error);
        res.status(500).json({ error: 'Unable to retrieve izvodjac.' });
      }
    });

    router.put('/izvodjaci/:id', async (req, res) => {
      try {
        const updatedIzvodjac = await IzvodjacController.updateIzvodjac(req.body);
        if (updatedIzvodjac.error === "ServerError") {
          res.status(500).json({ error: 'Unable to create contractor.' });
        }
        else if(updatedIzvodjac.error === "uniqueConstraintError"){
          return res.status(400).json({ error: "PIB, broj računa i naziv moraju biti jedinstveni!" });
        }
        else {
          return res.status(201);
        }
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

    router.post('/racun', async (req, res) => {
      try {
        const newRacun = await RacunController.createRacunWithJobs(req.body);
        if (newRacun.error === "ServerError") {
          res.status(500).json({ error: 'Unable to create account.'});
        }
        else if(newRacun.error === "uniqueConstraintError"){
          return res.status(400).json({ error: "Ovaj broj računa već postoji!" });
        }
        else {
          return res.status(201);
        }
      } catch (error) {
        console.error('Error creating account:', error);
        return res.status(500).json({ error: 'Unable to create account.' });
      }
    });
    
    router.get('/racunBack', async (req, res) => {
      try {
        const racun = await RacunController.findAllIdAndNumberOfAccounts(req, res);     
        res.json(racun);
      } catch (error) {
        console.error('Error retrieving accounts:', error);
        res.status(500).json({ error: 'Unable to retrieve accounts.' });
      }
    });

    router.get('/racun/:id', async (req, res) => {
      try {
        const racun = await RacunController.findRacunById(req, res);     
        res.json(racun);
      } catch (error) {
        console.error('Error retrieving accounts:', error);
        res.status(500).json({ error: 'Unable to retrieve accounts.' });
      }
    });

    router.put('/racun/:id', async (req, res) => {
      try {
        const updatedRacun = await RacunController.updateRacun(req.body);
        if (updatedRacun.error === "ServerError") {
          res.status(500).json({ error: 'Unable to update account.' });
        }
        else if(updatedRacun.error === "uniqueConstraintError"){
          return res.status(400).json({ error: "Ovaj broj računa već postoji!" });
        }
        else {
          return res.status(201);
        }
      } catch (error) {
        console.error('Error updating account:', error);
        res.status(500).json({ error: 'Unable to update account.' });
      }
    });

  
  
module.exports = router;