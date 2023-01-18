const input = document.querySelector(".wrapper__input");
const result = document.querySelector(".wrapper__result");
const usersList = document.querySelector(".wrapper__users");

class Search {
  constructor(input) {
    this.input = input;
    this.debouncedFn = this.debounce(this.getRepo, 500);

    this.input.addEventListener(
      "keyup",
      this.debouncedFn.bind(this, this.input)
    );
  }
  // Получение запроса
  async getRepo(val) {
    this.clearPrevResult();
    if (val.value.length !== 0) {
      try {
        let response = await fetch(
          `https://api.github.com/search/repositories?q=${this.input.value}&per_page=5`
        );
        if (response.ok) {
          let json = await response.json();
          let array = await json;

          this.addСhoice(array.items);
        }
      } catch (e) {
        console.log(e.name, e.message, e.stack);
      }
    }
  }
  //Дебонс
  debounce(fn, ms) {
    let timeout;

    return function () {
      const fnCall = () => {
        fn.apply(this, arguments);
      };

      clearTimeout(timeout);

      timeout = setTimeout(fnCall, ms);
    };
  }

  // Функция для  селекта
  addСhoice(arrayUsers) {
    for (let el of arrayUsers) {
      const { owner, name, stargazers_count: stars } = el;
      let blockResult = document.createElement("div");
      blockResult.classList.add("wrapper__result-item");
      blockResult.textContent = name;
      result.append(blockResult);
      this.addSelected(blockResult, name, owner.login, stars);
    }

    this.deleteItem();
  }
  //Удаление предложения автопоиска
  clearPrevResult() {
    const names = document.querySelectorAll(".wrapper__result-item");
    if (names) {
      names.forEach((i) => {
        i.remove();
      });
    }
  }
  //Добавление выбранных
  addSelected(item, name, owner, stars) {
    let userItem = document.createElement("div");
    let userText = document.createElement("div");
    let closeButton = document.createElement("button");

    item.addEventListener("click", function () {
      userItem.classList.add("wrapper__users-item");
      userText.classList.add("wrapper__users-text");
      closeButton.classList.add("wrapper__users-button");
      userText.textContent = `Name: ${name}
   Owner: ${owner}
   Stars: ${stars}`;
      usersList.append(userItem);
      userItem.append(userText, closeButton);

      const names = document.querySelectorAll(".wrapper__result-item");
      if (names) {
        names.forEach((i) => {
          i.remove();
        });
      }
      input.value = "";
    });
  }
  // Удаление карточки
  deleteItem() {
    usersList.addEventListener("click", function (ev) {
      if (ev.target.className != "wrapper__users-button") return;
      let item = ev.target.closest(".wrapper__users-item");
      item.remove();
    });
  }
}

new Search(input);
