const { response } = require("express");
const Izvodjac = require("../Models/Izvodjac");


exports.createIzvodjac = async(data) =>{
  try {
    console.log("controler: ", data);
    const newIzvodjac = await Izvodjac.create(data); 
    return newIzvodjac;
  } catch (error) {
    throw error;
  }
}

exports.findAllIzvodjaci = async (req, res) => {
  try {
    const contractors = await Izvodjac.findAll({
      attributes: ['id', 'pib', 'naziv', 'tekuciRacun', 'sifra', 'imeIprezime', 'jmbg', 'mesto', 'ulica', 'broj'],
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

