const query1 = {
  tittle: "Customer Retention and Churn Analysis",
  query_text: `
        <div style="color: #7a7a7a;">/*
            <div style="margin-left: 3rem;">
                The Challenge: Identify "at-risk" customers.<br><br> 

                Find all customers who made at least three purchases in 2013<br> 
                but have not placed an order in the last six months of the available data.<br> 
                For these customers, calculate the average time gap (in days)<br> 
                between their orders and the difference between their last order total<br> 
                and their lifetime average order value.<br>
            </div>
        */</div><br>

        <div style="color: #7a7a7a;">-- USE AdventureWorks2022</div><br>

        <div style="color: #0080ff; font-weight: bold;">DECLARE</div>
            &emsp;&emsp;@LastDate DATETIME;
        <div>
        <br>
            <span style="color: #0080ff; font-weight: bold;">SELECT TOP</span> (1)
        </div> 
            &emsp;&emsp;@LastDate = <span style="color: #6b1cf3;">LAST_VALUE</span>(OrderDate) <span style="color: #0080ff; font-weight: bold;">OVER</span>
            (
            <div>
                &emsp;&emsp;&emsp;<span style="color: #0080ff; font-weight: bold;">ORDER BY</span> OrderDate
            </div>
            &emsp;&emsp;)
        <div>
            <span style="color: #0080ff; font-weight: bold;">FROM</span> Sales.SalesOrderHeader;
        </div>
        <br>
        <div>
            <span style="color: #0080ff; font-weight: bold;">WITH</span> cte1 <span style="color: #0080ff; font-weight: bold;">AS</span> (  
            <span style="color: #7a7a7a;">  -- Extract necessary columns to make the next calculations</span> 
        </div>
        <div style="margin-left: 2rem;">
               <span style="color: #0080ff; font-weight: bold;">SELECT</span>  
                <div style="margin-left: 2rem;">
                    <ul>
                        <li><span style="color: #6b1cf3;">YEAR </span>(OrderDate) OrderYear,</li>
                        <li>OrderDate,</li>
                        <li>SalesOrderID,</li>
                        <li>CustomerID,</li>
                        <li><span style="color: #6b1cf3;">DATEDIFF</span>(MONTH, @LastDate, OrderDate) LastOrderGap</li>
                    </ul>
                </div>
                <div>
                    <span style="color: #0080ff; font-weight: bold;">FROM</span> Sales.SalesOrderHeader
                </div>
        </div>
        ), cte2 <span style="color: #0080ff; font-weight: bold;">AS </span>( <span style="color: #7a7a7a;">  -- Filter records with 6 months from last purchase, from 2013 and at least 3 purchases </span>
            <div style="margin-left: 2rem;">
                <div style="color: #0080ff; font-weight: bold;">SELECT</div> 
                <ul style="margin-left: 2rem;">
                    <li>OrderYear,</li>
                    <li>CustomerID,</li>
                    <li><span style="color: #6b1cf3;">COUNT</span>(<span style="color: #0080ff; font-weight: bold;">DISTINCT</span> SalesOrderID) Purchases</li> 
                </ul>
                <span style="color: #0080ff; font-weight: bold;">FROM</span> cte1<br>
                <span style="color: #0080ff; font-weight: bold;">WHERE</span> LastOrderGap >= 6
                <div>
                    <span style="color: #0080ff; font-weight: bold;">&emsp;&emsp;AND</span> OrderYear = 2013
                </div>
                <div style="color: #0080ff; font-weight: bold;">GROUP BY</div> 
                <ul style="margin-left: 2rem;">
                    <li>OrderYear,</li>
                    <li>CustomerID</li>
                </ul>
                <div>
                    <span style="color: #0080ff; font-weight: bold;">HAVING </span> <span style="color: #6b1cf3;">COUNT</span>(<span style="color: #0080ff; font-weight: bold;">DISTINCT</span> SalesOrderID) >= 3 <span style="color: #7a7a7a;">-- This filter is applied after WHERE clause</span>
                </div>
            </div>
            ////////////////////////////////////////////////////////////////////////////////////////
            
        ), cte3 <div style="color: #0080ff; font-weight: bold;">AS</div>(    <div style="color: #7a7a7a;">-- Calculate days gap, avg total per customer and last order value</div>
            <div style="color: #0080ff; font-weight: bold;">SELECT DISTINCT</div> 
                c2.CustomerID,
                soh.OrderDate,
                <div style="color: #6b1cf3;">DATEDIFF</div>(
                    DAY,
                    <div style="color: #6b1cf3;">LAG</div>(OrderDate, 1, OrderDate) <div style="color: #0080ff; font-weight: bold;">OVER</div>(
                        <div style="color: #0080ff; font-weight: bold;">PARTITION BY</div> c2.CustomerID
                        <div style="color: #0080ff; font-weight: bold;">ORDER BY</div> soh.OrderDate
                    ),
                    soh.OrderDate
                ) DaysGap,  <div style="color: #7a7a7a;">-- Days gap between orders</div>
                soh.TotalDue,
                <div style="color: #6b1cf3;">AVG</div>(soh.TotalDue) <div style="color: #0080ff; font-weight: bold;">OVER</div>(
                    <div style="color: #0080ff; font-weight: bold;">PARTITION BY</div> c2.CustomerID
                ) OrderAvg, <div style="color: #7a7a7a;">-- Avg order total value</div>
                <div style="color: #6b1cf3;">LAST_VALUE</div>(soh.TotalDue) <div style="color: #0080ff; font-weight: bold;">OVER</div>(
                    <div style="color: #0080ff; font-weight: bold;">PARTITION BY</div> c2.CustomerID
                    <div style="color: #0080ff; font-weight: bold;">ORDER BY</div> soh.OrderDate
                    <div style="color: #0080ff; font-weight: bold;">ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</div>
                ) LastOrderValue
            <div style="color: #0080ff; font-weight: bold;">FROM</div> cte2 c2
            <div style="color: #0080ff; font-weight: bold;">JOIN</div> Sales.SalesOrderHeader soh
                <div style="color: #0080ff; font-weight: bold;">ON</div> c2.CustomerID = soh.CustomerID
        )
        <div style="color: #0080ff; font-weight: bold;">SELECT</div> 
            cte3.CustomerID,
            p.FirstName + <div style="color: #a5d6ff;">' '</div> + p.LastName Customer,
            cte3.OrderAvg - cte3.LastOrderValue OrderValueDeviation,
            <div style="color: #6b1cf3;">AVG</div>(cte3.DaysGap) AvgDayGap
        <div style="color: #0080ff; font-weight: bold;">FROM</div> cte3
        <div style="color: #0080ff; font-weight: bold;">JOIN</div> Sales.Customer sc
            <div style="color: #0080ff; font-weight: bold;">ON</div> cte3.CustomerID = sc.CustomerID
        <div style="color: #0080ff; font-weight: bold;">JOIN</div> Person.Person p
            <div style="color: #0080ff; font-weight: bold;">ON</div> sc.PersonID = p.BusinessEntityID
        <div style="color: #0080ff; font-weight: bold;">GROUP BY</div> 
            cte3.CustomerID,
            p.FirstName + <div style="color: #a5d6ff;">' '</div> + p.LastName,
            cte3.OrderAvg - cte3.LastOrderValue
        <div style="color: #0080ff; font-weight: bold;">ORDER BY</div> AvgDayGap <div style="color: #0080ff; font-weight: bold;">DESC</div>;
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
