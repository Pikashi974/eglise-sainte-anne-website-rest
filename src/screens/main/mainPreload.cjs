const { contextBridge, ipcRenderer } = require("electron");
const xml2json  = require('xml-js');

const globals = require("../../js/globals.cjs");
const Horaires = require("../../models/Horaires.cjs");
const Annonces  = require("../../models/Annonces.cjs");

const horairedata = new Horaires(globals.URI, globals.DB_NAME, globals.api_key);
const annoncedata = new Annonces(globals.URI, globals.DB_NAME, globals.api_key);

let gotHoraireCallback;
let gotHoraireUpdatedCallback;
let gotDeletedResultCallback;
let gotAnnonceCallback;
let gotAnnonceUpdatedCallback;

let getHoraires = () => {
  console.log(`mainPreload > getHoraires`);

  horairedata.getHoraires().then((res) => {
    gotHoraireCallback(res);
  });
};

let gotHoraires = (callback) => {
  gotHoraireCallback = callback;
};

let saveHoraire = (horaire) => {
  console.log(
    `mainPreload > Jour: ${horaire.jour}, Valeurs: ${horaire.value}`
  );
  return horairedata.addHoraire(horaire);
};

let deleteHoraires = (id) => {
  console.log(`mainPreload > Delete : ${id}`);

  horairedata.deleteHoraire(id).then((res) => {
    gotDeletedResultCallback(res);
  });
};

let gotDeletedResult = (callback) => {
  gotDeletedResultCallback = callback;
};

let updateHoraire = (id, emp) => {
  console.log(`mainPreload > upDateHoraire : ${id}`);

  const horaire = {
    jour: emp.jour,
    value: emp.value,
  };

  horairedata.updateHoraire(id, horaire).then((res) => {
    gotHoraireUpdatedCallback(res);
  });
};

let gotHoraireUpdatedResult = (callback) => {
  gotHoraireUpdatedCallback = callback;
};
let getAnnonces = () => {
  console.log(`mainPreload > getAnnonces`);

  annoncedata.getAnnonces().then((res) => {
    gotAnnonceCallback(res);
  });
};

let gotAnnonces = (callback) => {
  gotAnnonceCallback = callback;
};

let saveAnnonce = (annonce) => {
  console.log(
    `mainPreload > Annonces: ${annonce.annonces}`
  );
  return annoncedata.addAnnonce(annonce);
};

let deleteAnnonces = (id) => {
  console.log(`mainPreload > Delete : ${id}`);

  annoncedata.deleteAnnonce(id).then((res) => {
    location.reload();
  });
};

let updateAnnonce = (id, emp) => {
  console.log(`mainPreload > upDateAnnonce : ${id}`);

  const annonce = {
    annonces: emp
  };

  annoncedata.updateAnnonce(id, annonce).then((res) => {
    location.reload();
  });
};

let gotAnnonceUpdatedResult = (callback) => {
  gotAnnonceUpdatedCallback = callback;
};

/**
 * 
 * @apiName moveNavbar
 * 
 * @description Move both the navbar, the sidebar and the footer on click
 * 
 * 
 */
function moveNavbar() {
  const sidenav = document.querySelector("#layoutSidenav_nav");
  const navbar = document.querySelector("#navbar  ");
  if (window.getComputedStyle(sidenav).transform == 'matrix(1, 0, 0, 1, 0, 0)') {
    navbar.style.transform = "translateX(0)"
    navbar.style.right = "0"
    sidenav.style.transform = "translateX(-225px)"
  } else {
    navbar.style.transform = "translateX(225px)"
    navbar.style.right = "225px"
    sidenav.style.transform = "translateX(0)"
  }
}

/**
 * 
 * @apiName initNavbar
 * 
 * @description Initialize the navbar
 */
function initNavbar() {
  const navbar = document.querySelector("#navbar  ");
  fetch("navbar.html")
    .then(response => response.text())
    .then(text => {
      navbar.innerHTML = text;
    })
    .then(() => {
      document.getElementById('logout').onclick = () => {
        electronAPI.logOut();
      };
      document.getElementById('sidebarToggle').onclick =() => {
        moveNavbar();
      }; 
    });
}
/**
 * 
 * @apiName initSidenav
 * 
 * @description Initialize the side navigation
 */
function initSidenav() {
  const sidenav = document.querySelector("#layoutSidenav_nav");
  fetch("sidenav.html")
    .then(response => response.text())
    .then(text => {
      sidenav.innerHTML = text;
    })
    .then(() => {
      getHoraires();
    });
}
/**
 * 
 * @apiName initSidenav
 * 
 * @description Initialize the footer
 */
function initFooter() {
  const footer = document.querySelector("footer");
  fetch("footer.html")
    .then(response => response.text())
    .then(text => {
      footer.innerHTML = text;
    });
}

// function XMLToJSON(xml) {
//   return xml2json.xml2json(xml)
// }

// API Definition
const electronAPI = {
  getProfile: () => ipcRenderer.invoke('auth:get-profile'),
  logOut: () => ipcRenderer.send('auth:log-out'),
  getPrivateData: () => ipcRenderer.invoke('api:get-private-data'),
};

// Register the API with the contextBridge
process.once("loaded", () => {
  contextBridge.exposeInMainWorld("api", {
    getHoraires,
    gotHoraires,
    saveHoraire,
    updateHoraire,
    gotHoraireUpdatedResult,
    gotDeletedResult,
    deleteHoraires,
    getAnnonces,
    gotAnnonces,
    saveAnnonce,
    updateAnnonce,
    gotAnnonceUpdatedResult,
    deleteAnnonces,
    moveNavbar,
    initNavbar,
    initSidenav,
    initFooter,
  });
  contextBridge.exposeInMainWorld('electronAPI', electronAPI);
});
