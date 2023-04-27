const submitButton = document.getElementById("submit-btn");
const monitorResultTable = document.getElementById("monitor-results");
const OPTIONS = siteSelect.options;
const COUNT = 2;

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
    // await sleep(COUNT * 1250);
    // await collectResults();
    // await sleep(COUNT * 1250);
    // await cleanResults();
    // await sleep(5000);
    // await collectFG();
    // await sleep(COUNT * 1250);
    // await collectResults();
    // await sleep(COUNT * 2250);
    // await cleanResults();
    // await sleep(5000);
    // await collectBG();
    // await sleep(COUNT * 1 * 1250);
    // await collectResults();
  } else {
    location.reload();
  }
}, 3000);

function clickEverySecond() {
  return new Promise((resolve) => {
    let i = 0;
    const options = siteSelect.options;
    const setAndClick = () => {
      if (i < COUNT) {
        siteSelect.value = siteSelect.options[i].value;
        submitButton.click();
        i++;
      } else {
        clearInterval(intervalId);
      }
    };
    const intervalId = setInterval(setAndClick, 1000);
    resolve();
  });
}

function clickAllOptions() {
  return new Promise(async (resolve) => {
    await clickEverySecond();
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

function openAndFocus(url) {
  return new Promise((resolve) => {
    const tab = window.open(`https://${url}`, "_blank");
    setTimeout(() => {
      tab.focus();
    }, 100);
    resolve();
    return tab;
  });
}

function openTab(url) {
  return new Promise(async (resolve) => {
    if (url === null) {
      const empty = window.open();
      empty.focus();
      await closeTab(empty);
      return resolve();
    }
    const newWindow = window.open(
      `https://${url}`,
      "_blank",
      "toolbar=yes, location=yes, status=yes, menubar=yes, scrollbars=yes"
    );
    newWindow.focus();
    await closeTab(newWindow);
    return resolve();
  });
}
function fireEverySecond(f) {
  return new Promise((resolve) => {
    let i = 0;
    const options = siteSelect.options;
    const setAndClick = () => {
      if (i < COUNT) {
        f(i);
        i++;
      } else {
        clearInterval(intervalId);
      }
    };
    const intervalId = setInterval(setAndClick, 1000);
    resolve();
  });
}

function openInNewAndClickAllOptions() {
  return new Promise(async (resolve) => {
    // const options = siteSelect.options;
    // for (let i = 0; i < 50; i++) {
    //   let url = options[i].value;
    //   setTimeout(async () => {
    //     await openTab(url);
    //     siteSelect.value = siteSelect.options[i].value;
    //     submitButton.click();
    //   }, 800);
    // }
    const fire = async (i) => {
      await openTab(siteSelect.options[i].value);
      siteSelect.value = siteSelect.options[i].value;
      submitButton.click();
    };
    await fireEverySecond(fire);
    resolve();
  });
}

function openInNewAndEmptyClickAllOptions() {
  return new Promise(async (resolve) => {
    // const options = siteSelect.options;
    // for (let i = 0; i < 50; i++) {
    //   let url = options[i].value;
    //   setTimeout(async () => {
    //     await openTab(url);
    //     await openTab(null);
    //     siteSelect.value = siteSelect.options[i].value;
    //     submitButton.click();
    //   }, 800);
    // }
    const fire = async (i) => {
      await openTab(siteSelect.options[i].value);
      await openTab(null);
      siteSelect.value = siteSelect.options[i].value;
      submitButton.click();
    };
    fireEverySecond(fire);
    resolve();
  });
}
function cleanResults() {
  return new Promise((resolve) => {
    console.log(resultTable);
    resultTable.innerHTML = "";
    resolve();
  });
}

function collectResults() {
  return new Promise(async (resolve) => {
    const rows = monitorResultTable.getElementsByTagName("tr");
    for (let i = 0; i < rows.length; i++) {
      let data = rows[i].getAttribute("data-info");
      await postRecord(data);
    }
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
