import requests
import time
from selenium import webdriver
from selenium.webdriver.chrome.options import Options
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.common.by import By
from selenium.common.exceptions import TimeoutException
from selenium.webdriver.support import expected_conditions as EC

CHROMIUM_PATH = '/Applications/Chromium-87.app/Contents/MacOS/Chromium'
CHROMIUM_DRIVER_PATH = './chromedriver'
COUNT = 50

def check_ready(driver):
    # check data-ready is "true"
    wait = WebDriverWait(driver, 5)
    wait.until(lambda x: x.find_element(By.CSS_SELECTOR, '[data-ready="true"]'))
    return True

def collect_bg(driver, site_select,submit_button):
    # set data-label to bg
    set_data_label_attribute(driver=driver, label='bg')
    time.sleep(1)
    open_in_new_and_switch_bg_and_close(driver=driver, site_select=site_select,submit_button=submit_button)

def collect_fg(driver, site_select,submit_button):
    # set data-label to fg
    set_data_label_attribute(driver=driver, label='fg')
    time.sleep(1)
    open_in_new_and_switch_fg_and_close(driver=driver, site_select=site_select,submit_button=submit_button)
    
def collect_np(driver, site_select, submit_button):
    # set data-label to np
    set_data_label_attribute(driver=driver, label='np')
    time.sleep(1)
    click_every_second(driver=driver, site_select=site_select, submit_button=submit_button)

def collect_results(monitor_result_table):
    rows = monitor_result_table.find_elements(By.TAG_NAME, "tr")
    for row in rows:
        data = row.get_attribute("data-info")
        post_record(data)
        
def post_record(record):
    response = requests.post("http://localhost:8080/logs", headers={"Content-Type": "application/json"}, json={"record": record})
    response.raise_for_status()    
    
def set_data_label_attribute(driver,label): 
    driver.execute_script("document.getElementById('result').setAttribute('data-label', arguments[0])", label)
        
def set_data_case_attribute(driver,case):
    driver.execute_script("document.getElementById('result').setAttribute('data-case', arguments[0])", case)   
        
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

def click_every_second(driver, site_select, submit_button):
    i = 0
    for i in range(COUNT):
        site_dropdown = site_select
        sites = site_dropdown.find_elements(By.TAG_NAME, "option")
        site_dropdown.click()
        sites[i].click()
        submit_button.click()     
        time.sleep(3)
        
def open_in_new_and_switch_fg_and_close(driver, site_select, submit_button):
    i = 0
    for i in range(COUNT):
        site_dropdown = site_select
        sites = site_dropdown.find_elements(By.TAG_NAME, "option")
        site_dropdown.click()
        sites[i].click()
        submit_button.click()
        # Open the selected site in a new tab
        selected_site = sites[i].get_attribute("value")
        selected_site = "https://" + selected_site.lstrip('/')
        driver.execute_script(f"window.open('{selected_site}', '_blank');")
        # Switch to the new tab
        driver.switch_to.window(driver.window_handles[-1])
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.TAG_NAME, "body")))
        except TimeoutException:
            print(f"Timeout while waiting for {selected_site} to load.")
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            continue 
        
        time.sleep(3)
        driver.close()
        driver.switch_to.window(driver.window_handles[0])
        time.sleep(3)

        
def open_in_new_and_switch_bg_and_close(driver, site_select, submit_button):
    i = 0
    for i in range(COUNT):
        site_dropdown = site_select
        sites = site_dropdown.find_elements(By.TAG_NAME, "option")
        site_dropdown.click()
        sites[i].click()

        # Open the selected site in a new tab
        selected_site = sites[i].get_attribute("value")
        selected_site = "https://" + selected_site.lstrip('/')
        driver.execute_script(f"window.open('{selected_site}', '_blank');")
        
        # Switch to the new tab
        driver.switch_to.window(driver.window_handles[-1])
        try:
            WebDriverWait(driver, 10).until(EC.presence_of_all_elements_located((By.TAG_NAME, "body")))
        except TimeoutException:
            print(f"Timeout while waiting for {selected_site} to load.")
            driver.close()
            driver.switch_to.window(driver.window_handles[0])
            continue 
        
        # Switch to the monitor tab
        driver.switch_to.window(driver.window_handles[0])
        submit_button.click()
        time.sleep(3)
        
        # Close the new tab and switch back to the main tab
        driver.switch_to.window(driver.window_handles[-1])
        driver.close()
        driver.switch_to.window(driver.window_handles[0])
        time.sleep(3)  
        
        
def main():
    driver = init_driver()
    # Get the current time before executing the code
    start_time = time.time()
    # open attacker website
    driver.get("http://localhost:8080")
    ready = check_ready(driver)
    time.sleep(2)
    if ready:
        print("is Ready")
        # Get the monitor results table element
        monitor_result_table = driver.find_element(By.ID, "monitor-results")
        site_select = driver.find_element(By.ID, "site")
        submit_button = driver.find_element(By.ID, "submit-btn")

        # [Case 2]: 
        print("collect case 2: np, fg")
        set_data_case_attribute(driver=driver, case='2')
        time.sleep(2)
        
        # Collect NP
        print("collect np start")
        collect_np(driver=driver, site_select=site_select, submit_button=submit_button)  
        print("collect np end")
        time.sleep(2)

        # Collect FG
        print("collect fg start")
        collect_fg(driver=driver, site_select=site_select, submit_button=submit_button)
        print("collect fg end")
        time.sleep(2)
        
        # Collect BG
        # print("collect bg start")
        # collect_bg(driver=driver, site_select=site_select, submit_button=submit_button)
        # print("collect bg end")
        # time.sleep(2)
        
        
        # [Case 1]: 
        print("collect case 1: bg/fg")
        set_data_case_attribute(driver=driver, case='1')
        time.sleep(2)
        
        # Collect NP
        # print("collect np start")
        # collect_np(driver=driver, site_select=site_select, submit_button=submit_button)  
        # print("collect np end")
        # time.sleep(2)
        
        # Collect BG
        print("collect bg start")
        collect_bg(driver=driver, site_select=site_select, submit_button=submit_button)
        print("collect bg end")
        time.sleep(2)

        # Collect FG
        print("collect fg start")
        collect_fg(driver=driver, site_select=site_select, submit_button=submit_button)
        print("collect fg end")
        time.sleep(2)
        

        
        
        # Collect Results
        print("collect results start")
        collect_results(monitor_result_table=monitor_result_table)
        print("collect results end")
        time.sleep(3)
        
        driver.quit()
        # Get the current time after executing the code
        end_time = time.time()
        # Calculate the execution time
        execution_time_seconds = end_time - start_time
        # Convert to minutes
        execution_time_minutes = execution_time_seconds / 60

        print(f"Execution time: {execution_time_minutes:.2f} minutes")

            
    # time.sleep(8)
    # open with particular
    # driver.quit()

if __name__ == "__main__":
    main()