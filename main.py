from flask import Flask , render_template, redirect, session, g, request, flash, jsonify
import sqlite3 as sq

tmp=''

def check_login():
    print(session['user_'])
    return 'user_' in session

app = Flask(__name__)
app.secret_key = 'asdasd'


@app.route('/', methods=['GET'])
def homePage():
    return render_template("web_1.html")


@app.route('/web_2', methods=['GET'])
def shop():
    if check_login():
        return render_template("web_2.html", username=session['user_'])
    else:
        return redirect('/login')


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
            print(user_)
            flash(f'{user_}')
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

# def getCurrentUser():
#     if 'username' in session:
#         return jsonify({'username': session['username']})
#     return jsonify({'message': 'User not logged in'}), 401

@app.route('/get-username')
def get_username():
    # 獲取當前用戶的用戶名
    if session['user_']:
        return jsonify({'username': session['user_']})
    return jsonify({'message': 'User not logged in'}), 401


@app.route('/add-to-cart', methods=['POST']) #TODO將商品價格也加入資料庫
def add_to_cart():
    print(tmp)
    if  not session['user_']:
        return jsonify({'message': 'User not logged in'}), 401
    data = request.json #接收請求
    product_name = data.get('product_name')
    price = data.get('price')
    username=data.get('username')
    con = sq.connect('eyefind.db')
    cursorObj = con.cursor()
    cursorObj.execute("SELECT * FROM product WHERE car_id = ? and price= ? ", (str(product_name), int(price)))
    product = cursorObj.fetchone()
    cursorObj.close()
    con.close()
    print(product)
    if product and product[2] > 0:
        # 庫存足夠，加到購物車
        con = sq.connect('eyefind.db')
        cursorObj = con.cursor()
        cursorObj.execute("INSERT INTO shopping_cart (car_id, username) VALUES (?, ?)", (str(product_name), str(username)))
        # cursorObj.execute("UPDATE products SET stock = stock - 1 WHERE product_name = ?", (product_name,))
        con.commit()
        cursorObj.close()
        con.close()
        return jsonify({'id': cursorObj.lastrowid})
    else:
        return jsonify({'message': 'Product out of stock'}), 400


@app.route('/get-cart-items', methods=['GET']) #TODO返回商品名稱跟價格
def get_cart_items():
    con = sq.connect('eyefind.db')
    cursorObj = con.cursor()
    cursorObj.execute("SELECT car_id FROM shopping_cart WHERE username=?", (str(session['user_']),))
    items = cursorObj.fetchall()
    cursorObj.close()
    con.close()
    cart_items = [{'car_id': item[0]} for item in items]
    print(cart_items)
    return jsonify({'items': cart_items})


#購物車
@app.route('/cart',methods=['GET'])
def chart():
     return render_template("cart.html")




if __name__=='__main__':
    app.run(host='0.0.0.0', port=6016, debug=True)
