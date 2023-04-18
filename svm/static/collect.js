// const result = document.getElementById("result");
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
    await collectResults();
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
    setTimeout(async () => {
      const rows = monitorResultTable.getElementsByTagName("tr");
      for (let i = 0; i < rows.length; i++) {
        let data = rows[i].getAttribute("data-info");
        await postRecord(data);
        console.log(data);
      }
    }, 5000);
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
