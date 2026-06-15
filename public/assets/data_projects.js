async function CleanDataHTML() {
  const response = await fetch('../assets/cleaning_data.html');
  const html = await response.text();

  return html;

}

async function EDAHTML() {
  const response = await fetch('../assets/eda.html');
  const html = await response.text();

  return html;

}

// Arrays of Objects to be exported
const data = [
  {
    title: "Data Cleaning",
    htmlContent: CleanDataHTML()
  },
  {
    title: "EDA",
    htmlContent: EDAHTML()
  },
];


export default data;





