const Racun = require("../Models/Racun");
const Posao = require("../Models/Posao");
const sequelize = require('../Config/database')

exports.createRacunWithJobs = async (req) => {
  // console.log("sve ukuono: ",req)
  // console.log("posloviiiiii", req.poslovi)
  let posloviData = req.poslovi
  let racunData = {
    id: req.id,
    idIzvodjac: req.idIzvodjac,
    idPredracun: req.idPredracun,
    brojRacuna: req.brojRacuna,
    objekat: req.objekat,
    realizacija: req.realizacija,
    datumIspostavljanja: req.datumIspostavljanja,
    datumIzdavanja: req.datumIzdavanja,
    datumPrometaDobaraIUsluga: req.datumPrometaDobaraIUsluga,
    ukupnaCena: req.ukupnaCena,
    investitor: req.investitor,
    mesto: req.mesto,
    idUlica: req.idUlica,
    brojUlice: req.brojUlice
  };
  

  const t = await sequelize.transaction();
  try {
    const racun = await Racun.create(racunData, { transaction: t });
console.log("********************11", posloviData)

const poslovi = await Posao.bulkCreate(posloviData, { transaction: t });
await t.commit();
console.log("********************22", poslovi)

    console.log('Racun and Poslovi records created successfully.');
    return { racun, poslovi };
  } catch (error) {

    await t.rollback();
    console.error('Error creating Racun and Poslovi records:', error);
    throw error;
  }

};