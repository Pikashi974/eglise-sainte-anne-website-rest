const Horaires = require("./Horaires.cjs");
const globals = require("../js/globals.cjs");


testHoraire = new Horaires(globals.URI, globals.DB_NAME);

test(`Récupération des horaires`, () => {
    expect(testHoraire.getHoraire).toBeUndefined();
})