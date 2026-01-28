"use strict";

let habbits = [];
const HABBIT_KEY = "HABBIT_KEY";
let globalActiveHabbitId;

//page

const page = {
  menu: document.querySelector(".menu__list"),
  header: {
    h1: document.querySelector(".h1"),
    progressPercent: document.querySelector(".progress__percent"),
    progressCoverBar: document.querySelector(".progress__cover-bar"),
  },
  content: {
    daysContainer: document.getElementById("days"),
    nextDay: document.querySelector(".habbit__day"),
  },
  popup: {
    iconField: document.querySelector('.popup__form input[name="icon"]'),
  },
};

// utils //

function loadData() {
  const habbitsString = localStorage.getItem(HABBIT_KEY);
  const habbitArray = JSON.parse(habbitsString);
  if (Array.isArray(habbitArray)) {
    habbits = habbitArray;
  }
}

function saveData() {
  localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

function togglePopup() {
  const coverElement = document.querySelector(".cover");
  const menuElement = document.querySelector(".menu__add");
  const popupCloseElement = document.querySelector(".popup__close");

  menuElement.addEventListener("click", function () {
    coverElement.classList.toggle("cover_hidden");
  });

  popupCloseElement.addEventListener("click", function () {
    coverElement.classList.toggle("cover_hidden");
  });
}

function resetForm(form, fields) {
  for (const field of fields) {
    form[field].value = "";
  }
}

function validadeForm(form, fields) {
  const formData = new FormData(form);
  const res = {};
  for (const field of fields) {
    const fieldValue = formData.get(field);
    form[field].classList.remove("error");
    if (!fieldValue) {
      form[field].classList.add("error");
    }
    res[field] = fieldValue;
  }
  let isValid = true;
  for (const field of fields) {
    if (!res[field]) {
      isValid = false;
    }
  }
  if (!isValid) {
    return;
  }
  return res;
}

//render

function rerenderMenu(activeHabbit) {
  if (!activeHabbit) {
    return;
  }
  for (const habbit of habbits) {
    const existed = document.querySelector(`[menu-habbit-id="${habbit.id}"]`);
    if (!existed) {
      //создание
      const element = document.createElement("button");
      element.setAttribute("menu-habbit-id", habbit.id);
      element.classList.add("menu__item");
      element.addEventListener("click", () => rerender(habbit.id));
      element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
      if (activeHabbit.id === habbit.id) {
        element.classList.add("menu__item_active");
      }
      page.menu.appendChild(element);
      continue;
    }
    if (activeHabbit.id === habbit.id) {
      existed.classList.add("menu__item_active");
    } else {
      existed.classList.remove("menu__item_active");
    }
  }
}

function rerenderHead(activeHabbit) {
  page.header.h1.innerText = activeHabbit.name;
  const progress =
    activeHabbit.days.length / activeHabbit.target > 1
      ? 100
      : (activeHabbit.days.length / activeHabbit.target) * 100;
  page.header.progressPercent.innerText = progress.toFixed(0) + "%";
  page.header.progressCoverBar.setAttribute("style", `width: ${progress}%`);
}

function rerendercontent(activeHabbit) {
  page.content.daysContainer.innerHTML = "";
  for (const index in activeHabbit.days) {
    const element = document.createElement("div");
    element.classList.add("habbit");
    element.innerHTML = `<div class="habbit__day">День ${Number(index) + 1}</div>
              <div class="habbit__comment">${
                activeHabbit.days[index].comment
              }</div>
              <button class="habbit__delete" onclick="deleteDay(${index})">
                <img src="./images/delete.svg" alt="Удалить день ${
                  index + 1
                }" />
              </button>`;
    page.content.daysContainer.appendChild(element);
  }
  page.content.nextDay.innerHTML = `День ${activeHabbit.days.length + 1}`;

  //  deleteDay();
}

function rerender(activeHabbitId) {
  globalActiveHabbitId = activeHabbitId;
  const activeHabbit = habbits.find((habbit) => habbit.id === activeHabbitId);
  if (!activeHabbit) {
    return;
  }
  document.location.replace(document.location.pathname + "#" + activeHabbit.id);

  rerenderMenu(activeHabbit);
  rerenderHead(activeHabbit);
  rerendercontent(activeHabbit);
}

//work with days

function addDays(event) {
  event.preventDefault();

  const data = validadeForm(event.target, ["comment"]);
  if (!data) {
    return;
  }

  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      return {
        ...habbit,
        days: habbit.days.concat([{ comment: data.comment }]),
      };
    }
    return habbit;
  });

  resetForm(event.target, ["comment"]);
  rerender(globalActiveHabbitId);
  saveData();
}

// function deleteDay() {
//   const deleteElement = document.getElementsByClassName("habbit__delete");
//   const elementArray = Array.from(deleteElement);

// const activeHabbit = habbits.find(h => h.id === globalActiveHabbitId);
//   if (!activeHabbit) return;

//   elementArray.forEach((element) => {
//     element.addEventListener("click", function (event) {
//         const dayId = Number(event.currentTarget.dataset.id)

//         activeHabbit.days = activeHabbit.days.filter((day, index) => index !== dayId)

//       rerender(globalActiveHabbitId);
//       saveData();
//     });
//   });
// }

function deleteDay(index) {
  habbits = habbits.map((habbit) => {
    if (habbit.id === globalActiveHabbitId) {
      habbit.days.splice(index, 1);
      return {
        ...habbit,
        days: habbit.days,
      };
    }
    return habbit;
  });
  rerender(globalActiveHabbitId);
  saveData();
}

// working with habbits

function setIcon(context, icon) {
  page.popup.iconField.value = icon;
  const activeIcon = document.querySelector(".icon.icon_active");
  activeIcon.classList.remove("icon_active");
  context.classList.add("icon_active");
}

// function addHabbit(event) {
//   const form = event.target;
//   event.preventDefault();
//   const data = new FormData(form);
//   const target = Number(data.get("target"));
//   const name = data.get("name");
//   form["name"].classList.remove("error");
//   if (!name) {
//     form["name"].classList.add("error");
//   }
//   form["target"].classList.remove("error");
//   if (!target || target <= 0) form["target"].classList.add("error");

//   if (!name || !target || target <= 0) {
//     return;
//   }

//   const id = Date.now();
//   const newHabbit = {
//     id: id,
//     name: name,
//     target: target,
//     icon: "icon_active",
//     days: [],
//   };
//   habbits.push(newHabbit);
//   rerender(newHabbit.id);
//   saveData();
// }

function addHabbit(event) {
  event.preventDefault();

  const data = validadeForm(event.target, ["name", "icon", "target"]);
  if (!data) {
    return;
  }
  const maxId = habbits.reduce(
    (acc, habbit) => (acc > habbit.id ? acc : habbit.id),
    0,
  );
  habbits.push({
    id: maxId + 1,
    name: data.name,
    target: data.target,
    icon: data.icon,
    days: [],
  });
  resetForm(event.target, ["name", "target"]);
  togglePopup();
  saveData();
  rerender(maxId + 1);
}

// init //

(() => {
  loadData();
  const hashId = Number(document.location.hash.replace("#", ""));
  const urlHabbit = habbits.find((habbit => habbit.id == hashId));
  if (urlHabbit) {
    rerender(urlHabbit.id);
  } else {
    rerender(habbits[0].id);
  }
})();
