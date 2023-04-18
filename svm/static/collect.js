const submitButton = document.getElementById("submit-btn");
const monitorResultTable = document.getElementById("monitor-results");

function sleep(ms) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, ms);
  });
}

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
    // FEATURE: Collect Script
    // await collectNP();
    // await sleep(500);
    // await collectFG();
    // await sleep(500);
    // await collectBG();
    // await sleep(500);
    // console.log("Start To Collect");
    // await collectResults();
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

function closeTab(opened) {
  return new Promise((resolve) => {
    setTimeout(() => {
      opened.close();
    }, 300);
    return resolve();
  });
}

function openTab(url) {
  return new Promise(async (resolve) => {
    if (url === null) {
      let empty = window.open();
      empty.focus();
      await closeTab(empty);
      return resolve();
    }
    let newWindow = window.open(
      `https://${url}`,
      "_blank",
      "toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes"
    );
    newWindow.focus();
    await closeTab(newWindow);
    return resolve();
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
    const wait = 3 * 60 * 1000;
    setTimeout(async () => {
      const rows = monitorResultTable.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        let data = rows[i].getAttribute("data-info");
        await postRecord(data);
      }
    }, wait);
    resolve();
  });
}

function setDataLabelAttribute(label) {
  return new Promise((resolve) => {
    setTimeout(() => {
      result.setAttribute("data-label", label);
    }, 1000);
    resolve();
  });
}
function collectNP() {
  return new Promise(async (resolve) => {
    await setDataLabelAttribute("np");
    await sleep(500);
    await clickAllOptions();
    resolve();
  });
}
function collectBG() {
  return new Promise(async (resolve) => {
    await setDataLabelAttribute("bg");
    await sleep(500);
    await openInNewAndEmptyClickAllOptions();
    resolve();
  });
}

function collectFG() {
  return new Promise(async (resolve) => {
    await setDataLabelAttribute("fg");
    await sleep(500);
    await openInNewAndClickAllOptions();
    resolve();
  });
}
