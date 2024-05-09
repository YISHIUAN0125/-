from flask import Flask , render_template

app = Flask(__name__)

@app.route('/', methods=['GET'])

def homePage():
    return render_template("web_1.html")



if __name__=='__main__':
    app.run(host='0.0.0.0', port=6016, debug=True)