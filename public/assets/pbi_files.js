// Fetch Notebook html
async function SentimentAnalysisHTML() {
  const response = await fetch('../assets/CustomerSatisfactionAnalysis.html');
  const html = await response.text();

  console.log(html);

  return html;

}

// PBI Report Template
async function PowerBIReport() {
    const html = 
    `
        <iframe 
            title="BussinessCustomerSentiment" 
            style="width: 100%; height: 100%;"
            src="https://app.powerbi.com/view?r=eyJrIjoiOWE0YTI4MjQtNDQwZS00ZDgwLThiNDUtODE3YjU1ODIxNDkzIiwidCI6IjdkNDYyMTE5LWZlNzctNGJmMi1hZTNiLTI5NzQwZTY4ZWZhMCIsImMiOjR9&pageName=d5a976c5097a73a3a129" 
            frameborder="0" 
            allowFullScreen="true"
        ></iframe>
        `

    return html
}

// DAX functions template
async function DAXFunctions() {
    const html = 
`
        <iframe 
            title="DAXfunctions" 
            style="width: 100%; height: 100%;"
            src="../assets/dax_functions.pdf" 
            frameborder="0" 
            allowFullScreen="true"
        ></iframe>
        `

    return html
}


// Fetch CSV 
async function DatasetHTML() {
  const response = await fetch('../assets/fact_customer_sentiment.htm');
  const html = await response.text();

  console.log(html);

  return html;

}



const data = [
    {
        title: "Power BI Report",
        htmlContent: PowerBIReport()
    },
    {
        title: "DAX Functions used in PBI Report",
        htmlContent: DAXFunctions()
        
    },
    {
        title: "Sentiment Analysis for PBI Report",
        htmlContent: SentimentAnalysisHTML()
    },
    {
        title: "Output - Sentiment Analysis Dataset",
        htmlContent: DatasetHTML()
    }
]

export default data;