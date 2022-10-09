const dropList = document.querySelectorAll(".drop-list select"),
  fromCurrency = document.querySelector(".from select"),
  toCurrency = document.querySelector(".to select"),
  getBtn = document.querySelector("form button");

for (let i = 0; i < dropList.length; i++) {
  for (let currency_code in country_list) {
    let selected;
    if (i === 0) {
      selected = currency_code === "USD" ? "selected" : "";
    } else if (i === 1) {
      selected = currency_code === "NPR" ? "selected" : "";
    }
    let optionTag = `<option value="${currency_code}" ${selected}>${currency_code}</option>`;
    dropList[i].insertAdjacentHTML("beforeend", optionTag);
  }
  dropList[i].addEventListener("change", (e) => {
    loadFlag(e.target);
  })
}

function loadFlag(element) {
  for (code in country_list) {
    if (code === element.value) {
      let imgTag = element.parentElement.querySelector("img");
      imgTag.src = `https://countryflagsapi.com/png/${country_list[code]}`;
    }
  }
}

const exchangeIcon = document.querySelector(".icon");
exchangeIcon.addEventListener("click", () => {
  let tempCode = fromCurrency.value;
  fromCurrency.value = toCurrency.value;
  toCurrency.value = tempCode;
  loadFlag(fromCurrency);
  loadFlag(toCurrency);
  getExchangeRate();
})

window.addEventListener("load", () => {
  getExchangeRate();
});

getBtn.addEventListener("click", (e) => {
  e.preventDefault();
  getExchangeRate();
});

function getExchangeRate() {
  const exchangeRateTxt = document.querySelector(".exchange-rate");
  amount = document.querySelector("form .amount input");
  let amountVal = amount.value;

  if (amountVal === "" || amountVal === "0") {
    amount.value = "1";
    amountVal = 1;
  }

  var myHeaders = new Headers();
  myHeaders.append("apikey", "API_KEY");

  var requestOptions = {
    method: 'GET',
    redirect: 'follow',
    headers: myHeaders
  };

  exchangeRateTxt.innerText = "Getting exchange rate...";
  let url = `https://api.apilayer.com/exchangerates_data/latest?base=${fromCurrency.value}`;
  fetch(url, requestOptions).then(response => response.json()).then(result => {

    let exchangeRate = result.rates[toCurrency.value];
    let totalexchangeRate = (exchangeRate * amountVal).toFixed(2);
    exchangeRateTxt.innerText = `${amountVal} ${fromCurrency.value} = ${totalexchangeRate} ${toCurrency.value}`;

  }).catch(() => exchangeRateTxt.innerText = "Something went wrong");
}
