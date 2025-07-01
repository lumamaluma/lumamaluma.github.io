(async () => {
    const meta = document.querySelector('meta[name="bmstable"]');
    const headerURL = meta ? meta.content : 'dpbms/head.json';

    const resHeader = await fetch(headerURL);
    const header = await resHeader.json();

    const baseURL = new URL(headerURL, window.location.href);
    const basePath = baseURL.href.substring(0, baseURL.href.lastIndexOf('/') + 1);

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
        rowHead.innerHTML = `<th colspan="8">(=^･ω･^)${level} <span style="font-weight: normal;">(${chartsAtLevel.length} songs)</span></th>`;
        tbody.appendChild(rowHead);

        // Column titles
        const colHeader = document.createElement("tr");
        colHeader.className = "column-header";
        colHeader.innerHTML = `
          <th>LV</th>
          <th>♪</th>
          <th>IR</th>
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

                const lr2irURL = `http://www.dream-pro.info/~lavalse/LR2IR/search.cgi?mode=ranking&bmsmd5=${chart.md5}`;
                const mochaURL = chart.sha256
                    ? `https://mocha-repository.info/song.php?sha256=${chart.sha256}`
                    : null;
                const minirURL = chart.sha256
                    ? `https://www.gaftalk.com/minir/#/viewer/song/${chart.sha256}/0`
                    : null;

                const irLinks = [`<a href="${lr2irURL}" target="_blank">LR2</a>`];
                if (mochaURL) irLinks.push(`<a href="${mochaURL}" target="_blank">Mocha</a>`);
                if (minirURL) irLinks.push(`<a href="${minirURL}" target="_blank">MinIR</a>`);

                row.innerHTML = `
                  <td>${chart.level}</td>
                  <td><a href="https://bms-score-viewer.pages.dev/view?md5=${chart.md5}" target="_blank">♪</a></td>
                  <td>${irLinks.join(" ")}</td>
                  <td>${chart.title || ''}</td>
                  <td>${chart.artist || ''}</td>
                  <td>${chart.genre || ''}</td>
                  <td>${chart.bpm || ''}</td>
                  <td>${chart.comment || ''}</td>
                `;
                tbody.appendChild(row);
            });
    }
})();
