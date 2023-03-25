from flask import Flask
from sklearn.svm import SVC

app = Flask(__name__)

@app.route("/")
def calculate_SVM_params():
    # TODO: get r_np, r_bg and reformat to X, y
    clf = SVC(kernel='linear') # TODO: replace this with a pre-trained one with optimized regularizer
    clf.fit(X, y)

    # TODO: return a, b as json file

    return 