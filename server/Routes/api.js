const express = require('express');
const router = express.Router();
const IzvodjacController = require('../Controllers/IzvodjacController');
const Izvodjac = require('../Models/izvodjac');

const app = express();
const port = 3000;


//router.post('/api/izvodjac', UserController.createUser);
//app.post('/', (req, res)=>res.send('Ajmoo'));
// router.get('/users/:id', UserController.getUser);
// router.put('/users/:id', UserController.updateUser);
// router.delete('/users/:id', UserController.deleteUser);

router.post('/api/izvodjac', async (req, res) => {
    try {
      const newContractor = await Izvodjac.create(req.body);
      res.status(201).json(newContractor);
    } catch (error) {
      console.error('Error creating Contractor:', error);
      res.status(500).json({ error: 'Unable to create Contractor.' });
    }
  });

module.exports = router;