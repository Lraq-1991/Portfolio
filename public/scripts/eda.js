import loadHTML from "../assets/clean_data_project.js";

const data = await loadHTML();

// First load
async function onLoad() {
  
    document.getElementById('project-tittle').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${await data.title}</h3>
  `;

  document.getElementById('project-content').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${await data.htmlContent}</p>
  `;

  document.querySelector('.list-button').style.backgroundColor = 'gray';

}

onLoad();


// Get list buttons
const buttons = document.querySelectorAll('.list-button');

// Alter content based on list button
buttons.forEach(button => {
  button.addEventListener('click', function() {

    
    buttons.forEach(button => {
        button.style.backgroundColor = '';
      });

    this.style.backgroundColor = 'gray';

    const text = this.getAttribute('data-text');
    
    document.getElementById('project-tittle').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${data.title}</h3>
    `;

    document.getElementById('project-content').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${data.htmlContent}</p>
    `;

  });
});

