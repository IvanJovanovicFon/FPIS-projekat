const { response } = require("express");
const Izvodjac = require("../Models/Izvodjac");


exports.createIzvodjac = async(data) =>{
  try {
    console.log("controler: ", data);
    const newIzvodjac = await Izvodjac.create(data); 
    return newIzvodjac;
  } catch (error) {
    if (error.code === 'ER_DUP_ENTRY') {
     
      return({ error: 'Duplicate' });
     } else {
 
       console.error('Error creating contracotr:', error);
       return({ error: 'Server error' });
     }
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

exports.findIzvodjacById = async (req, res) => {
  try {
    const { id } = req.params;
    const contractor = await Izvodjac.findOne({
      attributes: ['id', 'pib', 'naziv', 'tekuciRacun', 'sifra', 'imeIprezime', 'jmbg', 'mesto', 'ulica', 'broj'],
      where: { id }
    });

    if (contractor) {
      return contractor; 
    } else {
      return { error: 'No contractor found.' }; 
    }
  } catch (error) {
    console.error('Error retrieving contractor:', error);
    throw error; 
  }
};

exports.findIzvodjacByName = async (req, res) => {
  try {
    const { name } = req.params;
    const contractor = await Izvodjac.findOne({
      attributes: ['id', 'pib', 'naziv', 'tekuciRacun', 'sifra', 'imeIprezime', 'jmbg', 'mesto', 'ulica', 'broj'],
      where: { naziv: name }
    });

    if (contractor) {
      return contractor; 
    } else {
      return { error: 'No contractor found.' }; 
    }
  } catch (error) {
    console.error('Error retrieving contractor:', error);
    throw error; 
  }
};

// exports.updateIzvodjac = async(contractorData)=> {
//   try {
//     console.log(contractorData)
//     const izvodjac = await Izvodjac.findByPk(contractorData.id);

//     if (!izvodjac) {
//       throw new Error('Izvodjac not found'); 
//     }

//     izvodjac.set(contractorData);

  
//     await izvodjac.save();

//     return izvodjac; 
//   } catch (error) {
//     throw error; 
//   }
// }

exports.updateIzvodjac = async (contractorData) => {
  try {
    const izvodjac = await Izvodjac.findByPk(contractorData.id);

    if (!izvodjac) {
      throw new Error('Izvodjac not found');
    }

    // Check if 'naziv', 'brojRacuna', or 'PIB' have changed
    if (
      contractorData.naziv !== izvodjac.naziv ||
      contractorData.brojRacuna !== izvodjac.brojRacuna ||
      contractorData.PIB !== izvodjac.PIB
    ) {
      // Check if a record with the same 'naziv', 'brojRacuna', and 'PIB' already exists
      const existingIzvodjac = await Izvodjac.findOne({
        where: {
          [Op.or]: [
            { naziv: contractorData.naziv },
            { brojRacuna: contractorData.brojRacuna },
            { PIB: contractorData.PIB },
          ],
        },
      });

      if (existingIzvodjac) {
        throw new Error('Duplicate entry');
      }
    }

    // Update the 'Izvodjac' record with the new data
    izvodjac.set(contractorData);

    await izvodjac.save();

    return izvodjac;
  } catch (error) {
    throw error;
  }
};


