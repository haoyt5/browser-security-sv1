// const result = document.getElementById("result");
const submitButton = document.getElementById("submit-btn");
const monitorResultTable = document.getElementById("monitor-results");

setTimeout(async () => {
  const R_BG = result.getAttribute("data-r_bg");
  const R_NP = result.getAttribute("data-r_np");
  if (R_BG < R_NP) {
    await collectNP();
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

function collectResults() {
  return new Promise((resolve) => {
    setTimeout(() => {
      const rows = monitorResultTable.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        let data = rows[i].getAttribute("data-info");
        console.log(data);
      }
    }, 30000);
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
