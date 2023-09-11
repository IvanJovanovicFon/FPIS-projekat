const { response } = require("express");
const Racun = require("../Models/");


exports.createRacun = async(data) =>{
  try {
    console.log("account: ", data);
    const newIzvodjac = await Izvodjac.create(data); 
    return newIzvodjac;
  } catch (error) {
    throw error;
  }
}