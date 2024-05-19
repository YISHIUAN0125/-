from flask import Flask , render_template, redirect, session, g




app = Flask(__name__)

@app.route('/', methods=['GET'])
def homePage():
    return render_template("web_1.html")

@app.route('/web_2', methods=['GET'])
def shop():
    return render_template("web_2.html")

@app.route('/login', methods=['GET'])
def login():
    return render_template("login.html")

@app.route('/signup', methods=['GET'])
def signup():
    return render_template("signup.html")


if __name__=='__main__':
    app.run(host='0.0.0.0', port=6016, debug=True)