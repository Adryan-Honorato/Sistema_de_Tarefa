// Todas as APIs do Node.js estão disponíveis no processo de preload.
// Ele possui o mesmo sandbox que uma extensão do Chrome.
window.addEventListener('DOMContentLoaded', () => {
  // Função para substituir o texto de um elemento pelo seu seletor e texto fornecido.
  const replaceText = (selector, text) => {
    const element = document.getElementById(selector)
    if (element) element.innerText = text
  }

  // Atualiza as versões das dependências na interface.
  for (const dependency of ['chrome', 'node', 'electron']) {
    replaceText(`${dependency}-version`, process.versions[dependency])
  }
})

// ========================
// Seção de Controle de Música
// ========================

// Seleção dos elementos de áudio
const music = document.getElementsByTagName("audio")[0];
const playMusic = document.getElementById("playMusic");
const vol = document.getElementById("volume");
const icon = document.getElementsByClassName("iconPlay")[0];

let indexMusic = 1;
music.volume = 0.2;

// Evento acionado quando a música termina
music.addEventListener("ended", () => {
  indexMusic = indexMusic < 6 ? indexMusic + 1 : 1;
  music.src = `src/Audios/music${indexMusic}.mp3`;
  music.play();
});

// Evento de clique para tocar/pausar música
playMusic.addEventListener("click", () => {
  if (playMusic.value === "1") {
    music.play();
    playMusic.value = "0";
    icon.classList.replace("fa-circle-play", "fa-circle-pause");
    vol.classList.remove("hidden");
  } else {
    music.pause();
    playMusic.value = "1";
    icon.classList.replace("fa-circle-pause", "fa-circle-play");
    vol.classList.add("hidden");
  }
});

// Evento para ajustar o volume da música
vol.addEventListener("input", () => {
  music.volume = vol.value / 10;
});

// ========================
// Seção do Modal
// ========================

const modal = document.querySelector(".modal");
const openModal = document.getElementById("openModal");
const closedModal = document.getElementById("closedModal");

// Abre o modal ao clicar no botão
openModal.addEventListener("click", () => {
  modal.style.display = "flex";
  document.querySelector("p").classList.add("hidden");
});

// Fecha o modal ao clicar no botão de fechar
closedModal.addEventListener("click", () => {
  modal.style.display = "none";
  document.querySelector("p").classList.remove("hidden");
});

// ========================
// Seleção de Campos de Tarefa
// ========================

const inputName = document.querySelectorAll("label");
const typeTask = document.getElementById("tipoTarefa");
typeTask.value = "";

const importance = document.getElementById("importancia");
const components = document.querySelectorAll(".componentes");
const createTask = document.getElementById("criar");

// ========================
// Modos de Tarefa
// ========================

const tempTask = document.getElementById("tipoTemporal");
tempTask.value = "";

tempTask.addEventListener("input", () => {
  if (startDate.value !== "" && tempTask.value !== "") {
    startTime.removeAttribute("disabled");
  }
});

// ========================
// Manipulação de Datas
// ========================

// Obter a data atual no formato "YYYY-MM-DD"
const today = new Date();
const todayDate = today.toISOString().split("T")[0];
const hour = today.toTimeString().slice(0, 5);

const startDate = document.getElementById("dataComeco");
const endDate = document.getElementById("dataFinal");
const weekDay = document.getElementById("semanaDia");
const weekDays = document.querySelectorAll(".dias");

// Define a data mínima nos campos de data
startDate.min = todayDate;
endDate.min = todayDate;

// Evento ao perder o foco do campo de data inicial
startDate.addEventListener("focusout", () => {
  const valueDate = startDate.value;
  const date = new Date(valueDate);

  if (!isNaN(date.getTime()) && valueDate >= todayDate) {
    weekDay.value = weekDays[date.getDay()].textContent;
  } else {
    startDate.value = todayDate;
    weekDay.value = weekDays[today.getDay()].textContent;
  }

  endDate.min = startDate.value;
});

// Evento ao perder o foco do campo de data final
endDate.addEventListener("focusout", () => {
  if (endDate.value < startDate.value) {
    endDate.value = startDate.value;
  }
});

const startTime = document.getElementById("horarioInicial");
const endTime = document.getElementById("horarioFinal");
startTime.setAttribute("readOnly", true);
endTime.setAttribute("readOnly", true);
let checkStartTime = [startDate, tempTask];

// Habilita campo de hora quando necessário
checkStartTime.forEach((element) => {
  element.addEventListener("focusout", () => {
    if (startDate.value !== "" && tempTask.value !== "") {
      startTime.removeAttribute("disabled");
    }
  });
});

// ========================
// Criação de Tarefas
// ========================

createTask.addEventListener("click", () => {
  let amount = 0;
  let missing = "";

  components.forEach((component, index) => {
    if (/[A-Za-z0-9]/.test(component.value)) {
      amount++;
    } else {
      component.style.border = "solid 1px red";
      missing += ` ${inputName[index].innerHTML},`;
    }
  });

  if (amount < components.length) {
    alert(`Estão faltando as seguintes informações: ${missing}`);
  }

  const dateOne = new Date(startDate.value);
  const dateTwo = new Date(endDate.value);
  const dateDiff = Math.abs(dateOne - dateTwo) / 86400000; // Diferença em dias
});
