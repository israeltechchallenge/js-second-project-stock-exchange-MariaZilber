class SearchResult {
  constructor(inputUserElemnt) {
    this.inputUserElemnt = inputUserElemnt;
    this.resultsList = document.getElementById("resultsList");
    this.loadingSpinner = document.getElementById("loadingSpinner");
    this.search();
  }

  async search() {
    this.enableSpinner();
    const fetchResult = await this.fetchCompany(
      baseUrl +
        `/api/v3/search?query=${this.inputUserElemnt.value}&limit=10&exchange=NASDAQ`
    );
    const fullData = await this.getCompanyFullData(fetchResult);
    this.renderAll(fullData);
  }

  async fetchCompany(url) {
    const requestFetch = await fetch(url);
    const responseFetch = await requestFetch.json();
    return responseFetch;
  }

  async getCompanyFullData(arrData) {
    const goThrowArr = arrData.map((company) => {
      return fetch(baseUrl + `/api/v3/company/profile/${company.symbol}`);
    });
    const responses = await Promise.all(goThrowArr);
    console.log(responses);
    const newData = await Promise.all(
      responses.map((response) => {
        return response.json();
      })
    );
    for (let i = 0; i < arrData.length; i++) {
      const keys = Object.keys(newData[i]);
      if (keys.length > 0) {
        arrData[i].image = newData[i].profile.image;
        arrData[i].changesPercentage = newData[i].profile.changesPercentage;
      } else {
        arrData[i].image = `defaultCompany.png`;
      }
    }
    return arrData;
  }

  renderAll = (resultsArray) => {
    this.disableSpinner();
    const documentFragment = document.createDocumentFragment();
    resultsArray.forEach((company) => {
      const companyContainer = document.createElement("li");
      const companyImage = document.createElement("img");
      companyImage.src = company.image;
      companyContainer.append(companyImage);
      companyImage.onerror = function () {
        console.log("error happens", this);
        this.src = `defaultCompany.png`;
      };

      const linkCompany = document.createElement("a");
      linkCompany.href = `company.html?symbol=${company.symbol}`;
      linkCompany.alt = `company image`;
      const resultSearch = `${company.name} (${company.symbol})`;
      linkCompany.innerHTML = this.markResult(resultSearch);
      companyContainer.append(linkCompany);

      if (company.changesPercentage !== undefined) {
        const changesPercentageContainer = document.createElement(`span`);
        changesPercentageContainer.innerHTML = `${company.changesPercentage}`;
        changesPercentageContainer.classList.add(`bold`);
        const color =
          company.changesPercentage > 0 ? `color_green` : `color_red`;
        changesPercentageContainer.classList.add(color);
        companyContainer.append(changesPercentageContainer);
      }
      documentFragment.append(companyContainer);
    });

    this.resultsList.append(documentFragment);
  };

  markResult(textMark) {
    const inputSearch = this.inputUserElemnt.value.trim();
    if (inputSearch !== "") {
      let replaceText = new RegExp(inputSearch, "g");
      textMark = textMark.replace(replaceText, `<mark>${inputSearch}</mark>`);
    }
    return textMark;
  }

  enableSpinner() {
    this.loadingSpinner.classList.remove("d-none");
  }
  disableSpinner() {
    this.loadingSpinner.classList.add("d-none");
  }
}
