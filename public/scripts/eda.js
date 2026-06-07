import clean_data_project from "../assets/clean_data_project";

console.log(clean_data_project);

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
    
    document.getElementById('project-tittle').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${clean_data_project.tittle}</h3>
    `;

    document.getElementById('project-conttent').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${clean_data_project.htmlContent}</p>
    `;

  });
});
