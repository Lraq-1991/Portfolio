import query1 from '../assets/queries.js';


//test
console.log(query1);


//Create template to render data
let queryTittle = document.getElementById('query-tittle').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${query1.tittle}</h3>
`;  


let queryText = document.getElementById('query-text').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${query1.query_text}</p>
`;  


let queryOutput = document.getElementById('query-output').innerHTML = `
    <p class="mt-2 font-avenir text-body leading-[1.6em] text-ink">${query1.query_output}</p>
`;