const autocomplete = document.querySelector(".autocomplete");
const input = autocomplete.firstElementChild;
const records = document.querySelector(".wrapper-records");
let btnsCreated = false;

const debounce = (fn, debounceTime) => {
  let timerID;

  return function (...args) {
    clearTimeout(timerID);
    timerID = setTimeout(() => fn.apply(this, args), debounceTime);
  };
};

const debouncedSearch = debounce(search, 500);
input.addEventListener("input", debouncedSearch);

async function search() {
  if (!input.value) {
    clearList();
    return;
  }

  let url = `https://api.github.com/search/repositories?q=${input.value}&sort=stars&order=desc`;
  let response = await fetch(url);
  let state = await response.json();

  let countOfHints = state.items.length;
  countOfHints = countOfHints > 5 ? 5 : countOfHints;

  if (!btnsCreated) createBtns(countOfHints);
  let btns = document.querySelectorAll(".autocomplete-button");

  let btnsArray = Array.from(btns);
  for (let i = 0; i < countOfHints; i++) {
    updateBtn(state.items[i], btnsArray[i]);
  }

  console.log(state);
}
function updateBtn(elem, btn) {
  if (!elem) return;
  btn.innerText = elem.name;
  btn.repoDate = elem;
}

function clearList() {
  let arr = Array.from(autocomplete.children).slice(1);
  arr.forEach((elem) => elem.remove());
  btnsCreated = false;
}

function createBtns(count) {
  for (let i = 0; i < count; i++) {
    let btn = document.createElement("button");
    btn.className = "autocomplete-button";
    btn.addEventListener("click", addRecord);
    autocomplete.append(btn);
    btnsCreated = true;
  }
}

function addRecord(evt) {
  let data = evt.target.repoDate;
  let record = document.createElement("div");
  record.className = "record";
  record.innerText = `Name: ${data.name}
     Owner: ${data.owner.login}
     Stars: ${data.stargazers_count}`;

  addDeleter(record);
  records.append(record);
  input.value = "";
  setTimeout(clearList, 300);
}

function addDeleter(elem) {
  let deleter = document.createElement("div");
  deleter.className = "closer";
  deleter.addEventListener("click", () => {
    elem.remove();
  });
  elem.append(deleter);
}
