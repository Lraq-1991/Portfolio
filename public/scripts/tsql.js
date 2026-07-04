import queries from '../assets/queries.js';


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
    
    document.getElementById('query-tittle').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${queries[text].tittle}</h3>
    `;

    document.getElementById('query-text').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${queries[text].query_text}</p>
    `;

    document.getElementById('query-output').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${queries[text].query_output}</p>
    `;

  });
});


