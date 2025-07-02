// ========================
// CONTROLE DE VERSÕES
// ========================
window.addEventListener("DOMContentLoaded", () => {
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector);
    if (element) element.innerText = text;
  };

  for (const dependency of ["chrome", "node", "electron"]) {
    replaceText(`${dependency}-version`, process.versions[dependency]);
  }
});

// ========================
// ÁUDIO E MÚSICA
// ========================
const music = document.querySelector("audio");
const playButton = document.getElementById("playMusic");
const volumeSlider = document.getElementById("volume");
const icon = document.querySelector(".iconPlay");

let currentTrack = 1;
music.volume = 0.2;

music.addEventListener("ended", () => {
  currentTrack = currentTrack < 6 ? currentTrack + 1 : 1;
  music.src = `src/Audios/music${currentTrack}.mp3`;
  music.play();
});

playButton.addEventListener("click", () => {
  const isPaused = playButton.value === "1";

  if (isPaused) {
    music.play();
    icon.classList.replace("fa-circle-play", "fa-circle-pause");
    volumeSlider.classList.remove("hidden");
    playButton.value = "0";
  } else {
    music.pause();
    icon.classList.replace("fa-circle-pause", "fa-circle-play");
    volumeSlider.classList.add("hidden");
    playButton.value = "1";
  }
});

volumeSlider.addEventListener("input", () => {
  music.volume = volumeSlider.value / 10;
});

// ========================
// MODAL
// ========================
const modal = document.getElementById("modal");
const blur = document.getElementById("blur");
const openModal = document.getElementById("openModal");
const closeModal = document.getElementById("closedModal");
const infoText = document.querySelector("p");

openModal.addEventListener("click", () => {
  modal.style.display = "flex";
  blur.style.display = "block";
});

closeModal.addEventListener("click", () => {
  closeModalFunc();
});

function closeModalFunc() {
  components.forEach(c => {
    c.style.border = "none";
    c.value = "";
  });
  modal.style.display = "none";
  blur.style.display = "none";
}

modal.addEventListener("focusout", (e) => {
  if (e.target.classList.contains("componentes")) {
    atualizarDiaSemana();
    corrigirDatasInvalidas();
    corrigirHorarioInvalido();
  }
});

// ========================
// CAMPOS DE TAREFA
// ========================
const components = document.querySelectorAll(".componentes");
const inputLabels = document.querySelectorAll("label");
const createButton = document.getElementById("criar");

const tempTask = document.getElementById("tipoTemporal");
const typeTask = document.getElementById("tipoTarefa");
const description = document.getElementById("descricao");
const importance = document.getElementById("importancia");

const startDate = document.getElementById("dataComeco");
const endDate = document.getElementById("dataFinal");
const startTime = document.getElementById("horarioInicial");
const endTime = document.getElementById("horarioFinal");
const weekDay = document.getElementById("semanaDia");

const today = new Date();
const todayDate = today.toISOString().split("T")[0];
const hour = today.toTimeString().slice(0, 5);
const weekDaysArray = ['dom', 'seg', 'ter', 'qua', 'qui', 'sex', 'sab'];

startDate.min = todayDate;
endDate.min = todayDate;
typeTask.value = "";

// ========================
// CRIAÇÃO DE TAREFA
// ========================
let numberTask = 0;
const tableTask = document.getElementById("tableTask");
const taskList = document.getElementById("taskList");
const task = {};

createButton.addEventListener("click", () => {
  let filled = 0;
  let missing = "";

  components.forEach((c, i) => {
    if (/[A-Za-z0-9]/.test(c.value)) {
      c.style.border = "none";
      filled++;
    } else {
      c.style.border = "1px solid red";
      missing += `${inputLabels[i].innerHTML}<br>`;
    }
  });

  if (filled < components.length) {
    callAlert(`Estão faltando: <br><strong>${missing}</strong>`);
  } else {
    task[`task${numberTask}`] = {
      tipoTemporal: tempTask.value,
      comeco: startDate.value,
      fim: endDate.value,
      horario: `${startTime.value} - ${endTime.value}`,
      dia: weekDay.value,
      tipoTarefa: typeTask.value,
      descricao: description.value,
      importancia: importance.value,
    };

    addTaskToTable(numberTask);
    infoText.classList.add('hidden');
    numberTask++;
  }
});


function addTaskToTable(taskIndex) {
  const currentTask = task[`task${taskIndex}`];
  const tr = document.createElement('tr');

  const valores = [
    currentTask.tipoTemporal,
    currentTask.comeco,
    currentTask.fim,
    currentTask.horario,
    currentTask.importancia,
    currentTask.dia,
    currentTask.tipoTarefa,
    currentTask.descricao,
  ];

  for (let i = 0; i < valores.length; i++) {
    const td = document.createElement('td');
    td.textContent = valores[i].toUpperCase();
    tr.appendChild(td);
  }

  const tdCheck = document.createElement('td');
  const checkInput = document.createElement('input');
  checkInput.type = "checkbox";
  checkInput.classList.add('concluded');

  tdCheck.appendChild(checkInput);
  tr.appendChild(tdCheck);
  taskList.appendChild(tr);

  closeModalFunc();
  infoText.style.display = "none";
  tableTask.style.display = "table";
  let checkConcluded = document.querySelectorAll(".concluded");

checkConcluded.forEach((element) =>{
  element.addEventListener("change", () =>{
  
  })
})
}



// ========================
// FUNÇÕES DE VALIDAÇÃO
// ========================
function atualizarDiaSemana() {
  const data = new Date(startDate.value);
  if (startDate.value) {
    weekDay.value = weekDaysArray[data.getDay()];
  }
  endDate.min = startDate.value;
}

function corrigirDatasInvalidas() {
  if (startDate.value < todayDate) startDate.value = todayDate;
  if (endDate.value && endDate.value < startDate.value) {
    endDate.value = startDate.value;
  }
}

function corrigirHorarioInvalido() {
  if (startDate.value === todayDate && startTime.value < hour) {
    startTime.value = hour;
  }

  if (
    startTime.value &&
    endTime.value &&
    startTime.value >= endTime.value &&
    startDate.value === endDate.value &&
    tempTask.value !== "contínuo"
  ) {
    callAlert("Horário inicial deve ser menor que o final.");
    endTime.value = "";
  }
}

// ========================
// ALERTA
// ========================
const divAlert = document.getElementById("divAlert");
const textAlert = divAlert.querySelector("span");
const btnAlert = divAlert.querySelector("button");

function callAlert(msg) {
  modal.style.display = "none";
  textAlert.innerHTML = msg.toUpperCase();
  divAlert.style.display = "flex";
}

btnAlert.addEventListener("click", () => {
  modal.style.display = "flex";
  divAlert.style.display = "none";
  textAlert.innerHTML = "";
});
