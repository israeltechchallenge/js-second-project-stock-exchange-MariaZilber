const inputUser = document.getElementById("inputUser");
const btn = document.getElementById("searchResults");
const resultsList = document.getElementById("resultsList");
const loadingSpinner = document.getElementById("loadingSpinner");
const marquee = document.querySelector(".containerMarquee");

async function getMarquee() {
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/stock/list`
    );
    const data = await response.json();
    console.log(data);
    for (let i = 0; i < 25; i++) {
      const companyDetail = data[i];
      getDataMarquee(companyDetail);
    }
  } catch (err) {
    console.log(err);
  }
}
function getDataMarquee(companyDetail) {
  const symbol = companyDetail.symbol;
  const price = companyDetail.price;
  console.log(symbol);
  console.log(price);
  const stockList = document.createElement("span");
  stockList.classList.add("stockList");
  stockList.textContent = `${symbol} ${price}`;
  marquee.appendChild(stockList);
}

getMarquee();

btn.addEventListener("click", function (event) {
  event.preventDefault();
  resultsList.innerHTML = "";
  search();
});

async function search() {
  enableSpinner();
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/search?query=${inputUser.value}&amp;limit=10&amp;exchange=NASDAQ`
    );
    const data = await response.json();
    console.log(data);
    const latestResults = data.slice(0, 10);
    listResults(latestResults);
  } catch (err) {
    console.log(err);
  }
}
function listResults(tenResultsList) {
  resultsList.innerHTML = "";
  for (const data of tenResultsList) {
    const symbol = data.symbol;
    getProfileCompany(symbol);
  }
}

async function getProfileCompany(symbol) {
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
    );
    const data = await response.json();
    console.log(data);
    getData(data, symbol);
  } catch (err) {
    console.log(err);
  }
}

function getData(data, symbol) {
  const { companyName, image, changesPercentage } = data.profile;

  const containerProfile = document.createElement("div");
  containerProfile.classList.add("containerProfile");
  const newList = document.createElement("div");
  newList.classList.add("newList");
  const imageCompany = document.createElement("img");
  imageCompany.classList.add("imageCompany");
  const linkProfile = document.createElement("a");
  linkProfile.classList.add("linkProfile");
  const symbolProfile = document.createElement("p");
  symbolProfile.classList.add("symbolProfile");
  const precentageProfile = document.createElement("p");

  linkProfile.href = `company.html?symbol=${symbol}`;
  linkProfile.textContent = `${companyName}`;
  imageCompany.src = `${image}`;

  if (changesPercentage < 0) {
    precentageProfile.textContent =
      parseFloat(`${changesPercentage}`).toFixed(2) + "%";
    precentageProfile.classList.add("red");
  } else {
    precentageProfile.textContent =
      "+" + parseFloat(`${changesPercentage}`).toFixed(2) + "%";
    precentageProfile.classList.add("green");
  }
  disableSpinner();
  symbolProfile.textContent = `(${symbol})`;
  newList.append(imageCompany, linkProfile, symbolProfile, precentageProfile);
  containerProfile.appendChild(newList);
  resultsList.appendChild(containerProfile);
}

function enableSpinner() {
  loadingSpinner.classList.remove("d-none");
}
function disableSpinner() {
  loadingSpinner.classList.add("d-none");
}
