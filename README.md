# Browser Security - SV1 Group Project

## Reference Paper

- [Timing-Based Browsing Privacy Vulnerabilities Via Site Isolation](https://www.microsoft.com/en-us/research/uploads/prod/2021/10/SiteIsolationTimingChannel-cam-ready-2.pdf)

- [Timing-Based Browsing Privacy Vulnerabilities Via Site Isolation - Youtube)](https://youtu.be/e8VumSQUASI)
  - Vulnerable version: 68~87

## Resources

- [Downloading old builds of Chrome / Chromium](https://www.chromium.org/getting-involved/download-chromium/)

  - [Chromium 74 for Mac](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/638880/)
  - [Chromium 72 for Mac](https://commondatastorage.googleapis.com/chromium-browser-snapshots/index.html?prefix=Mac/612451/)

<!-- - [Alexa Top 1 Million Sites](https://gist.github.com/chilts/7229605) -->

- [Cisco Umbrella Popularity List ](https://s3-us-west-1.amazonaws.com/umbrella-static/index.html) - most queried domains based on passive DNS usage across Cisco Umbrella global network

## How to run the website

1. Download the vulnerable Chromium version (The experiment in the study use the Chrome 87 on windows 10)
   a. Use [Live Server](https://marketplace.visualstudio.com/items?itemName=ritwickdey.LiveServer) to open the `index.html` with the Chromium at [http://127.0.0.1:5000/](http://127.0.0.1:5000/)
   b.

   1. Assuming you have Python 3 installed, create a virtual environment and
      install the Python dependencies redirect to /svm

   - In bash/zsh:

     ```bash
     python3 -m venv env
     source env/bin/activate
     pip install -r requirements.txt
     ```

   - In Windows cmd.exe:

     ```
     py -3 -m venv env
     env\Scripts\activate.bat
     pip install -r requirements.txt
     ```

   2. Run the script

   ```bash
   export FLASK_APP=get_svm.py
   flask run
   ```

   3. Visit [http://127.0.0.1:5000/](http://127.0.0.1:5000/)

## ChangeLog

Functions (based on p5 Listing2: The attack algorithm in pseudo code):

- [x] load_baseline_results()
- [x] relative_time = equation_one(vtm_site)
- [x] create_invisible_iframe(vtm_site)
- [x] save_baseline_results(r_np, r_bg)
- [ ] DELTA
- [ ] a_1, b_1, a_2, b_2 = calculate_SVM_params(r_np, r_bg)
