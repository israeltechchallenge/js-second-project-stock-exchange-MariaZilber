var urlParams = new URLSearchParams(window.location.search);
const symbol = urlParams.get("symbol");
console.log(symbol);

async function profileCompany() {
  try {
    const response = await fetch(
      `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/company/profile/${symbol}`
    );
    const data = await response.json();
    console.log(data);
    getData(data);
  } catch (err) {
    console.log(err);
  }
}

function getData(data) {
  const { companyName, image, description, price, changesPercentage } =
    data.profile;
  document.getElementById("companyName").innerHTML = companyName;
  document.getElementById("imageCompany").src = image;
  document.getElementById("descriptionCompany").innerHTML = description;
  document.getElementById("stockPrice").innerHTML =
    "Stock Price: " + "$" + price;

  if (changesPercentage < 0) {
    document.getElementById("percentages").innerHTML =
      "(" + parseFloat(`${changesPercentage}`).toFixed(2) + "%)";
    document.getElementById("percentages").classList.add("red");
  } else {
    document.getElementById("percentages").innerHTML =
      "(+" + parseFloat(`${changesPercentage}`).toFixed(2) + "%)";
    document.getElementById("percentages").classList.add("green");
  }
}
profileCompany();

let historyDate = [];
let historyStockPrice = [];

async function displayData() {
  await getApi();
  const data = {
    labels: historyDate,
    datasets: [
      {
        label: "History of stock price",
        data: historyStockPrice,
        backgroundColor: ["rgba(255, 26, 104, 0.2)"],
        borderColor: ["rgba(255, 26, 104, 1)"],
        borderWidth: 1,
      },
    ],
  };

  // config
  const config = {
    type: "bar",
    data,
    options: {
      scales: {
        y: {
          beginAtZero: true,
        },
      },
    },
  };

  new Chart(document.getElementById("myChart"), config);
}

async function getApi() {
  try {
    const link = `https://stock-exchange-dot-full-stack-course-services.ew.r.appspot.com/api/v3/historical-price-full/${symbol}?serietype=line`;
    const responseLink = await fetch(link);
    const dataJson = await responseLink.json();
    console.log(dataJson.historical);

    const date = dataJson.historical.map((day) => day.date);
    historyDate = date;
    const close = dataJson.historical.map((price) => price.close);
    historyStockPrice = close;
  } catch (err) {
    console.log(err);
  }
}

displayData();
