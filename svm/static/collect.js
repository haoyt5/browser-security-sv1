// const result = document.getElementById("result");
const submitButton = document.getElementById("submit-btn");
const monitorResultTable = document.getElementById("monitor-results");
setTimeout(async () => {
  const R_BG = result.getAttribute("data-r_bg");
  const R_NP = result.getAttribute("data-r_np");
  if (R_BG < R_NP) {
    // console.log("start to collect");
    await collectNP();
    // await collectResults();
    const rows = monitorResultTable.getElementsByTagName("tr");
    console.log(
      rows,
      rows[0],
      monitorResultTable.getElementsByTagName("tr")[0]
    );
    for (let i = 0; i < 10; i++) {
      console.log("rows", rows.item(i));
    }
  } else {
    location.reload();
  }
}, 3000);

function clickAllOptions() {
  return new Promise((resolve) => {
    const options = siteSelect.options;
    for (let i = 0; i < 10; i++) {
      siteSelect.value = siteSelect.options[i].value;
      submitButton.click();
    }
    resolve();
  });
}
function collectResults() {
  return new Promise((resolve) => {
    const rows = monitorResultTable.getElementsByTagName("tr");
    for (let i = 0; i < 10; i++) {
      console.log("rows", rows[0].getAttribute("data-info"));
    }
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
  return new Promise((resolve) => {
    result.setAttribute("data-label", "bg");
    submitButton.click();
    resolve();
  });
}

function collectFG() {
  return new Promise((resolve) => {
    result.setAttribute("data-label", "fg");
    submitButton.click();
    resolve();
  });
}
