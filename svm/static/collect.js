const submitButton = document.getElementById("submit-btn");
const monitorResultTable = document.getElementById("monitor-results");

function postRecord(record) {
  return new Promise(async (resolve) => {
    const result = await fetch("/logs", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ record }),
    });
    resolve();
  });
}

setTimeout(async () => {
  const R_BG = result.getAttribute("data-r_bg");
  const R_NP = result.getAttribute("data-r_np");
  if (R_BG < R_NP) {
    await collectNP();
    await collectFG();
    await collectBG();
    await collectResults();
  } else {
    location.reload();
  }
}, 3000);

function clickAllOptions() {
  return new Promise((resolve) => {
    const options = siteSelect.options;
    for (let i = 0; i < options.length; i++) {
      siteSelect.value = siteSelect.options[i].value;
      submitButton.click();
    }
    resolve();
  });
}

function openTab(url) {
  return new Promise((resolve) => {
    if (url === null) {
      window.open();
      return resolve();
    }
    window.open(
      `https://${url}`,
      "_blank",
      "toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes"
    );
    window.focus();
    resolve();
  });
}
function openInNewAndClickAllOptions() {
  return new Promise(async (resolve) => {
    const options = siteSelect.options;
    for (let i = 0; i < options.length; i++) {
      let url = options[i].value;
      setTimeout(async () => {
        await openTab(url);
        siteSelect.value = siteSelect.options[i].value;
        submitButton.click();
        // resolve();
      }, 800);
    }

    resolve();
  });
}

function openInNewAndEmptyClickAllOptions() {
  return new Promise(async (resolve) => {
    const options = siteSelect.options;
    for (let i = 0; i < options.length; i++) {
      let url = options[i].value;
      setTimeout(async () => {
        await openTab(url);
        await openTab(null);
        siteSelect.value = siteSelect.options[i].value;
        submitButton.click();
      }, 800);
    }
    resolve();
  });
}

function collectResults() {
  return new Promise((resolve) => {
    setTimeout(async () => {
      const rows = monitorResultTable.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        let data = rows[i].getAttribute("data-info");
        await postRecord(data);
      }
    }, 50000);
    resolve();
  });
}

function collectNP() {
  return new Promise(async (resolve) => {
    result.setAttribute("data-label", "np");
    await clickAllOptions();
    resolve();
  });
}
function collectBG() {
  return new Promise(async (resolve) => {
    result.setAttribute("data-label", "bg");
    await openInNewAndEmptyClickAllOptions();
    resolve();
  });
}

function collectFG() {
  return new Promise(async (resolve) => {
    result.setAttribute("data-label", "fg");
    await openInNewAndClickAllOptions();
    resolve();
  });
}
