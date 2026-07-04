import data from "../assets/pbi_files.js";

// First load
window.onload = function() {

  document.querySelector('.list-button').click();

}

// Get list buttons
const buttons = document.querySelectorAll('.list-button');

// Alter content based on list button
buttons.forEach(button => {
  button.addEventListener('click', async function() {

    
    buttons.forEach(button => {
        button.style.backgroundColor = '';
      });

    this.style.backgroundColor = '#C0C0C0';

    const text = this.getAttribute('data-text');
    
    document.getElementById('project-title').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${await data[text].title}</h3>
    `;

    document.getElementById('project-content').innerHTML = `${await data[text].htmlContent}`;

  });
});