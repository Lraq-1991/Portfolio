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
            
        ), cte3 <span style="color: #0080ff; font-weight: bold;">AS</span>(    <span style="color: #7a7a7a;">-- Calculate days gap, avg total per customer and last order value</span>
            <div style = "margin-left: 2rem;">
                <div style="color: #0080ff; font-weight: bold;">SELECT DISTINCT</div> 
                    <div style = "margin-left: 2rem;">
                        <div>c2.CustomerID,</div>
                        <div>soh.OrderDate,</div>
                        <span style="color: #6b1cf3;">DATEDIFF</span>(
                            <div style = "margin-left: 2rem;">
                                <div>DAY,</div>
                                <span style="color: #6b1cf3;">LAG</span>(OrderDate, 1, OrderDate) <span style="color: #0080ff; font-weight: bold;">OVER</span>(
                                    <div><span style="color: #0080ff; font-weight: bold;">PARTITION BY</span> c2.CustomerID</div>
                                    <div><span style="color: #0080ff; font-weight: bold;">ORDER BY</span> soh.OrderDate</div>
                                ),
                                <div>soh.OrderDate</div>
                            </div>
                        ) DaysGap,  <span style="color: #7a7a7a;">-- Days gap between orders</span>
                        <div>soh.TotalDue,</div>
                        <div>
                            <span style="color: #6b1cf3;">AVG</span>(soh.TotalDue) <span style="color: #0080ff; font-weight: bold;">OVER</span>(
                            <span style="color: #0080ff; font-weight: bold;">PARTITION BY</span> c2.CustomerID
                            ) OrderAvg, 
                            <span style="color: #7a7a7a;">-- Avg order total value</span>
                        </div>
                        <span style="color: #6b1cf3;">LAST_VALUE</span>(soh.TotalDue) <span style="color: #0080ff; font-weight: bold;">OVER</span>(
                            <div>
                                <span style="color: #0080ff; font-weight: bold;">PARTITION BY</span> c2.CustomerID
                                <div></div>
                                <span style="color: #0080ff; font-weight: bold;">ORDER BY</span> soh.OrderDate
                                <div style="color: #0080ff; font-weight: bold;">ROWS BETWEEN UNBOUNDED PRECEDING AND UNBOUNDED FOLLOWING</div>
                            </div>
                        ) LastOrderValue
                    </div>
                    <span style="color: #0080ff; font-weight: bold;">FROM</span> cte2 c2
                    <div>
                        <span style="color: #0080ff; font-weight: bold;">JOIN</span> Sales.SalesOrderHeader soh
                    </div>
                    <div style = "margin-left: 2rem;">
                        <span style="color: #0080ff; font-weight: bold;">ON</span> c2.CustomerID = soh.CustomerID
                    </div>
            </div>
            )
        <div style="color: #0080ff; font-weight: bold;">SELECT</div> 
            <div style = "margin-left: 2rem;">
                <div>cte3.CustomerID,</div>
                <div>p.FirstName + <span style="color: #a5d6ff;">' '</span> + p.LastName Customer,</div>
                <div>cte3.OrderAvg - cte3.LastOrderValue AvgOrderGap,</div>
                <span style="color: #6b1cf3;">AVG</span>(cte3.DaysGap) AvgDayGap
            </div>
        <span style="color: #0080ff; font-weight: bold;">FROM</span> cte3
        <div>
            <span style="color: #0080ff; font-weight: bold;">JOIN</span> Sales.Customer sc
        </div>
        <div style = "margin-left: 2rem;">
            <span style="color: #0080ff; font-weight: bold;">ON</span> cte3.CustomerID = sc.CustomerID
        </div>
        <span style="color: #0080ff; font-weight: bold;">JOIN</span> Person.Person p
        <div style = "margin-left: 2rem;">
            <span style="color: #0080ff; font-weight: bold;">ON</span> sc.PersonID = p.BusinessEntityID
        </div>
        <div style="color: #0080ff; font-weight: bold;">GROUP BY</div> 
            <div style = "margin-left: 2rem;">
                <div>cte3.CustomerID,</div>
                <div>p.FirstName + <span style="color: #a5d6ff;">' '</span> + p.LastName,</div>
                <div>cte3.OrderAvg - cte3.LastOrderValue</div>
            </div>
        <span style="color: #0080ff; font-weight: bold;">ORDER BY</span> AvgDayGap <span style="color: #0080ff; font-weight: bold;">DESC</span>;
    `,
  query_output: `
<table border="1" class="dataframe table table-striped" st>
  <thead>
    <tr style="text-align: left; margin-left: 1rem; margin-right: 10px;">
      <th>CustomerID</th>
      <th>Customer</th>
      <th>OrderValueDeviation</th>
      <th>AvgDayGap</th>
    </tr>
  </thead>
  <tbody>
    <tr>
      <td>11244</td>
      <td>Alexis Coleman</td>
      <td>1308.8586</td>
      <td>222</td>
    </tr>
    <tr>
      <td>11239</td>
      <td>Latoya Goel</td>
      <td>1447.6909</td>
      <td>215</td>
    </tr>
    <tr>
      <td>11238</td>
      <td>Mayra Prasad</td>
      <td>1461.6194</td>
      <td>211</td>
    </tr>
    <tr>
      <td>11243</td>
      <td>Robin Alvarez</td>
      <td>1328.3232</td>
      <td>209</td>
    </tr>
    <tr>
      <td>11240</td>
      <td>Anne Hernandez</td>
      <td>1456.4977</td>
      <td>201</td>
    </tr>
    <tr>
      <td>12132</td>
      <td>Kaitlyn Henderson</td>
      <td>288.1884</td>
      <td>198</td>
    </tr>
    <tr>
      <td>12124</td>
      <td>Brandi Gill</td>
      <td>266.3911</td>
      <td>196</td>
    </tr>
    <tr>
      <td>12131</td>
      <td>Randall Dominguez</td>
      <td>203.4835</td>
      <td>192</td>
    </tr>
    <tr>
      <td>12301</td>
      <td>Nichole Nara</td>
      <td>265.2177</td>
      <td>185</td>
    </tr>
    <tr>
      <td>12332</td>
      <td>Andres Nara</td>
      <td>428.0908</td>
      <td>185</td>
    </tr>
    <tr>
      <td>12307</td>
      <td>Brad She</td>
      <td>276.8776</td>
      <td>180</td>
    </tr>
    <tr>
      <td>12308</td>
      <td>Margaret He</td>
      <td>249.5134</td>
      <td>180</td>
    </tr>
    <tr>
      <td>12321</td>
      <td>Rosa Hu</td>
      <td>270.8133</td>
      <td>180</td>
    </tr>
    <tr>
      <td>12333</td>
      <td>Terrance Rodriguez</td>
      <td>369.4622</td>
      <td>179</td>
    </tr>
    <tr>
      <td>12296</td>
      <td>Francisco Sara</td>
      <td>249.6062</td>
      <td>178</td>
    </tr>
    <tr>
      <td>12300</td>
      <td>Adriana Gonzalez</td>
      <td>216.0275</td>
      <td>175</td>
    </tr>
    <tr>
      <td>12323</td>
      <td>Lawrence Alonso</td>
      <td>403.2863</td>
      <td>172</td>
    </tr>
    <tr>
      <td>29672</td>
      <td>Takiko Collins</td>
      <td>314.6454</td>
      <td>167</td>
    </tr>
    <tr>
      <td>12650</td>
      <td>Aaron Wright</td>
      <td>287.3635</td>
      <td>157</td>
    </tr>
    <tr>
      <td>13405</td>
      <td>Ethan Bryant</td>
      <td>262.2413</td>
      <td>157</td>
    </tr>
    <tr>
      <td>12655</td>
      <td>Larry Vazquez</td>
      <td>295.6703</td>
      <td>154</td>
    </tr>
    <tr>
      <td>12632</td>
      <td>Bonnie Nath</td>
      <td>308.5795</td>
      <td>153</td>
    </tr>
    <tr>
      <td>13263</td>
      <td>Kate Anand</td>
      <td>294.7201</td>
      <td>150</td>
    </tr>
    <tr>
      <td>12631</td>
      <td>Clarence Gao</td>
      <td>392.1866</td>
      <td>147</td>
    </tr>
    <tr>
      <td>29800</td>
      <td>Brian Groth</td>
      <td>-2182.5936</td>
      <td>127</td>
    </tr>
    <tr>
      <td>29952</td>
      <td>Yuhong Li</td>
      <td>-1713.6656</td>
      <td>127</td>
    </tr>
    <tr>
      <td>30084</td>
      <td>Abe Tramel</td>
      <td>410.1137</td>
      <td>125</td>
    </tr>
    <tr>
      <td>30091</td>
      <td>Lynn Tsoflias</td>
      <td>12341.7398</td>
      <td>125</td>
    </tr>
    <tr>
      <td>14185</td>
      <td>Frank Vazquez</td>
      <td>-179.7718</td>
      <td>125</td>
    </tr>
    <tr>
      <td>14215</td>
      <td>Stacey Yang</td>
      <td>-528.5443</td>
      <td>117</td>
    </tr>
    <tr>
      <td>14071</td>
      <td>Jack Li</td>
      <td>-494.3224</td>
      <td>117</td>
    </tr>
    <tr>
      <td>29565</td>
      <td>Jimmy Bischoff</td>
      <td>-2335.8546</td>
      <td>114</td>
    </tr>
    <tr>
      <td>30058</td>
      <td>Mike Taylor</td>
      <td>1537.7515</td>
      <td>114</td>
    </tr>
    <tr>
      <td>29682</td>
      <td>Scott Cooper</td>
      <td>1596.6110</td>
      <td>114</td>
    </tr>
    <tr>
      <td>12297</td>
      <td>Felicia Blanco</td>
      <td>-433.6081</td>
      <td>113</td>
    </tr>
    <tr>
      <td>29494</td>
      <td>Samuel Agcaoili</td>
      <td>-1070.4233</td>
      <td>111</td>
    </tr>
    <tr>
      <td>29642</td>
      <td>Elizabeth Catalano</td>
      <td>13829.2942</td>
      <td>111</td>
    </tr>
    <tr>
      <td>29747</td>
      <td>Carolyn Farino</td>
      <td>2047.3072</td>
      <td>111</td>
    </tr>
    <tr>
      <td>29824</td>
      <td>Brenda Heaney</td>
      <td>10615.9046</td>
      <td>111</td>
    </tr>
    <tr>
      <td>29958</td>
      <td>Run Liu</td>
      <td>18402.2572</td>
      <td>111</td>
    </tr>
    <tr>
      <td>15710</td>
      <td>Brandy Rana</td>
      <td>321.0586</td>
      <td>107</td>
    </tr>
    <tr>
      <td>15924</td>
      <td>Omar Wang</td>
      <td>-527.4082</td>
      <td>106</td>
    </tr>
    <tr>
      <td>29599</td>
      <td>Shirley Bruner</td>
      <td>-253.4459</td>
      <td>106</td>
    </tr>
    <tr>
      <td>29847</td>
      <td>David Hodgson</td>
      <td>-278.3831</td>
      <td>106</td>
    </tr>
    <tr>
      <td>29875</td>
      <td>Jay Jamison</td>
      <td>-1187.8602</td>
      <td>106</td>
    </tr>
    <tr>
      <td>29640</td>
      <td>Pamela Carlson</td>
      <td>-78.9241</td>
      <td>106</td>
    </tr>
    <tr>
      <td>12657</td>
      <td>Audrey Blanco</td>
      <td>-670.7521</td>
      <td>105</td>
    </tr>
    <tr>
      <td>29915</td>
      <td>Andrew Kobylinski</td>
      <td>-14293.9398</td>
      <td>101</td>
    </tr>
    <tr>
      <td>30096</td>
      <td>Mary Vaca</td>
      <td>15273.9466</td>
      <td>101</td>
    </tr>
    <tr>
      <td>29842</td>
      <td>Mike Hines</td>
      <td>-16051.8112</td>
      <td>100</td>
    </tr>
    <tr>
      <td>29830</td>
      <td>Kari Hensien</td>
      <td>-2716.0903</td>
      <td>100</td>
    </tr>
    <tr>
      <td>29606</td>
      <td>Karren Burkhardt</td>
      <td>1548.1283</td>
      <td>100</td>
    </tr>
    <tr>
      <td>29622</td>
      <td>Henry Campen</td>
      <td>-7040.3509</td>
      <td>100</td>
    </tr>
    <tr>
      <td>29569</td>
      <td>Linda Burnett</td>
      <td>-304.9084</td>
      <td>100</td>
    </tr>
    <tr>
      <td>15920</td>
      <td>Colin Wu</td>
      <td>-273.4571</td>
      <td>99</td>
    </tr>
    <tr>
      <td>12390</td>
      <td>Denise Martinez</td>
      <td>1213.0762</td>
      <td>98</td>
    </tr>
    <tr>
      <td>15688</td>
      <td>Chase Gray</td>
      <td>-292.9678</td>
      <td>95</td>
    </tr>
    <tr>
      <td>13256</td>
      <td>Abby Subram</td>
      <td>-618.0487</td>
      <td>94</td>
    </tr>
    <tr>
      <td>15700</td>
      <td>Eugene Guo</td>
      <td>-273.4645</td>
      <td>93</td>
    </tr>
    <tr>
      <td>20860</td>
      <td>Preston Lopez</td>
      <td>17.6026</td>
      <td>93</td>
    </tr>
    <tr>
      <td>12461</td>
      <td>Ruth Suri</td>
      <td>1202.0409</td>
      <td>93</td>
    </tr>
    <tr>
      <td>12397</td>
      <td>Shaun Chapman</td>
      <td>1179.0933</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29487</td>
      <td>Humberto Acevedo</td>
      <td>6499.2543</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29500</td>
      <td>Anna Albright</td>
      <td>-9744.1572</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29503</td>
      <td>Gregory Alderson</td>
      <td>457.3411</td>
      <td>91</td>
    </tr>
    <tr>
      <td>13255</td>
      <td>Lance Blanco</td>
      <td>-607.5130</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29511</td>
      <td>Oscar Alpuerto</td>
      <td>14563.3931</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29508</td>
      <td>Marvin Allen</td>
      <td>-627.9747</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29492</td>
      <td>Jay Adams</td>
      <td>-16798.6997</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29619</td>
      <td>DeeDee Cameron</td>
      <td>594.3736</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29584</td>
      <td>Walter Brian</td>
      <td>682.0974</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29588</td>
      <td>Willie Brooks</td>
      <td>181.1959</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29590</td>
      <td>Jo Brown</td>
      <td>1387.8477</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29835</td>
      <td>Ronald Heymsfield</td>
      <td>321.2754</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29838</td>
      <td>Fran Highfill</td>
      <td>-233.2399</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29864</td>
      <td>Beth Inghram</td>
      <td>731.2832</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29867</td>
      <td>Erik Ismert</td>
      <td>-1311.4229</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29903</td>
      <td>Kevin Kennedy</td>
      <td>975.3302</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29644</td>
      <td>Brigid Cavendish</td>
      <td>186.3961</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29633</td>
      <td>Steve Carnes</td>
      <td>-819.4737</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29730</td>
      <td>Linda Ecoffey</td>
      <td>-4529.7908</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29691</td>
      <td>Jose Curry</td>
      <td>3216.8127</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29927</td>
      <td>Jeffrey Kung</td>
      <td>352.3296</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29968</td>
      <td>Helen Lutes</td>
      <td>-22588.3556</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29945</td>
      <td>Gloria Lesko</td>
      <td>13240.5044</td>
      <td>91</td>
    </tr>
    <tr>
      <td>29951</td>
      <td>Yan Li</td>
      <td>-3240.0791</td>
      <td>91</td>
    </tr>
    <tr>
      <td>30023</td>
      <td>Frank Miller</td>
      <td>783.6042</td>
      <td>91</td>
    </tr>
    <tr>
      <td>20861</td>
      <td>Nicolas Nara</td>
      <td>11.8603</td>
      <td>88</td>
    </tr>
    <tr>
      <td>12077</td>
      <td>Nicole Sandberg</td>
      <td>15.1164</td>
      <td>88</td>
    </tr>
    <tr>
      <td>12653</td>
      <td>Nichole Andersen</td>
      <td>-150.1075</td>
      <td>86</td>
    </tr>
    <tr>
      <td>12630</td>
      <td>Kevin Simmons</td>
      <td>-66.1086</td>
      <td>86</td>
    </tr>
    <tr>
      <td>29486</td>
      <td>Kim Abercrombie</td>
      <td>14802.8449</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29489</td>
      <td>Frances Adams</td>
      <td>-48259.6143</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29497</td>
      <td>François Ferrier</td>
      <td>-37403.3106</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29592</td>
      <td>Kevin Browne</td>
      <td>1175.1537</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29580</td>
      <td>Richard Bready</td>
      <td>-11552.1860</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29577</td>
      <td>Lester Bowman</td>
      <td>-1843.7699</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29620</td>
      <td>Joan Campbell</td>
      <td>1418.0924</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29614</td>
      <td>Ryan Calafato</td>
      <td>8963.2475</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29617</td>
      <td>Lindsey Camacho</td>
      <td>-50101.5379</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29509</td>
      <td>Michael Allen</td>
      <td>24968.8939</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29521</td>
      <td>Tom Johnston</td>
      <td>11637.6569</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29522</td>
      <td>Thomas Armstrong</td>
      <td>-14766.8751</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29523</td>
      <td>John Arthur</td>
      <td>19296.6197</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29531</td>
      <td>Cory Booth</td>
      <td>4057.9001</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29533</td>
      <td>Douglas Baldwin</td>
      <td>-1615.7073</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29570</td>
      <td>Michael Blythe</td>
      <td>-1452.0763</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29571</td>
      <td>Gabriel Bockenkamp</td>
      <td>7205.1795</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29539</td>
      <td>Josh Barnhill</td>
      <td>-1333.0332</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30042</td>
      <td>Ruby Sue Styles</td>
      <td>-415.8616</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29982</td>
      <td>Melissa Marple</td>
      <td>405.6784</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29992</td>
      <td>Sandra Maynard</td>
      <td>1751.3610</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29994</td>
      <td>Robin McGuigan</td>
      <td>4036.3110</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29950</td>
      <td>Yale Li</td>
      <td>-5583.5200</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29955</td>
      <td>David Liu</td>
      <td>-1195.3552</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29963</td>
      <td>Spencer Low</td>
      <td>-2366.6953</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29966</td>
      <td>Richard Lum</td>
      <td>12052.0724</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29938</td>
      <td>Frank Campbell</td>
      <td>-3424.8751</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30095</td>
      <td>Sunil Uppal</td>
      <td>-18130.7294</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30107</td>
      <td>Margaret Vanderkamp</td>
      <td>-23656.8812</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30117</td>
      <td>Robert Vessa</td>
      <td>7824.0238</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30076</td>
      <td>Diane Tibbott</td>
      <td>24121.0052</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30067</td>
      <td>Phyllis Thomas</td>
      <td>9792.5837</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29698</td>
      <td>Jacob Dean</td>
      <td>-2100.3969</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29702</td>
      <td>Aidan Delaney</td>
      <td>1409.5053</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29714</td>
      <td>Rudolph Dillon</td>
      <td>11228.1176</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29715</td>
      <td>Andrew Dixon</td>
      <td>-10463.1039</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29716</td>
      <td>Blaine Dockter</td>
      <td>29016.0407</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29731</td>
      <td>Carla Eldridge</td>
      <td>-1954.0696</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29724</td>
      <td>Bernard Duerr</td>
      <td>-2460.4270</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29705</td>
      <td>Della Demott Jr</td>
      <td>16686.6167</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29721</td>
      <td>Gary Drury</td>
      <td>-1155.7781</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29722</td>
      <td>Reuben D'sa</td>
      <td>6456.7416</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29757</td>
      <td>Garth Fort</td>
      <td>4558.0562</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29761</td>
      <td>Susan French</td>
      <td>732.5200</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29734</td>
      <td>Jauna Elson</td>
      <td>-11473.4442</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29637</td>
      <td>Donna Carreras</td>
      <td>4016.8392</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29639</td>
      <td>Joseph Castellucio</td>
      <td>16555.3755</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29646</td>
      <td>Stacey Cereghino</td>
      <td>8859.8580</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29685</td>
      <td>Pamela Cox</td>
      <td>4387.4949</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29690</td>
      <td>Conor Cunningham</td>
      <td>9619.0548</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29675</td>
      <td>Aaron Con</td>
      <td>2814.9716</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29669</td>
      <td>Jeanette Cole</td>
      <td>1442.4017</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29651</td>
      <td>Lee Chapla</td>
      <td>4906.4354</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29897</td>
      <td>Kay Krane</td>
      <td>744.1859</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29846</td>
      <td>Douglas Hite</td>
      <td>7434.3016</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29901</td>
      <td>John Kelly</td>
      <td>33226.2520</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29880</td>
      <td>Samuel Johnson</td>
      <td>13822.0820</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29888</td>
      <td>Brannon Jones</td>
      <td>10857.2626</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29865</td>
      <td>Lucio Iallo</td>
      <td>-1423.0520</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29844</td>
      <td>Nancy Hirota</td>
      <td>1198.2797</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29834</td>
      <td>Cheryl Herring</td>
      <td>-5293.3829</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29825</td>
      <td>James Hendergart</td>
      <td>-4735.5457</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29827</td>
      <td>Valerie Hendricks</td>
      <td>-8043.4497</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29810</td>
      <td>Jean Handley</td>
      <td>9647.0229</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29811</td>
      <td>Mark Hanson</td>
      <td>13534.5058</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29818</td>
      <td>Roger Harui</td>
      <td>-22983.6935</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29803</td>
      <td>Hattie Haemon</td>
      <td>4896.7982</td>
      <td>83</td>
    </tr>
    <tr>
      <td>29789</td>
      <td>Brian Goldstein</td>
      <td>4782.1026</td>
      <td>83</td>
    </tr>
    <tr>
      <td>30011</td>
      <td>Eric Meyer</td>
      <td>-2609.1758</td>
      <td>82</td>
    </tr>
    <tr>
      <td>30022</td>
      <td>Dylan Miller</td>
      <td>-904.9596</td>
      <td>82</td>
    </tr>
    <tr>
      <td>12444</td>
      <td>Mackenzie Phillips</td>
      <td>9.2598</td>
      <td>82</td>
    </tr>
    <tr>
      <td>12462</td>
      <td>Levi Suri</td>
      <td>1168.5847</td>
      <td>81</td>
    </tr>
    <tr>
      <td>12658</td>
      <td>Joy Gomez</td>
      <td>-154.9617</td>
      <td>81</td>
    </tr>
    <tr>
      <td>12807</td>
      <td>Nina Kumar</td>
      <td>1254.1343</td>
      <td>81</td>
    </tr>
    <tr>
      <td>29520</td>
      <td>Kyley Arbelaez</td>
      <td>210.8564</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29604</td>
      <td>Edward Buensalido</td>
      <td>392.5637</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29605</td>
      <td>Megan Burke</td>
      <td>9871.5959</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29587</td>
      <td>John Brooks</td>
      <td>8513.5691</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30018</td>
      <td>Virginia Miller</td>
      <td>92.4176</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30039</td>
      <td>Robert Stotka</td>
      <td>-1453.0892</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30000</td>
      <td>James McCoy</td>
      <td>-4156.4535</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29981</td>
      <td>Kathy Marcovecchio</td>
      <td>3887.0043</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29920</td>
      <td>Scott Konersmann</td>
      <td>-295.5750</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30065</td>
      <td>Karen Theisen</td>
      <td>-4153.4551</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30075</td>
      <td>Mike Tiano</td>
      <td>1854.4032</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30048</td>
      <td>Marcia Sultan</td>
      <td>-8557.2339</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30114</td>
      <td>Kevin Verboort</td>
      <td>1000.1333</td>
      <td>80</td>
    </tr>
    <tr>
      <td>30109</td>
      <td>Nieves Vargas</td>
      <td>12304.4543</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29795</td>
      <td>Lowell Graham</td>
      <td>-5986.1392</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29805</td>
      <td>Erin Hagens</td>
      <td>-2395.2436</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29772</td>
      <td>Janet Gates</td>
      <td>23989.2073</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29778</td>
      <td>Leo Giakoumakis</td>
      <td>1877.1057</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29783</td>
      <td>Mary Gimmi</td>
      <td>12289.4974</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29879</td>
      <td>Stephen Jiang</td>
      <td>601.8269</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29909</td>
      <td>Jim Kim</td>
      <td>4414.3177</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29654</td>
      <td>Yao-Qiang Cheng</td>
      <td>962.3767</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29658</td>
      <td>Mike Choi</td>
      <td>-6072.8483</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29689</td>
      <td>Scott Culp</td>
      <td>12566.3063</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29683</td>
      <td>Eva Corets</td>
      <td>5383.9865</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29647</td>
      <td>Baris Cetinok</td>
      <td>14678.4682</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29744</td>
      <td>John Evans</td>
      <td>-4437.2216</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29704</td>
      <td>Shawn Demicell</td>
      <td>5630.1194</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29692</td>
      <td>Thierry D'Hers</td>
      <td>6090.5434</td>
      <td>80</td>
    </tr>
    <tr>
      <td>29701</td>
      <td>Kirk DeGrasse</td>
      <td>8900.8188</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29707</td>
      <td>Helen Dennis</td>
      <td>17409.5667</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29709</td>
      <td>Bev Desalvo</td>
      <td>917.5090</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29712</td>
      <td>Holly Dickson</td>
      <td>-12219.9386</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29770</td>
      <td>Kathleen Garza</td>
      <td>-31268.4892</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29753</td>
      <td>Kathie Flood</td>
      <td>-483.9802</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29732</td>
      <td>Carol Elliott</td>
      <td>-6138.3584</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29616</td>
      <td>Barbara Calone</td>
      <td>15043.5765</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29627</td>
      <td>Johnny Caprio</td>
      <td>14687.1869</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29684</td>
      <td>Marlin Coriell</td>
      <td>7058.0681</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29677</td>
      <td>William Conner</td>
      <td>1734.6492</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29678</td>
      <td>Stephanie Conroy</td>
      <td>29.4634</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29635</td>
      <td>Rob Caron</td>
      <td>-785.8711</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29910</td>
      <td>Shane Kim</td>
      <td>-14767.0310</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29904</td>
      <td>Mary Kesslep</td>
      <td>-5677.4418</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29895</td>
      <td>Lori Kane</td>
      <td>17883.8037</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29896</td>
      <td>Judith Krane</td>
      <td>-15221.3369</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29891</td>
      <td>Diane Krane</td>
      <td>562.9313</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29822</td>
      <td>James Haugh</td>
      <td>1667.5949</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29856</td>
      <td>Joe Howard</td>
      <td>6475.7120</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29869</td>
      <td>Raman Iyer</td>
      <td>1556.0076</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29873</td>
      <td>Mary Alexander</td>
      <td>2054.7115</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29784</td>
      <td>Jeanie Glenn</td>
      <td>3212.4310</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29786</td>
      <td>James Glynn</td>
      <td>-17496.6423</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29780</td>
      <td>Frances Giglio</td>
      <td>4624.5797</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29781</td>
      <td>Guy Gilbert</td>
      <td>4050.1945</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29775</td>
      <td>Jim Geist</td>
      <td>-947.1461</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29809</td>
      <td>Kerim Hanif</td>
      <td>5819.1466</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29797</td>
      <td>Jane Greer</td>
      <td>1614.7182</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29798</td>
      <td>Geoff Grisso</td>
      <td>-5961.7059</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29792</td>
      <td>Abigail Gonzalez</td>
      <td>1225.7845</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29815</td>
      <td>Lucy Harrington</td>
      <td>1998.3918</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29816</td>
      <td>Keith Harris</td>
      <td>2688.1190</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29696</td>
      <td>Alvaro De Matos Miranda Filho</td>
      <td>-9630.7009</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29828</td>
      <td>Jay Henningsen</td>
      <td>18399.4673</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30112</td>
      <td>Patricia Vasquez</td>
      <td>30753.7944</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30113</td>
      <td>Raja Venugopal</td>
      <td>4536.2895</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30115</td>
      <td>Dora Verdad</td>
      <td>497.2241</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30118</td>
      <td>Caroline Vicknair</td>
      <td>2330.6696</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30094</td>
      <td>Sairaj Uddin</td>
      <td>9975.3611</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30103</td>
      <td>Mandy Vance</td>
      <td>21869.2801</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30105</td>
      <td>Gregory Vanderbout</td>
      <td>1897.7499</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30049</td>
      <td>Nate Sun</td>
      <td>-446.5454</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30050</td>
      <td>Krishna Sunkammurali</td>
      <td>-10989.4944</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30060</td>
      <td>Jeff Teper</td>
      <td>19952.5193</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30085</td>
      <td>Doris Traube</td>
      <td>-470.9378</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30055</td>
      <td>Julie Taft-Rider</td>
      <td>11534.0311</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29924</td>
      <td>Mitch Kennedy</td>
      <td>11197.3288</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29913</td>
      <td>Anton Kirilov</td>
      <td>2026.6125</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29919</td>
      <td>Eugene Kogan</td>
      <td>-12509.9707</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29929</td>
      <td>Jeffrey Kurtz</td>
      <td>-18480.2841</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29935</td>
      <td>Elsa Leavitt</td>
      <td>8701.3297</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29959</td>
      <td>Todd Logan</td>
      <td>-715.0940</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29962</td>
      <td>Sharon Looney</td>
      <td>-1879.6373</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29975</td>
      <td>Walter Mays</td>
      <td>3250.7524</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29956</td>
      <td>Jinghao Liu</td>
      <td>108.9323</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29957</td>
      <td>Kevin Liu</td>
      <td>15293.8485</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29947</td>
      <td>Judy Lew</td>
      <td>11160.9781</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29949</td>
      <td>George Li</td>
      <td>98.7779</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29983</td>
      <td>Cecelia Marshall</td>
      <td>1912.0028</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29985</td>
      <td>Linda Martin</td>
      <td>7039.5735</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29986</td>
      <td>Mindy Martin</td>
      <td>4649.3930</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29996</td>
      <td>Katie McAskill-White</td>
      <td>5402.1705</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29997</td>
      <td>Lola McCarthy</td>
      <td>19607.2522</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30007</td>
      <td>Raquel Mello</td>
      <td>1848.8153</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30037</td>
      <td>Jim Stewart</td>
      <td>2423.0395</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30043</td>
      <td>Min Su</td>
      <td>4761.7965</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30046</td>
      <td>Elizabeth Sullivan</td>
      <td>-16725.4628</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30019</td>
      <td>Matthew Miller</td>
      <td>1191.8158</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30009</td>
      <td>Tosh Meston</td>
      <td>5201.3374</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30026</td>
      <td>Scott Mitchell</td>
      <td>-767.0604</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30029</td>
      <td>Shanay Steelman</td>
      <td>4333.7186</td>
      <td>79</td>
    </tr>
    <tr>
      <td>30030</td>
      <td>Stefano Stefani</td>
      <td>552.0011</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29598</td>
      <td>Michael Brundage</td>
      <td>1537.8377</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29601</td>
      <td>Dirk Bruno</td>
      <td>17532.0698</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29618</td>
      <td>Gustavo Camargo</td>
      <td>7614.3294</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29579</td>
      <td>Cornelius Brandon</td>
      <td>97.3539</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29568</td>
      <td>Donald Blanton</td>
      <td>-112.7833</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29593</td>
      <td>Mary Browning</td>
      <td>1361.9929</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29535</td>
      <td>Wayne Banack</td>
      <td>-1337.1441</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29540</td>
      <td>Adam Barr</td>
      <td>3267.0312</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29528</td>
      <td>Stephen Ayers</td>
      <td>-13680.9381</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29543</td>
      <td>Karel Bates</td>
      <td>75.5432</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29544</td>
      <td>Shaun Beasley</td>
      <td>2856.0137</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29546</td>
      <td>Christopher Beck</td>
      <td>-16720.8834</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29574</td>
      <td>Randall Boseman</td>
      <td>194.8376</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29576</td>
      <td>Eli Bowen</td>
      <td>-668.1417</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29559</td>
      <td>Robert Bernacchi</td>
      <td>-11562.6150</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29560</td>
      <td>Matthias Berndt</td>
      <td>13343.0830</td>
      <td>79</td>
    </tr>
    <tr>
      <td>29499</td>
      <td>Amy Alberts</td>
      <td>16447.2265</td>
      <td>79</td>
    </tr>
    <tr>
      <td>13708</td>
      <td>Jennifer Bennett</td>
      <td>3.9144</td>
      <td>79</td>
    </tr>
    <tr>
      <td>12384</td>
      <td>Jacquelyn Gutierrez</td>
      <td>1223.2896</td>
      <td>79</td>
    </tr>
    <tr>
      <td>12634</td>
      <td>Derrick Ruiz</td>
      <td>-38.3363</td>
      <td>79</td>
    </tr>
    <tr>
      <td>12647</td>
      <td>Colleen Anand</td>
      <td>-70.6396</td>
      <td>78</td>
    </tr>
    <tr>
      <td>30047</td>
      <td>Michael Sullivan</td>
      <td>-4383.6058</td>
      <td>78</td>
    </tr>
    <tr>
      <td>29991</td>
      <td>Chris Maxwell</td>
      <td>-1314.0091</td>
      <td>78</td>
    </tr>
    <tr>
      <td>29826</td>
      <td>John Hanson</td>
      <td>-1035.8728</td>
      <td>78</td>
    </tr>
    <tr>
      <td>29626</td>
      <td>Jun Cao</td>
      <td>-1725.2202</td>
      <td>78</td>
    </tr>
    <tr>
      <td>29719</td>
      <td>Patricia Doyle</td>
      <td>-930.2883</td>
      <td>78</td>
    </tr>
    <tr>
      <td>12644</td>
      <td>Rachel Reed</td>
      <td>-100.0989</td>
      <td>77</td>
    </tr>
    <tr>
      <td>12637</td>
      <td>Leonard Nath</td>
      <td>-151.7761</td>
      <td>77</td>
    </tr>
    <tr>
      <td>15760</td>
      <td>Richard James</td>
      <td>-0.7293</td>
      <td>75</td>
    </tr>
    <tr>
      <td>12640</td>
      <td>Angel Richardson</td>
      <td>-157.2974</td>
      <td>74</td>
    </tr>
    <tr>
      <td>12530</td>
      <td>Isabel Coleman</td>
      <td>10.4920</td>
      <td>74</td>
    </tr>
    <tr>
      <td>12648</td>
      <td>Lori Dominguez</td>
      <td>-187.8580</td>
      <td>73</td>
    </tr>
    <tr>
      <td>12489</td>
      <td>Wayne Rai</td>
      <td>-33.6915</td>
      <td>73</td>
    </tr>
    <tr>
      <td>30008</td>
      <td>R. Morgan Mendoza</td>
      <td>-921.4103</td>
      <td>73</td>
    </tr>
    <tr>
      <td>11547</td>
      <td>Cindy Sai</td>
      <td>1197.6136</td>
      <td>71</td>
    </tr>
    <tr>
      <td>11480</td>
      <td>Colleen Ma</td>
      <td>1205.7206</td>
      <td>70</td>
    </tr>
    <tr>
      <td>11403</td>
      <td>Nancy Schmidt</td>
      <td>1230.9072</td>
      <td>70</td>
    </tr>
    <tr>
      <td>12645</td>
      <td>Audrey Ruiz</td>
      <td>-82.5363</td>
      <td>70</td>
    </tr>
    <tr>
      <td>12738</td>
      <td>Melinda Rubio</td>
      <td>1228.7814</td>
      <td>70</td>
    </tr>
    <tr>
      <td>15172</td>
      <td>Alexandra Hill</td>
      <td>-17.7988</td>
      <td>70</td>
    </tr>
    <tr>
      <td>12196</td>
      <td>Alexis Miller</td>
      <td>5.5057</td>
      <td>69</td>
    </tr>
    <tr>
      <td>11483</td>
      <td>Calvin Chande</td>
      <td>1232.5978</td>
      <td>69</td>
    </tr>
    <tr>
      <td>11642</td>
      <td>Morgan Hughes</td>
      <td>8.1703</td>
      <td>69</td>
    </tr>
    <tr>
      <td>12806</td>
      <td>Ronnie Zeng</td>
      <td>1228.7888</td>
      <td>68</td>
    </tr>
    <tr>
      <td>13253</td>
      <td>Carly Xie</td>
      <td>-154.5897</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29506</td>
      <td>Sean Jacobson</td>
      <td>4631.8456</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29502</td>
      <td>Paul Alcorn</td>
      <td>-100.8151</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29561</td>
      <td>John Berry</td>
      <td>-12958.8242</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29564</td>
      <td>Mary Billstrom</td>
      <td>11556.1849</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29556</td>
      <td>Scot Bent</td>
      <td>-2408.3253</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29542</td>
      <td>David Bartness</td>
      <td>143.1765</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29538</td>
      <td>Brenda Barlow</td>
      <td>-2374.3354</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29524</td>
      <td>Chris Ashton</td>
      <td>14104.1621</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29526</td>
      <td>John Ault</td>
      <td>299.6704</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29516</td>
      <td>Mae Anderson</td>
      <td>711.8075</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29517</td>
      <td>Ramona Antrim</td>
      <td>-2344.3368</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29519</td>
      <td>Hannah Arakawa</td>
      <td>-604.4784</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29595</td>
      <td>Bridget Browqett</td>
      <td>-1634.2468</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29597</td>
      <td>Dick Brummer</td>
      <td>445.8385</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29591</td>
      <td>Robert Brown</td>
      <td>-1152.4976</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29589</td>
      <td>Carolee Brown</td>
      <td>-8592.2962</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29567</td>
      <td>Jackie Blackwell</td>
      <td>-133.1588</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29615</td>
      <td>Mari Caldwell</td>
      <td>-1387.8970</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29602</td>
      <td>Nancy Buchanan</td>
      <td>446.8329</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29608</td>
      <td>Timothy Burnett</td>
      <td>5667.2811</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29609</td>
      <td>Stephen Burton</td>
      <td>-2163.4949</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30014</td>
      <td>Gary Meyerhoff</td>
      <td>5874.4548</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30015</td>
      <td>Ramesh Meyyappan</td>
      <td>-1698.5366</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30002</td>
      <td>Alejandro McGuel</td>
      <td>130.6901</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30005</td>
      <td>Nancy McPhearson</td>
      <td>-7030.2139</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29995</td>
      <td>Stacie Mcanich</td>
      <td>857.4591</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29987</td>
      <td>Frank Mart¡nez</td>
      <td>-13891.8410</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29984</td>
      <td>Benjamin Martin</td>
      <td>-393.5628</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30024</td>
      <td>Neva Mitchell</td>
      <td>2582.4469</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30035</td>
      <td>Alice Steiner</td>
      <td>-1966.8605</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30021</td>
      <td>Ben Miller</td>
      <td>1246.8934</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29977</td>
      <td>Kimberly Malmendier</td>
      <td>-1258.5126</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29979</td>
      <td>Parul Manek</td>
      <td>1675.8809</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29970</td>
      <td>Sharon Lynn</td>
      <td>280.8727</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29936</td>
      <td>Michael Lee</td>
      <td>827.0656</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29928</td>
      <td>Vamsi Kuppa</td>
      <td>-3509.7668</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29940</td>
      <td>Robertson Lee</td>
      <td>-12132.3100</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29941</td>
      <td>Jolie Lenehan</td>
      <td>3872.6706</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29942</td>
      <td>Roger Lengel</td>
      <td>12500.9360</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29918</td>
      <td>Kirk King</td>
      <td>437.3986</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29923</td>
      <td>Edward Kozlowski</td>
      <td>-3060.7729</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30070</td>
      <td>Kendra Thompson</td>
      <td>-10871.7348</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30073</td>
      <td>Rossane Thoreson</td>
      <td>185.2523</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30086</td>
      <td>Jean Trenary</td>
      <td>317.5803</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30061</td>
      <td>Chad Tedford</td>
      <td>1907.2656</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30063</td>
      <td>Vanessa Tench</td>
      <td>-2551.2132</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30059</td>
      <td>Denis Taylor</td>
      <td>4401.7600</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30051</td>
      <td>Brad Sutton</td>
      <td>-10343.7885</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30054</td>
      <td>Shelly Szymanski</td>
      <td>2937.6738</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30101</td>
      <td>Johnathan Van Eaton</td>
      <td>3841.1810</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30093</td>
      <td>Phyllis Tuffield</td>
      <td>-4609.4914</td>
      <td>68</td>
    </tr>
    <tr>
      <td>30116</td>
      <td>Wanda Vernon</td>
      <td>5397.2338</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29713</td>
      <td>Dick Dievendorff</td>
      <td>458.6223</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29693</td>
      <td>Ryan Danner</td>
      <td>5079.6075</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29694</td>
      <td>Mike Danseglio</td>
      <td>376.5400</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29725</td>
      <td>Tish Duff</td>
      <td>3481.2559</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29727</td>
      <td>Bart Duncan</td>
      <td>-7223.4615</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29723</td>
      <td>Ed Dudenhoefer</td>
      <td>149.8884</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29706</td>
      <td>Bruno Deniut</td>
      <td>-4566.6406</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29737</td>
      <td>John Emory</td>
      <td>-4702.5678</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29631</td>
      <td>Jane Carmichael</td>
      <td>-3068.2687</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29634</td>
      <td>Fernando Caro</td>
      <td>-100.7524</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29648</td>
      <td>Sean Chai</td>
      <td>564.8014</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29650</td>
      <td>Forrest Chandler</td>
      <td>400.0358</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29641</td>
      <td>Raul Casts</td>
      <td>20797.8525</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29643</td>
      <td>Matthew Cavallari</td>
      <td>-6498.4073</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29665</td>
      <td>James Clark</td>
      <td>1852.0052</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29666</td>
      <td>Jane Clayton</td>
      <td>-5528.9946</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29656</td>
      <td>Susan Chestnut</td>
      <td>-3518.4533</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29670</td>
      <td>Eric Coleman</td>
      <td>1738.1863</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29671</td>
      <td>Pat Coleman</td>
      <td>-103.0903</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29829</td>
      <td>Jeff Henshaw</td>
      <td>180.6853</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29814</td>
      <td>Kimberly Harrington</td>
      <td>2238.9739</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29817</td>
      <td>Doris Hartwig</td>
      <td>-943.4572</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29820</td>
      <td>Mark Hassall</td>
      <td>418.6937</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29776</td>
      <td>Barbara German</td>
      <td>-3566.6317</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29779</td>
      <td>Cornett Gibbens</td>
      <td>-2710.4998</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29874</td>
      <td>David Jaffe</td>
      <td>1518.1225</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29871</td>
      <td>Eric Jacobsen</td>
      <td>1989.2833</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29868</td>
      <td>Denean Ison</td>
      <td>915.4321</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29863</td>
      <td>Ryan Ihrig</td>
      <td>1782.1222</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29850</td>
      <td>Bob Hodges</td>
      <td>1117.8005</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29894</td>
      <td>John Kane</td>
      <td>-1001.8023</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29907</td>
      <td>Karan Khanna</td>
      <td>-5474.7643</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29911</td>
      <td>Tim Kim</td>
      <td>7348.8039</td>
      <td>68</td>
    </tr>
    <tr>
      <td>29899</td>
      <td>Kendall Keil</td>
      <td>654.7464</td>
      <td>68</td>
    </tr>
    <tr>
      <td>11723</td>
      <td>Luke Coleman</td>
      <td>-1.6288</td>
      <td>67</td>
    </tr>
    <tr>
      <td>12984</td>
      <td>Adam Young</td>
      <td>-20.9066</td>
      <td>67</td>
    </tr>
    <tr>
      <td>12430</td>
      <td>Kaitlyn Thompson</td>
      <td>8.0167</td>
      <td>66</td>
    </tr>
    <tr>
      <td>11738</td>
      <td>Elijah Alexander</td>
      <td>-59.2766</td>
      <td>65</td>
    </tr>
    <tr>
      <td>12742</td>
      <td>Samantha Martinez</td>
      <td>1142.7724</td>
      <td>65</td>
    </tr>
    <tr>
      <td>11425</td>
      <td>Ariana Gray</td>
      <td>-734.0390</td>
      <td>65</td>
    </tr>
    <tr>
      <td>12054</td>
      <td>Luke Diaz</td>
      <td>11.6422</td>
      <td>64</td>
    </tr>
    <tr>
      <td>11740</td>
      <td>Jan Hall</td>
      <td>29.6670</td>
      <td>63</td>
    </tr>
    <tr>
      <td>11868</td>
      <td>Jessica Peterson</td>
      <td>-48.7173</td>
      <td>63</td>
    </tr>
    <tr>
      <td>11432</td>
      <td>Dominique Prasad</td>
      <td>1031.0459</td>
      <td>63</td>
    </tr>
    <tr>
      <td>11242</td>
      <td>Larry Munoz</td>
      <td>-925.8972</td>
      <td>63</td>
    </tr>
    <tr>
      <td>13252</td>
      <td>Bianca Lu</td>
      <td>-62.4253</td>
      <td>63</td>
    </tr>
    <tr>
      <td>13251</td>
      <td>Raymond Malhotra</td>
      <td>-211.6818</td>
      <td>62</td>
    </tr>
    <tr>
      <td>11724</td>
      <td>Jason Carter</td>
      <td>-7.6820</td>
      <td>62</td>
    </tr>
    <tr>
      <td>29623</td>
      <td>Chris Cannon</td>
      <td>3328.6019</td>
      <td>61</td>
    </tr>
    <tr>
      <td>29547</td>
      <td>Benjamin Becker</td>
      <td>-415.8704</td>
      <td>61</td>
    </tr>
    <tr>
      <td>29926</td>
      <td>Deepak Kumar</td>
      <td>-415.8704</td>
      <td>61</td>
    </tr>
    <tr>
      <td>30036</td>
      <td>Liza Marie Stevens</td>
      <td>-27.4187</td>
      <td>61</td>
    </tr>
    <tr>
      <td>15507</td>
      <td>Hailey Campbell</td>
      <td>55.6920</td>
      <td>60</td>
    </tr>
    <tr>
      <td>11820</td>
      <td>Katelyn Lopez</td>
      <td>12.7760</td>
      <td>60</td>
    </tr>
    <tr>
      <td>12061</td>
      <td>Bryce Brooks</td>
      <td>22.1690</td>
      <td>60</td>
    </tr>
    <tr>
      <td>12202</td>
      <td>Xavier Ross</td>
      <td>-32.1251</td>
      <td>60</td>
    </tr>
    <tr>
      <td>13138</td>
      <td>Teresa Alonso</td>
      <td>3.3150</td>
      <td>59</td>
    </tr>
    <tr>
      <td>11241</td>
      <td>Lisa Cai</td>
      <td>-872.5020</td>
      <td>59</td>
    </tr>
    <tr>
      <td>11416</td>
      <td>Katrina Becker</td>
      <td>1208.5452</td>
      <td>59</td>
    </tr>
    <tr>
      <td>11417</td>
      <td>Lacey Zheng</td>
      <td>-897.4118</td>
      <td>58</td>
    </tr>
    <tr>
      <td>13411</td>
      <td>Jacquelyn Blanco</td>
      <td>-132.4970</td>
      <td>58</td>
    </tr>
    <tr>
      <td>11698</td>
      <td>Jackson Wright</td>
      <td>23.4237</td>
      <td>57</td>
    </tr>
    <tr>
      <td>11581</td>
      <td>Cindy Jordan</td>
      <td>-24.8979</td>
      <td>56</td>
    </tr>
    <tr>
      <td>11479</td>
      <td>Darryl Wu</td>
      <td>1218.7043</td>
      <td>56</td>
    </tr>
    <tr>
      <td>11420</td>
      <td>Jordan Turner</td>
      <td>-952.4217</td>
      <td>56</td>
    </tr>
    <tr>
      <td>16097</td>
      <td>Jessica Stewart</td>
      <td>-24.8110</td>
      <td>56</td>
    </tr>
    <tr>
      <td>12182</td>
      <td>Erin Torres</td>
      <td>7.5499</td>
      <td>55</td>
    </tr>
    <tr>
      <td>11802</td>
      <td>Madison Taylor</td>
      <td>11.9097</td>
      <td>55</td>
    </tr>
    <tr>
      <td>11439</td>
      <td>Janet Munoz</td>
      <td>-372.9726</td>
      <td>54</td>
    </tr>
    <tr>
      <td>17374</td>
      <td>Jason Diaz</td>
      <td>32.7374</td>
      <td>54</td>
    </tr>
    <tr>
      <td>13404</td>
      <td>Kelvin Yang</td>
      <td>-109.6756</td>
      <td>54</td>
    </tr>
    <tr>
      <td>13408</td>
      <td>Katherine Gonzales</td>
      <td>-142.5678</td>
      <td>54</td>
    </tr>
    <tr>
      <td>11712</td>
      <td>Shelby Rogers</td>
      <td>-4.8952</td>
      <td>53</td>
    </tr>
    <tr>
      <td>13254</td>
      <td>Beth Gomez</td>
      <td>-101.5797</td>
      <td>52</td>
    </tr>
    <tr>
      <td>13920</td>
      <td>Amanda Rogers</td>
      <td>-2.4615</td>
      <td>51</td>
    </tr>
    <tr>
      <td>11125</td>
      <td>Dana Navarro</td>
      <td>-6.3059</td>
      <td>51</td>
    </tr>
    <tr>
      <td>11922</td>
      <td>James Davis</td>
      <td>44.3326</td>
      <td>50</td>
    </tr>
    <tr>
      <td>14087</td>
      <td>Harold Garcia</td>
      <td>71.2835</td>
      <td>50</td>
    </tr>
    <tr>
      <td>13268</td>
      <td>Katherine Parker</td>
      <td>-45.3548</td>
      <td>50</td>
    </tr>
    <tr>
      <td>16358</td>
      <td>Samuel Jai</td>
      <td>19.8872</td>
      <td>50</td>
    </tr>
    <tr>
      <td>13407</td>
      <td>Cassandra Rana</td>
      <td>-195.2247</td>
      <td>49</td>
    </tr>
    <tr>
      <td>14307</td>
      <td>Ross Perez</td>
      <td>36.6307</td>
      <td>48</td>
    </tr>
    <tr>
      <td>16085</td>
      <td>Trevor Gonzales</td>
      <td>-26.2290</td>
      <td>48</td>
    </tr>
    <tr>
      <td>11402</td>
      <td>Kelli Cai</td>
      <td>1212.7189</td>
      <td>48</td>
    </tr>
    <tr>
      <td>11433</td>
      <td>Maurice Shan</td>
      <td>-256.8668</td>
      <td>47</td>
    </tr>
    <tr>
      <td>16964</td>
      <td>Gavin Wood</td>
      <td>23.4260</td>
      <td>47</td>
    </tr>
    <tr>
      <td>16870</td>
      <td>Andrea Morgan</td>
      <td>18.8734</td>
      <td>46</td>
    </tr>
    <tr>
      <td>13613</td>
      <td>Derek Jai</td>
      <td>29.9712</td>
      <td>46</td>
    </tr>
    <tr>
      <td>13144</td>
      <td>Destiny Stewart</td>
      <td>27.7659</td>
      <td>46</td>
    </tr>
    <tr>
      <td>11651</td>
      <td>Patricia Garcia</td>
      <td>26.2945</td>
      <td>45</td>
    </tr>
    <tr>
      <td>29845</td>
      <td>Rose Hirsch</td>
      <td>54.7432</td>
      <td>45</td>
    </tr>
    <tr>
      <td>14328</td>
      <td>Andrea Rogers</td>
      <td>-2.4731</td>
      <td>44</td>
    </tr>
    <tr>
      <td>11709</td>
      <td>Hailey Collins</td>
      <td>-5.2952</td>
      <td>43</td>
    </tr>
    <tr>
      <td>11401</td>
      <td>Linda Navarro</td>
      <td>1214.0007</td>
      <td>43</td>
    </tr>
    <tr>
      <td>11808</td>
      <td>James Parker</td>
      <td>-85.0320</td>
      <td>42</td>
    </tr>
    <tr>
      <td>13639</td>
      <td>Colin Liang</td>
      <td>-62.9997</td>
      <td>42</td>
    </tr>
    <tr>
      <td>13003</td>
      <td>Jill Hernandez</td>
      <td>-90.8863</td>
      <td>41</td>
    </tr>
    <tr>
      <td>12944</td>
      <td>Jose Jai</td>
      <td>-40.7828</td>
      <td>40</td>
    </tr>
    <tr>
      <td>11641</td>
      <td>James Chen</td>
      <td>25.8017</td>
      <td>40</td>
    </tr>
    <tr>
      <td>17027</td>
      <td>Brianna Taylor</td>
      <td>-9.4073</td>
      <td>40</td>
    </tr>
    <tr>
      <td>12165</td>
      <td>Caleb Flores</td>
      <td>36.3434</td>
      <td>39</td>
    </tr>
    <tr>
      <td>12372</td>
      <td>Darren Prasad</td>
      <td>33.9455</td>
      <td>39</td>
    </tr>
    <tr>
      <td>29676</td>
      <td>Peter Connelly</td>
      <td>-183.0969</td>
      <td>39</td>
    </tr>
    <tr>
      <td>29679</td>
      <td>Amy Consentino</td>
      <td>541.8322</td>
      <td>39</td>
    </tr>
    <tr>
      <td>12370</td>
      <td>Preston Perez</td>
      <td>-7.1383</td>
      <td>37</td>
    </tr>
    <tr>
      <td>12107</td>
      <td>Nathan Gonzales</td>
      <td>22.7381</td>
      <td>37</td>
    </tr>
    <tr>
      <td>14091</td>
      <td>Logan Thomas</td>
      <td>-16.2767</td>
      <td>37</td>
    </tr>
    <tr>
      <td>11150</td>
      <td>Russell Shen</td>
      <td>60.9407</td>
      <td>36</td>
    </tr>
    <tr>
      <td>12183</td>
      <td>Emily Robinson</td>
      <td>-51.2555</td>
      <td>35</td>
    </tr>
    <tr>
      <td>15559</td>
      <td>Devin Flores</td>
      <td>-31.0874</td>
      <td>34</td>
    </tr>
    <tr>
      <td>18314</td>
      <td>Eric Perry</td>
      <td>16.3503</td>
      <td>34</td>
    </tr>
    <tr>
      <td>29586</td>
      <td>David Brink</td>
      <td>-962.2166</td>
      <td>34</td>
    </tr>
    <tr>
      <td>29745</td>
      <td>Marc Faeber</td>
      <td>2197.8973</td>
      <td>34</td>
    </tr>
    <tr>
      <td>29812</td>
      <td>William Hapke</td>
      <td>335.2504</td>
      <td>34</td>
    </tr>
    <tr>
      <td>29837</td>
      <td>Onetha Higgs</td>
      <td>116.2673</td>
      <td>34</td>
    </tr>
    <tr>
      <td>15816</td>
      <td>Victoria Miller</td>
      <td>-8.0629</td>
      <td>33</td>
    </tr>
    <tr>
      <td>15863</td>
      <td>Adam Scott</td>
      <td>10.4128</td>
      <td>33</td>
    </tr>
    <tr>
      <td>12035</td>
      <td>Gerald Prasad</td>
      <td>27.3929</td>
      <td>32</td>
    </tr>
    <tr>
      <td>13185</td>
      <td>William Lee</td>
      <td>5.3703</td>
      <td>31</td>
    </tr>
    <tr>
      <td>18758</td>
      <td>Devin Price</td>
      <td>-35.4963</td>
      <td>31</td>
    </tr>
    <tr>
      <td>14723</td>
      <td>Andrew Smith</td>
      <td>-11.9341</td>
      <td>30</td>
    </tr>
    <tr>
      <td>14604</td>
      <td>Nicholas Rodriguez</td>
      <td>-36.4613</td>
      <td>30</td>
    </tr>
    <tr>
      <td>11748</td>
      <td>Blake Hill</td>
      <td>-16.8867</td>
      <td>29</td>
    </tr>
    <tr>
      <td>11719</td>
      <td>Blake Green</td>
      <td>33.3268</td>
      <td>29</td>
    </tr>
    <tr>
      <td>12006</td>
      <td>Richard Blue</td>
      <td>26.2511</td>
      <td>28</td>
    </tr>
    <tr>
      <td>13137</td>
      <td>Jacqueline Simmons</td>
      <td>-6.2507</td>
      <td>28</td>
    </tr>
    <tr>
      <td>13756</td>
      <td>Kaylee Young</td>
      <td>-27.4565</td>
      <td>28</td>
    </tr>
    <tr>
      <td>16950</td>
      <td>Connor Edwards</td>
      <td>-18.3578</td>
      <td>28</td>
    </tr>
    <tr>
      <td>14655</td>
      <td>Kayla Washington</td>
      <td>25.7686</td>
      <td>26</td>
    </tr>
    <tr>
      <td>11113</td>
      <td>Micheal Blanco</td>
      <td>31.6877</td>
      <td>26</td>
    </tr>
    <tr>
      <td>15418</td>
      <td>Angel Kelly</td>
      <td>-47.0399</td>
      <td>23</td>
    </tr>
    <tr>
      <td>11502</td>
      <td>Jared Peterson</td>
      <td>-38.4727</td>
      <td>22</td>
    </tr>
    <tr>
      <td>11500</td>
      <td>Sarah Simmons</td>
      <td>42.6550</td>
      <td>21</td>
    </tr>
    <tr>
      <td>11507</td>
      <td>Isabella Russell</td>
      <td>37.0575</td>
      <td>21</td>
    </tr>
    <tr>
      <td>11632</td>
      <td>Alexandra Jenkins</td>
      <td>-16.4086</td>
      <td>21</td>
    </tr>
    <tr>
      <td>11530</td>
      <td>Andrew Martinez</td>
      <td>-15.6110</td>
      <td>21</td>
    </tr>
    <tr>
      <td>11074</td>
      <td>Levi Arun</td>
      <td>24.7593</td>
      <td>21</td>
    </tr>
    <tr>
      <td>12678</td>
      <td>Dana Serrano</td>
      <td>23.0281</td>
      <td>21</td>
    </tr>
    <tr>
      <td>17119</td>
      <td>Isabella Harris</td>
      <td>-47.8760</td>
      <td>21</td>
    </tr>
    <tr>
      <td>12760</td>
      <td>Krista Gomez</td>
      <td>1.4641</td>
      <td>20</td>
    </tr>
    <tr>
      <td>12672</td>
      <td>Carson Butler</td>
      <td>-39.4117</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11078</td>
      <td>Gina Martin</td>
      <td>-73.2375</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11211</td>
      <td>Samantha Russell</td>
      <td>-25.7583</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11212</td>
      <td>Chloe Campbell</td>
      <td>10.6944</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11631</td>
      <td>Antonio Bennett</td>
      <td>-37.8587</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11660</td>
      <td>Miranda Gonzales</td>
      <td>-65.2348</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11506</td>
      <td>Nicholas Brown</td>
      <td>-28.9206</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11520</td>
      <td>Jada Morgan</td>
      <td>-75.7416</td>
      <td>20</td>
    </tr>
    <tr>
      <td>11519</td>
      <td>Jerome Navarro</td>
      <td>8.1099</td>
      <td>19</td>
    </tr>
    <tr>
      <td>11505</td>
      <td>Jasmine Powell</td>
      <td>3.2410</td>
      <td>19</td>
    </tr>
    <tr>
      <td>11498</td>
      <td>Arturo Sun</td>
      <td>34.3717</td>
      <td>19</td>
    </tr>
    <tr>
      <td>11142</td>
      <td>Eduardo Patterson</td>
      <td>20.6771</td>
      <td>19</td>
    </tr>
    <tr>
      <td>11019</td>
      <td>Luke Lal</td>
      <td>-13.8639</td>
      <td>19</td>
    </tr>
    <tr>
      <td>11501</td>
      <td>Brandy Chandra</td>
      <td>51.4550</td>
      <td>18</td>
    </tr>
    <tr>
      <td>11619</td>
      <td>Sierra Young</td>
      <td>39.4346</td>
      <td>18</td>
    </tr>
    <tr>
      <td>11203</td>
      <td>Luis Diaz</td>
      <td>47.7060</td>
      <td>17</td>
    </tr>
    <tr>
      <td>11215</td>
      <td>Ana Perry</td>
      <td>47.4948</td>
      <td>17</td>
    </tr>
    <tr>
      <td>11253</td>
      <td>José Hernandez</td>
      <td>-7.1294</td>
      <td>17</td>
    </tr>
    <tr>
      <td>12993</td>
      <td>Xavier Henderson</td>
      <td>3.4181</td>
      <td>17</td>
    </tr>
    <tr>
      <td>16958</td>
      <td>Pedro Torres</td>
      <td>45.3344</td>
      <td>17</td>
    </tr>
    <tr>
      <td>17387</td>
      <td>Aidan Alexander</td>
      <td>-5.0315</td>
      <td>13</td>
    </tr>
    <tr>
      <td>11276</td>
      <td>Nancy Chapman</td>
      <td>-35.7640</td>
      <td>13</td>
    </tr>
    <tr>
      <td>11331</td>
      <td>Samantha Jenkins</td>
      <td>11.3303</td>
      <td>13</td>
    </tr>
    <tr>
      <td>11287</td>
      <td>Henry Garcia</td>
      <td>-50.5485</td>
      <td>13</td>
    </tr>
    <tr>
      <td>11566</td>
      <td>April Shan</td>
      <td>4.4235</td>
      <td>13</td>
    </tr>
    <tr>
      <td>11711</td>
      <td>Daniel Davis</td>
      <td>-24.4197</td>
      <td>13</td>
    </tr>
    <tr>
      <td>11300</td>
      <td>Fernando Barnes</td>
      <td>-60.1068</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11330</td>
      <td>Ryan Thompson</td>
      <td>18.8922</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11277</td>
      <td>Charles Jackson</td>
      <td>23.0699</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11262</td>
      <td>Jennifer Simmons</td>
      <td>7.4521</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11223</td>
      <td>Hailey Patterson</td>
      <td>-5.3441</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11091</td>
      <td>Dalton Perez</td>
      <td>14.9131</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11176</td>
      <td>Mason Roberts</td>
      <td>24.4792</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11185</td>
      <td>Ashley Henderson</td>
      <td>-21.6654</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11200</td>
      <td>Jason Griffin</td>
      <td>57.3597</td>
      <td>12</td>
    </tr>
    <tr>
      <td>11059</td>
      <td>Ashlee Andersen</td>
      <td>15.4552</td>
      <td>8</td>
    </tr>
    <tr>
      <td>17026</td>
      <td>Jordan Li</td>
      <td>-2.5747</td>
      <td>6</td>
    </tr>
    <tr>
      <td>14353</td>
      <td>Erin Reed</td>
      <td>30.9031</td>
      <td>6</td>
    </tr>
    <tr>
      <td>14370</td>
      <td>Meghan Dominguez</td>
      <td>-37.7100</td>
      <td>4</td>
    </tr>
    <tr>
      <td>16247</td>
      <td>Anna Brown</td>
      <td>-15.4811</td>
      <td>3</td>
    </tr>
  </tbody>
</table>
    `,
};

export default query1;
