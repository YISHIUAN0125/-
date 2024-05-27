from flask import Flask , render_template, redirect, session, g, request, flash
import sqlite3 as sq

app = Flask(__name__)
app.secret_key = 'asdasd'


@app.route('/', methods=['GET'])
def homePage():
    return render_template("web_1.html")


@app.route('/web_2', methods=['GET'])
def shop():
    return render_template("web_2.html")


#登錄
@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        name = request.form['username']
        password = request.form['password']
        con = sq.connect('eyefind.db')
        cursorObj = con.cursor()
        print('connected')
        # Check if the user exists
        cursorObj.execute("SELECT * FROM userdata WHERE username=? AND password=?", (name, password))
        user = cursorObj.fetchone()
        cursorObj.close()
        con.close()
        if user:
            session['user_']=name
            user_ = session.get('user_')
            flash(f'{user_}')
            print(name)
            return redirect('/web_2')
        else:          #TODO加入帳號或密碼錯誤提示，若沒有帳號，引導使用者登錄
            # flash('登錄失敗，請檢查使用者名稱或密碼！')
            return redirect('/signup')
    else:
        return render_template("login.html")

#登出 #TODO確定登出後要導向到哪裡
@app.route('/logout', methods=['POST'])
def logout():
    session.pop('username', None)
    # flash('已登出')
    return redirect('/web_2')

#註冊
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method=='POST':
        name = request.form['username']
        password = request.form['password']
        con = sq.connect('eyefind.db')
        cursorObj = con.cursor()
        print('connected')
        cursorObj.execute("INSERT INTO userdata VALUES(?,?)", (name,password))
        con.commit()
        cursorObj.execute("SELECT * FROM userdata WHERE username=? AND password=?", (name, password))
        user = cursorObj.fetchone()
        cursorObj.close()
        con.close()
        if user:
            session['user_']=name
            user_ = session.get('user_')
            flash(f'{user_}')
            print(name)
            return redirect('/web_2')
        else:      
            # flash('登錄失敗，請檢查使用者名稱或密碼！')
            return redirect('/signup')
    else:
        return render_template("signup.html")


if __name__=='__main__':
    app.run(host='0.0.0.0', port=6016, debug=True)