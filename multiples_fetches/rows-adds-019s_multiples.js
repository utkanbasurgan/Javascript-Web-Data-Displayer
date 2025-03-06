//
// Copyright © 2023 by Neparth
//
//--------------------------------------------------------------------------------------------------------------------------------

function addNewRows(data, data_preview, requestScheme, noDataScheme, start) 
{
    const table = document.getElementById(data_preview).getElementsByTagName('tbody')[0];

    if (data.length === 0) 
    {
        table.innerHTML = noDataScheme;
        consoleDebug(`No data available. Applied noDataScheme.`);
    } 
    else 
    {
        let order = start; // Initialize order with the start value

        data.forEach(requestData => 
        {
            let modifiedRequestScheme = requestScheme;

            // Assign order to requestData.order
            requestData.order = order++;

            // Use regular expression to find all placeholders ${requestData.X}
            modifiedRequestScheme = modifiedRequestScheme.replace(/\$\{requestData\.(\w+)\}/g, (match, p1) => 
            {
                return requestData[p1] !== undefined ? requestData[p1] : match;
            });

            modifiedRequestScheme = modifiedRequestScheme.replace('${data_preview}', data_preview + "-preview");

            // Append the modified template to the table
            table.innerHTML += modifiedRequestScheme;
        });

        consoleDebug(`Added ${data.length} new rows.`);
    }
}

//--------------------------------------------------------------------------------------------------------------------------------