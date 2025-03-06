//
// Copyright © 2023 by Neparth
//
//--------------------------------------------------------------------------------------------------------------------------------

function requests_multiples(postdata, url, data_preview, start, end, requestScheme, pagnitionScheme, noDataScheme, loadingScheme)
{
    postdata_original = postdata;

    const table = document.getElementById(data_preview).getElementsByTagName('tbody')[0];

    const paymentsTableRowsPreview = document.querySelectorAll(`[data-preview='${data_preview}-preview']`);
    consoleDebug(`paymentsTableRowsPreview: ${paymentsTableRowsPreview}`);

    if (paymentsTableRowsPreview.length > 0) 
    {
        paymentsTableRowsPreview.forEach(element => 
        {
            element.remove();
        });
        consoleDebug(`Removed ${paymentsTableRowsPreview.length} elements.`);
    } 

    let repeatedLoadingScheme = '';
    for (let i = 0; i < 10; i++) 
    {
        repeatedLoadingScheme += loadingScheme;
    }
    table.innerHTML += repeatedLoadingScheme;

    url = decodeHtmlEntities(url);
    data_preview = decodeHtmlEntities(data_preview);
    start = decodeHtmlEntities(start);
    end = decodeHtmlEntities(end);
    requestScheme = decodeHtmlEntities(requestScheme);
    pagnitionScheme = decodeHtmlEntities(pagnitionScheme);

    // Ensure postdata is an object
    if (typeof postdata === 'string')
    {
        postdata = JSON.parse(postdata);
    }

    const request_url = `https://${window.websiteID}/requests${url}`;
    consoleDebug(`Request URL: ${request_url}`);

    // Create URLSearchParams object
    const formData = new URLSearchParams();
    for (const key in postdata) 
    {
        if (postdata.hasOwnProperty(key)) 
        {
            formData.append(key, postdata[key]);
            consoleDebug(`Appending ${key}: ${postdata[key]}`);
        }
    }

    // Append start and end to formData
    formData.append('start', start);
    formData.append('end', end);
    consoleDebug(`Appending start: ${start}`);
    consoleDebug(`Appending end: ${end}`);

    consoleDebug(`Form Data: ${formData.toString()}`);

    fetch(request_url, 
    {
        method: "POST",
        headers: 
        {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    })
    .then(response => 
    {
        consoleDebug(`Response status: ${response.status}`);
        if (!response.ok) 
        {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => 
    {
        const delimiter = "//seperator//";
        const explodedArray = data.split(delimiter);

        consoleDebug(`Response data: ${explodedArray[0]}`);
        consoleDebug(`Response data: ${explodedArray[1]}`);

        found_counter = explodedArray[0].trim();

        consoleDebug(`Response data: ${found_counter}`);
        consoleDebug(data_preview);

        clearRows(`${data_preview}-preview`);

        if (found_counter != 0)
        {
            addNewRows(JSON.parse(explodedArray[1]), data_preview, requestScheme, noDataScheme, start);
        }

        let recursiveArray = 
        [
            encodeHtmlEntities(postdata_original),
            encodeHtmlEntities(url),
            encodeHtmlEntities(requestScheme),
            encodeHtmlEntities(pagnitionScheme),
            encodeHtmlEntities(noDataScheme),
            encodeHtmlEntities(loadingScheme),
        ];

        addPaginationRow(data_preview, start, end, found_counter, recursiveArray, pagnitionScheme, noDataScheme);
    })
    .catch(error => 
    {
        consoleDebug(`Error: ${error}`);
    })
    .finally(() => 
    {});
}

//--------------------------------------------------------------------------------------------------------------------------------