import data from "../assets/data_projects.js";

// First load
async function onLoad() {

  document.getElementById('project-content').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${await data[0].htmlContent}</p>
  `;

  document.querySelector('.list-button').style.backgroundColor = 'gray';

}

onLoad();


// Get list buttons
const buttons = document.querySelectorAll('.list-button');

// Alter content based on list button
buttons.forEach(button => {
  button.addEventListener('click', async function() {

    
    buttons.forEach(button => {
        button.style.backgroundColor = '';
      });

    this.style.backgroundColor = 'gray';

    const text = this.getAttribute('data-text');

    document.getElementById('project-content').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${await data[text].htmlContent}</p>
    `;

  });
});

