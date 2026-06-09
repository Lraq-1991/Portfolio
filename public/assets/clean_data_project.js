export default async function loadHTML() {
  const response = await fetch('../assets/cleaning_data.html');
  const html = await response.text();

  const data = {
    title: "Data Cleaning",
    htmlContent: await html
  };

  return data;

}


