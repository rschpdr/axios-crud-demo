const input = document.getElementById("country-name-input");
const btn = document.getElementById("get-country-btn");
const countryName = document.getElementById("country-name");
const countryCapital = document.getElementById("country-capital");
const countryFlag = document.getElementById("country-flag");
const error = document.getElementById("fetch-error");

const API_ENDPOINT = "https://restcountries.eu/rest/v2/name/";

async function fetchCountry(searchTerm) {
  try {
    const searchResult = await axios.get(API_ENDPOINT + searchTerm);
    console.log(searchResult);
    return searchResult.data;
  } catch (err) {
    return err;
  }
}

btn.addEventListener("click", async () => {
  const searchTerm = input.value;

  if (searchTerm) {
    try {
      const country = await fetchCountry(searchTerm);

      countryName.innerText = country[0].name;
      countryCapital.innerText = country[0].capital;
      countryFlag.src = country[0].flag;
    } catch (err) {
      error.hidden = false;
      error.children[0].innerText = JSON.stringify(err);
    }
  }

  return;
});
