(async () => {
    const meta = document.querySelector('meta[name="bmstable"]');
    const headerURL = meta ? meta.content : 'dpbms/head.json';

    const resHeader = await fetch(headerURL);
    const header = await resHeader.json();

    console.log("Loaded header:", header);

    // Get base path from head.json URL
    const baseURL = new URL(headerURL, window.location.href);
    const basePath = baseURL.href.substring(0, baseURL.href.lastIndexOf('/') + 1);

    // Resolve data_url relative to head.json's location
    const dataURL = new URL(header.data_url, basePath);

    const resData = await fetch(dataURL);
    const charts = await resData.json();

    if (!Array.isArray(charts)) throw new Error('Expected chart list to be an array');

    const grouped = {};
    for (const chart of charts) {
        const lvl = chart.level;
        if (!grouped[lvl]) grouped[lvl] = [];
        grouped[lvl].push(chart);
    }

    const tbody = document.querySelector("#bms-table tbody");
    for (const level of Object.keys(grouped).sort((a, b) => {
        if (a === '?') return 1;
        if (b === '?') return -1;
        return parseInt(a) - parseInt(b);
    })) {
        const chartsAtLevel = grouped[level];

        // Section header row
        const rowHead = document.createElement("tr");
        rowHead.className = "level-header";
        rowHead.innerHTML = `<th colspan="6">(=^･ω･^)${level} <span style="font-weight: normal;">(${chartsAtLevel.length} songs)</span></th>`;
        tbody.appendChild(rowHead);

        // Column titles
        const colHeader = document.createElement("tr");
        colHeader.className = "column-header";
        colHeader.innerHTML = `
          <th>Level</th>
          <th>Title</th>
          <th>Artist</th>
          <th>Genre</th>          
          <th>BPM</th>
          <th>Comment</th>
        `;
        tbody.appendChild(colHeader);

        // Song rows
        chartsAtLevel
            .sort((a, b) => a.title.localeCompare(b.title))
            .forEach((chart, i) => {
                const row = document.createElement("tr");
                row.style.backgroundColor = i % 2 === 0 ? "#ffe0e0" : "#eebdbd";
                row.innerHTML = `
                  <td>${chart.level}</td>
                  <td><a href="http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=${chart.md5}" target="_blank">${chart.title}</a></td>
                  <td>${chart.artist || ''}</td>
                  <td>${chart.genre || ''}</td>
                  <td>${chart.bpm || ''}</td>
                  <td>${chart.comment || ''}</td>
                `;
                tbody.appendChild(row);
            });
    }
})();
