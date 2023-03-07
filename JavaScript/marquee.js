class Marquee {
  constructor(marqueeElement) {
    this.marqueeElement = marqueeElement;
    this.getData();
  }

  async getData() {
    const response = await fetch(baseUrl + `/api/v3/stock/list`);
    const data = await response.json();
    for (let i = 0; i < 25; i++) {
      const companyDetail = data[i];
      this.renderMarqueeData(companyDetail);
    }
  }

  renderMarqueeData = (companyDetail) => {
    const symbol = companyDetail.symbol;
    const price = companyDetail.price;
    const stockList = document.createElement("span");
    stockList.classList.add("stockList");
    stockList.textContent = `${symbol} ${price}`;

    this.appendTo(stockList);
  };

  appendTo = (stockList) => {
    this.marqueeElement.append(stockList);
  };
}
