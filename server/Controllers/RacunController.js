const Racun = require("../Models/Racun");
const Posao = require("../Models/Posao");
const sequelize = require('../Config/database');
const Izvodjac = require("../Models/Izvodjac");

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

exports.findAllIdAndNumberOfAccounts = async (req, res) => {
  try {
    const accounts = await Racun.findAll({
      attributes: ['id', 'brojRacuna'], 
    });


    if (accounts.length > 0) {
      const formattedAccounts = accounts.map(account => ({
        id: account.id,
        brojRacuna: account.brojRacuna,
      }));
      
      return formattedAccounts;
    }
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    return ({ error: 'Internal server error' });
  }
};


exports.findAllIdAndNumberOfAccounts = async (req, res) => {
  try {
    const accounts = await Racun.findAll({
      attributes: ['id', 'brojRacuna'], 
    });


    if (accounts.length > 0) {
      const formattedAccounts = accounts.map(account => ({
        id: account.id,
        brojRacuna: account.brojRacuna,
      }));
      
      return formattedAccounts;
    }
  } catch (error) {
    console.error('Error retrieving accounts:', error);
    return ({ error: 'Internal server error' });
  }
};


exports.findRacunById = async (req, res) => {
  const { id } = req.params;
console.log("connnsoel: ",id)
  try {
    const account = await Racun.findOne({
      where: { id }
    });

    if (!account) {
      return ({ error: 'Account not found.' });
    }
    const posao = await Posao.findAll({
      where: { idRacun: id }, 
    });

    const result = {
      account: {
        id: account.id,
        idIzvodjac: account.idIzvodjac,
        idPredracun: account.idPredracun,
        brojRacuna: account.brojRacuna,
        objekat: account.objekat,
        realizacija: account.realizacija,
        datumIspostavljanja: account.datumIspostavljanja,
        datumIzdavanja: account.datumIzdavanja,
        datumPrometaDobaraIUsluga: account.datumPrometaDobaraIUsluga,
        ukupnaCena: account.ukupnaCena,
        investitor: account.investitor,
        mesto: account.mesto,
        idUlica: account.idUlica,
        brojUlice: account.brojUlice,
        poslovi: posao
      }
      
    };
console.log(result)
    return (result);
  } catch (error) {
    console.error('Error retrieving account and posao:', error);
    return ({ error: 'Internal server error' });
  }
};