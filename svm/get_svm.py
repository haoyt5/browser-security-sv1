from flask import Flask, render_template, send_from_directory
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


@app.route('/')
def index():
    return render_template('index.html')
if __name__ == '__main__':
    app.run(debug = True)