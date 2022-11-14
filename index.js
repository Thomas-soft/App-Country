const form = document.querySelector("form");
const result = document.getElementById("result");
const range_input = document.getElementById("range_input");
const country_input = document.getElementById("country_input");
const filter_contain = document.querySelectorAll("button");
let range_value = 255;

let data_countrys = [];

async function fetchDataCountrys()
{
    await fetch("https://restcountries.com/v3.1/all")
    .then((res) => res.json())
    .then((data) => data_countrys = data);
};

function displayCountrys(country_name_input, filter=null, range_value=255)
{
    result.innerHTML = data_countrys
    .filter((country) => country.name.common.toLowerCase().includes(country_name_input.toLowerCase()))
    .sort((a, b) =>
    {
        if (filter === "increase_filter")
            return a.population - b.population;
        else if (filter === "decrease_filter")
            return b.population - a.population;
        else if (filter === "alphabetic_filter")
        {
            if (a.name.common < b.name.common) return -1;
            else if (a.name.common > b.name.common) return 0;
        }
        else
            return;
    })
    .slice(0, range_value)
    .map((country) =>
    {
        return `
            <li>
                <img src="${country.flags.png}" alt="Drapeau de ${country.name.common}">
                <h2>${country.name.common}</h2>
                <h3>${country.capital}</h3>
                <p>Nombre d'habitants:<br>${country.population.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ")}</p>
            </li>
        `;
    })
    .join("");
};
fetchDataCountrys().then(() => displayCountrys(""));

function listenForCountrySection()
{
    range_input.addEventListener("input", (e) =>
    {
        range_output.textContent = e.target.value;
        range_value = e.target.value;
        fetchDataCountrys().then(() => displayCountrys("", null, range_value));
    });
    
    country_input.addEventListener("input", (e) =>
    {
        fetchDataCountrys().then(() => displayCountrys(e.target.value, null, range_value));
    });
    
    filter_contain.forEach((filter) =>
    {
        filter.addEventListener("click", (e) =>
        {
            fetchDataCountrys().then(() => displayCountrys("", e.target.id, range_value))
        });
    });
};
listenForCountrySection();