# import sys
# import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.chrome.options import Options


# SERVICE_PATH = "./chromedriver"
CHROMIUM_PATH = '/Applications/Chromium-87.app/Contents/MacOS/Chromium'

if __name__ == "__main__":
    options = Options()
    options.add_argument('binary_location={}'.format(CHROMIUM_PATH))
    driver = webdriver.Chrome(options=options)
    # open attacker website
    driver.get("http://localhost:8080")
    time.sleep(8)
    # open with particular
    # options = Options()
    # options.add_argument('binary_location={}'.format(CHROMIUM_PATH))
    # # options.add_argument("--disable-dev-shm-usage")
    # # chrome_service = Service(executable_path=CHROMIUM_PATH)
    # driver = webdriver.Chrome(service=chrome_service,options=options)
    # # open attacker website
    # driver.get("http://localhost:8080/")
    # driver.get("google.com")
    # time.sleep(3)
    driver.quit()