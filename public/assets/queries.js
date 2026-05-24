const query1 = {
  tittle: "Query 1",
  query_text: `
        <div style="color: #7a7a7a;">/*
            Multi-Year Customer Retention (Cohort Analysis)

            The Challenge: Group customers into "Cohorts" based on the year of their first purchase. 
            For each cohort, track their total spending year-over-year. 
            The final output should be pivoted so that rows are the "Join Year" 
            and columns are "Year 1 Total," "Year 2 Total," etc., showing how much revenue each cohort generated as they aged.
        */</div><br>

        <div style="color: #7a7a7a; font-weight: bold;">-- USE AdventureWorks2022</div>

        <div style="color: #ff7b72; font-weight: bold;">WITH</div> cte <div style="color: #ff7b72; font-weight: bold;">AS</div>( <div style="color: #7a7a7a;">-- Extract Joined Year, Year of each order and amount spent</div>
            <div style="color: #ff7b72; font-weight: bold;">SELECT</div> 
                <div style="color: #d4bbff;">YEAR</div>(<div style="color: #d4bbff;">FIRST_VALUE</div>(OrderDate) <div style="color: #ff7b72; font-weight: bold;">OVER</div>(
                    <div style="color: #ff7b72; font-weight: bold;">PARTITION BY</div> CustomerID
                    <div style="color: #ff7b72; font-weight: bold;">ORDER BY</div> OrderDate
                    <div style="color: #ff7b72; font-weight: bold;">ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</div>
                )) JoinYear,
                <div style="color: #d4bbff;">YEAR</div>(OrderDate) OrderYear,
                TotalDue
            <div style="color: #ff7b72; font-weight: bold;">FROM</div> Sales.SalesOrderHeader
        )
        <div style="color: #ff7b72; font-weight: bold;">SELECT</div> <div style="color: #7a7a7a;">-- Create matrix with Join Year as rows and Order year as columns, NULL values were replaced with 0</div>
            JoinYear <div style="color: #ff7b72; font-weight: bold;">AS</div> <div style="color: #a5d6ff;">"Join Year"</div>,
            <div style="color: #d4bbff;">ISNULL</div>([2011],0) <div style="color: #ff7b72; font-weight: bold;">AS</div> <div style="color: #a5d6ff;">"Total Purchase 2011 $"</div>,
            <div style="color: #d4bbff;">ISNULL</div>([2012],0) <div style="color: #ff7b72; font-weight: bold;">AS</div> <div style="color: #a5d6ff;">"Total Purchase 2012 $"</div>,
            <div style="color: #d4bbff;">ISNULL</div>([2013],0) <div style="color: #ff7b72; font-weight: bold;">AS</div> <div style="color: #a5d6ff;">"Total Purchase 2013 $"</div>,
            <div style="color: #d4bbff;">ISNULL</div>([2014],0) <div style="color: #ff7b72; font-weight: bold;">AS</div> <div style="color: #a5d6ff;">"Total Purchase 2014 $"</div>
        <div style="color: #ff7b72; font-weight: bold;">FROM</div> cte SourceQuery
        <div style="color: #ff7b72; font-weight: bold;">PIVOT</div>(
            <div style="color: #d4bbff;">SUM</div>(TotalDue) <div style="color: #ff7b72; font-weight: bold;">FOR</div> OrderYear
            <div style="color: #ff7b72; font-weight: bold;">IN</div> ([2011],[2012],[2013],[2014])
        ) PivotTable
        <div style="color: #ff7b72; font-weight: bold;">ORDER BY</div>
    `,
  query_output: `
    <table border="1" class="border-separate border border-gray-400">
    <thead class="mx-2">
        <tr style="text-align: right;">
        <th>Join Year</th>
        <th>Total Purchase 2011 $</th>
        <th>Total Purchase 2012 $</th>
        <th>Total Purchase 2013 $</th>
        <th>Total Purchase 2014 $</th>
        </tr>
    </thead>
    <tbody>
        <tr>
        <td>2011</td>
        <td>14155699.525</td>
        <td>1.764712e+07</td>
        <td>1.206206e+07</td>
        <td>3962319.3134</td>
        </tr>
        <tr>
        <td>2012</td>
        <td>0.000</td>
        <td>2.002858e+07</td>
        <td>1.865622e+07</td>
        <td>7384772.3180</td>
        </tr>
        <tr>
        <td>2013</td>
        <td>0.000</td>
        <td>0.000000e+00</td>
        <td>1.824760e+07</td>
        <td>7844370.2472</td>
        </tr>
        <tr>
        <td>2014</td>
        <td>0.000</td>
        <td>0.000000e+00</td>
        <td>0.000000e+00</td>
        <td>3228036.4371</td>
        </tr>
    </tbody>
    </table>
    `,
};

export default query1;
