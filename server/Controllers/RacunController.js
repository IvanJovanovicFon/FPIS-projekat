const Racun = require("../Models/Racun");
const Posao = require("../Models/Posao");
const sequelize = require('../Config/database');
const Izvodjac = require("../Models/Izvodjac");

exports.createRacunWithJobs = async (req) => {
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
 

const poslovi = await Posao.bulkCreate(posloviData, { transaction: t });
await t.commit();
    console.log('Racun and Poslovi records created successfully.');
    return { racun, poslovi };
  }catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return({ error: 'uniqueConstraintError' });
     } else {
       return({ error: 'ServerError' });
     }

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

exports.updateRacun = async (account) => {
  let posloviData = account.poslovi;
  let racunData = {
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
    brojUlice: account.brojUlice
  };

  const t = await sequelize.transaction();
  try {

    const [updatedRacun] = await Racun.update(racunData, {
      where: { id: account.id },
      returning: true, 
      transaction: t,
    });

    console.log(updatedRacun)

    const existingJobs = await Posao.findAll({
      where: { idRacun: account.id },
      transaction: t,
    });

    const existingJobIds = existingJobs.map((job) => job.id);
    const newJobIds = posloviData.map((job) => job.id);

    const jobsToUpdate = existingJobs.filter((job) => newJobIds.includes(job.id));
    const jobsToInsert = posloviData.filter((job) => !existingJobIds.includes(job.id));
    const jobsToDelete = existingJobs.filter((job) => !newJobIds.includes(job.id));

    for (const job of jobsToUpdate) {
      const updatedJobData = posloviData.find((newJob) => newJob.id === job.id);
      await job.update(updatedJobData, { transaction: t });
    }

    await Posao.bulkCreate(jobsToInsert, { transaction: t });
  
    for (const job of jobsToDelete) {
      await job.destroy({ transaction: t });
    }

    await t.commit();

    console.log('Racun and Poslovi records updated successfully.');

    return { racun: account, poslovi: posloviData };
  } catch (error) {
    await t.rollback();
    if (error.name === 'SequelizeUniqueConstraintError') {
      return({ error: 'uniqueConstraintError' });
     } else {
       return({ error: 'ServerError' });
     }
  }
};

