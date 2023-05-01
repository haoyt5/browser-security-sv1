from flask import Flask, render_template, send_from_directory, request
import csv
from sklearn.svm import SVC

app = Flask(__name__)

@app.route("/svm")
def calculate_SVM_params():
    # TODO: get r_np, r_bg and reformat to X, y
    clf = SVC(kernel='linear') # TODO: replace this with a pre-trained one with optimized regularizer
    clf.fit(X, y)

    # TODO: return a, b as json file

    return 

@app.route('/top-300.csv')
def serve_top_300():
    return send_from_directory('static', 'top-300.csv')

@app.route('/logs', methods=['POST'])
def save_cvs():
    PATH = './result/all.csv'
    data = request.json
    print('data', data)
    # return data
    record = data.get('record')
    record_list = record.split(',')

    with open(PATH, 'a', newline='') as f:
        writer = csv.writer(f)
        writer.writerow(record_list)
    f.close()
    return data

@app.route('/static/<path:path>')
def serve_js(path):
    return send_from_directory('static', path)

@app.route('/')
def index():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(debug = True)