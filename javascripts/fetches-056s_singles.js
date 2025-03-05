 //
// Copyright © 2023 by Neparth
//
//--------------------------------------------------------------------------------------------------------------------------------

function requests_singles(postdata, url, data_preview, requestScheme, loadingScheme)
{
    const table = document.getElementById(data_preview);
    table.innerHTML = loadingScheme;

    const request_url = `https://${window.websiteID}/requests${url}`;
    consoleDebug(`Request URL: ${request_url}`);

    // Parse postdata if it's a string
    if (typeof postdata === 'string') {
        try {
            postdata = JSON.parse(postdata);
        } catch (e) {
            consoleDebug(`Invalid JSON string: ${postdata}`);
            return;
        }
    }

    consoleDebug(`Postdata: ${JSON.stringify(postdata)}`);

    // Create URLSearchParams object
    const formData = new URLSearchParams();
    for (const key in postdata) {
        if (postdata.hasOwnProperty(key)) {
            formData.append(key, postdata[key]);
            consoleDebug(`Appending ${key}: ${postdata[key]}`);
        }
    }

    consoleDebug(`Form Data: ${formData.toString()}`);

    fetch(request_url, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formData
    })
    .then(response =>
    {
        consoleDebug(`Response status: ${response.status}`);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.text();
    })
    .then(data => 
    {
        JSON.parse(data).forEach(requestData =>
        {
            let modifiedRequestScheme = requestScheme;

            modifiedRequestScheme = modifiedRequestScheme.replace(/\$\{requestData\.(\w+)\}/g, (match, p1) =>
            {
                return requestData[p1] !== undefined ? requestData[p1] : match;
            });

            table.innerHTML = modifiedRequestScheme;
        });
    })
    .catch(error => {
        consoleDebug(`Error: ${error}`);
    })
    .finally(() => {});
}

//--------------------------------------------------------------------------------------------------------------------------------