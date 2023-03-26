# Browser Security - SV1 Group Project

## Reference Paper

- [Timing-Based Browsing Privacy Vulnerabilities Via Site Isolation](https://www.microsoft.com/en-us/research/uploads/prod/2021/10/SiteIsolationTimingChannel-cam-ready-2.pdf)

- [Timing-Based Browsing Privacy Vulnerabilities Via Site Isolation - Youtube)](https://youtu.be/e8VumSQUASI)
  - Vulnerable version: 68~87

## Resources

- [Downloading old builds of Chrome / Chromium](https://www.chromium.org/getting-involved/download-chromium/)

  - [Chromium 74 for Mac](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/638880/)
  - [Chromium 72 for Mac](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/612451/)

-[Alexa Top 1 Million Sites](https://gist.github.com/chilts/7229605)

- [Umbrella Popularity List - most queried domains based on passive DNS usage across Cisco Umbrella global network ](https://s3-us-west-1.amazonaws.com/umbrella-static/index.html)

## How to run the website

1. Download the vulnerable Chromium version (The experiment in the study use the Chrome 87 on windows 10)
2. Open the `index.html` with the Chromium

## ChangeLog

Functions (based on p5 Listing2: The attack algorithm in pseudo code):

- [x] load_baseline_results()
- [x] relative_time = equation_one(vtm_site)
- [x] create_invisible_iframe(vtm_site)
- [x] save_baseline_results(r_np, r_bg)
- [ ] DELTA
- [ ] a_1, b_1, a_2, b_2 = calculate_SVM_params(r_np, r_bg)
