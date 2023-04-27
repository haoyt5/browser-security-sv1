# import sys
# import os
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
import asyncio
from aioselenium import Remote

CHROMIUM_PATH = '/Applications/Chromium-87.app/Contents/MacOS/Chromium'
CHROMIUM_DRIVER_PATH = './chromedriver'
COUNT = 2

def check_ready():
    # check data-ready is "true"
    exit()
    
    
def collect_np():
    # set data-label to np, and set to 
    
    exit()
    
    
    
def init_driver():
    chrome_options = Options()
    # chrome_options.add_argument('--disable-extensions')
    # chrome_options.add_argument('--headless')
    # chrome_options.add_argument('--disable-gpu')
    chrome_options.binary_location = CHROMIUM_PATH
    
    chrome_driver_path = CHROMIUM_DRIVER_PATH
    service = Service(chrome_driver_path)
    driver = webdriver.Chrome(service=service,options=chrome_options)
    return driver

def main():
    driver = init_driver()

    # open attacker website
    driver.get("http://localhost:8080")
    # time.sleep(8)
    # open with particular
    driver.quit()

if __name__ == "__main__":
    main()