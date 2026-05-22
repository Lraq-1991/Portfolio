import { query1 } from '../assets/advanced_queries.js';

//test
console.log(query1);

//Create template to render data
getElementById('query-tittle').innerHTML = `
    <h3 class="mt-2 font-worksansSemi text-footerlabel text-ink">${query1.tittle}</h3>
`;  