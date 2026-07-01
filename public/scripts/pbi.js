import data from "../assets/pbi_files.js";


//test
console.log(data);

// First load
window.onload = function() {

  document.querySelector('.list-button').click();

}

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
    
    document.getElementById('project-title').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${data[text].title}</h3>
    `;

    document.getElementById('project-content').innerHTML = `${data[text].htmlContent}`;

  });
});