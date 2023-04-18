from selenium import webdriver
from selenium.webdriver.common.by import By
from selenium.webdriver.support.ui import WebDriverWait
from selenium.webdriver.support import expected_conditions as EC
from selenium.common.exceptions import TimeoutException
from urllib.parse import urljoin
import csv,os
import time

url = 'http://127.0.0.1:5500/'

options = webdriver.ChromeOptions()
options.add_argument("--disable-web-security")
options.add_argument("--disable-site-isolation-trials")

driver = webdriver.Chrome(executable_path="./data-collection/chromedriver", options=options)
driver.get(url)

# Wait for the site dropdown to be populated
WebDriverWait(driver, 2).until(
    lambda x: len(x.find_element(By.ID, "site").find_elements(By.TAG_NAME, "option")) > 0
)
site_dropdown = driver.find_element(By.ID, "site")

# Get the list of websites in the dropdown
sites = site_dropdown.find_elements(By.TAG_NAME, "option")

# Iterate over each site, selecting it and clicking the submit button
results = []
for i in range(81,len(sites)):
    site_dropdown = driver.find_element(By.ID, "site")
    site_dropdown.click()
    sites[i].click()
    
    time.sleep(1)

    submit_btn = driver.find_element(By.ID, "submit-btn")
    submit_btn.click()
    
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


    # Wait for the result to be displayed
    result = WebDriverWait(driver, 10).until(
        EC.presence_of_element_located((By.ID, "result"))
    )
    
    lines = result.text.splitlines()
    for line in lines:
        word = line.split(" ")
        for char in word:
            if len(char) > 20:
                char = char.replace('\u3000', ' ')

                w = char.split(" ")
                for c in w:
                    try:
                        float(c)
                        results.append((i,c))
                        print(i+1,",",c)
                    except:
                        continue
    # Store the result in the results list
    # results.append((sites[i].text, result.text))

    # Clear the result
    driver.execute_script("document.getElementById('result').innerHTML = '';")

# Close the browser
driver.quit()

# Write the results to a CSV file
with open('results.csv', 'w', newline='') as csvfile:
    csv_writer = csv.writer(csvfile)
    csv_writer.writerows(results)