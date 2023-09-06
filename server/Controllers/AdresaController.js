const { response } = require("express");
const Mesto = require("../Models/Mesto");
const Ulica = require("../Models/Ulica");

exports.findAllUlicaForPTT = async (req, res) => {
    try {
      const mesta = await Mesto.findAll({
        attributes: ['ptt', 'naziv']
      });
  
      if (mesta) {
        return mesta; 
      } else {
        return { error: 'No cities found.' }; 
      }
    } catch (error) {
      console.error('Error retrieving cities:', error);
      throw error; 
    }
  };
  