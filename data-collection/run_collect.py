# import sys
# import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options

# SERVICE_PATH = "./chromedriver"
CHROMIUM_PATH = "./Chromium"


if __name__ == "__main__":
    options = Options()
    options.add_argument('binary_location={}'.format(CHROMIUM_PATH))
    driver = webdriver.Chrome(options=options)
    # open attacker website
    driver.get("http://127.0.0.1:5000/")