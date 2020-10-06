class View {
  constructor() {
    this.app = document.querySelector(".app");

    this.title = this.createElement("h1", "title");
    this.title.textContent = "Ищем репку";

    this.searchLine = this.createElement("div", "search-line");
    this.searchInput = this.createElement("input", "search-input");
    this.searchCounter = this.createElement("span", "counter");
    this.searchLine.append(this.searchInput);
    this.searchLine.append(this.searchCounter);

    this.reposWrapper = this.createElement("div", "repos-wrapper");
    this.repoList = this.createElement("div", "repos");
    this.reposWrapper.append(this.repoList);

    this.main = this.createElement("div", "main");
    this.main.append(this.reposWrapper);

    this.app.append(this.title);
    this.app.append(this.searchLine);
    this.app.append(this.main);
  }
  createElement(elementTag, elementClass) {
    const element = document.createElement(elementTag);
    if (elementClass) {
      element.classList.add(elementClass);
    }
    return element;
  }
  createRepo(repoData) {
    const repoElement = this.createElement("button", "repo-prev");
    repoElement.textContent = repoData.name;
    this.repoList.append(repoElement);
  }
}

class Search {
  constructor(view) {
    this.view = view;

    this.view.searchInput.addEventListener(
      "keyup",
      this.debounce(this.searchRepos.bind(this), 500)
    );
  }

  async searchRepos() {
    if (this.view.searchInput.value) {
      this.clearUsers();
      return await fetch(
        `https://api.github.com/search/repositories?q=${this.view.searchInput.value}&sort=stars&order=desc&per_page=5`
      ).then((response) => {
        if (response.ok) {
          response.json().then((response) => {
            response.items.forEach((repo) => this.view.createRepo(repo));
          });
        }
      });
    } else {
      this.clearUsers();
    }
  }

  clearUsers() {
    this.view.repoList.innerHTML = "";
  }

  debounce(func, wait, immediate) {
    let timeout;
    return function () {
      const context = this,
        args = arguments;
      const later = function () {
        timeout = null;
        if (!immediate) func.apply(context, args);
      };
      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
      if (callNow) func.apply(context, args);
    };
  }
}

new Search(new View());
