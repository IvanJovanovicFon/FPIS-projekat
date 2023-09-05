const { response } = require("express");
const Izvodjac = require("../Models/izvodjac");


exports.createIzvodjac = async (req, res) => {
  try {
    const izvodjac = await Izvodjac.create(req.body);
    res.json(izvodjac);
  } catch (error) {
    res.status(500).json({ error: 'Unable to create izvodjac.' });
  }
};

exports.getIzvodjac = async (req, res) => {
  // Implement logic to retrieve a user by ID or other criteria
};

exports.updateIzvodjac = async (req, res) => {
  // Implement logic to update a user
};


exports.findAllIzvodjaci = async (req, res) => {
  try {
    const contractors = await Izvodjac.findAll({
      attributes: ['id', 'PIB', 'naziv', 'tekuciRacun', 'sifra', 'imeIprezime', 'jmbg', 'mesto', 'ulica', 'broj'],
    });

    if (contractors) {
      return contractors; 
    } else {
      return { error: 'No contractors found.' }; 
    }
  } catch (error) {
    console.error('Error retrieving izvodjaci:', error);
    throw error; 
  }
};

