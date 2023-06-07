const Horaires = require("./Horaires.cjs");
const globals = require("../js/globals.cjs");


testHoraire = new Horaires(globals.URI,"")

test(`Erreur d'horaire`, () => {
    expect(testHoraire.getHoraire()).toThrow(Error);
})