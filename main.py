from flask import Flask , render_template, redirect, session, g, request, flash, jsonify
import sqlite3 as sq
import re

app = Flask(__name__)
app.secret_key = 'asdasd'

def get_stock(product_id):
    con = sq.connect('eyefind.db')
    cursorObj = con.cursor()
    cursorObj.execute("SELECT quantity FROM product WHERE car_id=?", (str(product_id),))
    stock = cursorObj.fetchone()
    con.close()
    return stock[0] if stock else False

def check_login():
    if session.get('username') != None:
        return True
    return False

def checkPass(password):
    special_characters = re.compile(r'[@_!#$%^&*()<>?/\\|}{~:]')
    if special_characters.search(password):
        return True
    return False

def checkEmail(email):
    email_pattern = re.compile(r'.*@gmail\.com$')
    if  email_pattern.match(email):
        return True
    return False


@app.route('/', methods=['GET'])
def homePage():
    session.clear()
    return render_template("web_1.html")


@app.route('/web_2', methods=['GET'])
def shop():
    if check_login()==True:
        # return render_template("web_2.html", username=session.get('username'))
        flash(f'{session.get("username")}')
        return render_template("web_2.html")
        # return redirect('/web_2')
    else:
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
            session['username']=name
            user_ = session.get('username')
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
    session.clear
    # flash('已登出')
    return redirect('/')

#註冊
@app.route('/signup', methods=['GET','POST'])
def signup():
    if request.method=='POST':
        name = request.form['username']
        password = request.form['password']
        con = sq.connect('eyefind.db')
        cursorObj = con.cursor()
        print('connected')
        a = cursorObj.execute("SELECT username FROM userdata")
        user = a.fetchall()
        print(user)
        cursorObj.close()
        con.close()
        check = False
        for i in user:
            if i[0]==name:
                check=True
                break
        if check:
            return render_template('signup.html', message='此名稱已被使用')
        elif checkPass(password)==False:
            return render_template('signup.html', message='密碼須包含特殊字元')
        elif len(password)<8:
            return render_template('signup.html', message='密碼需大於八個字元')
        else:
            con = sq.connect('eyefind.db')
            cursorObj = con.cursor()
            cursorObj.execute("INSERT INTO userdata VALUES(?,?)", (name,password))
            con.commit()
            cursorObj.execute("SELECT * FROM userdata WHERE username=? AND password=?", (name, password))
            user = cursorObj.fetchone()
            cursorObj.close()
            con.close()
            if user:
                session['username']=name
                user_ = session.get('username')
                flash(f'{user_}')
                print(name)
                return redirect('/web_2')
    else:
        return render_template("signup.html")
    # if request.method=='POST':
    #     name = request.form['username']
    #     password = request.form['password']
    #     con = sq.connect('eyefind.db')
    #     cursorObj = con.cursor()
    #     print('connected')
    #     cursorObj.execute("INSERT INTO userdata VALUES(?,?)", (name,password))
    #     con.commit()
    #     cursorObj.execute("SELECT * FROM userdata WHERE username=? AND password=?", (name, password))
    #     user = cursorObj.fetchone()
    #     cursorObj.close()
    #     con.close()
    #     if user:
    #         session['username']=name
    #         user_ = session.get('username')
    #         flash(f'{user_}')
    #         print(name)
    #         return redirect('/web_2')
    #     else:      
    #         # flash('登錄失敗，請檢查使用者名稱或密碼！')
    #         return redirect('/signup')
    # else:
    #     return render_template("signup.html")

# def getCurrentUser():
#     if 'username' in session:
#         return jsonify({'username': session['username']})
#     return jsonify({'message': 'User not logged in'}), 401

@app.route('/get-username')
def get_username():
    if 'username' in session:
        print(session['username'])
        return jsonify({'username': session.get('username')}) 
    else:
        return jsonify({'message': 'User not logged in'}), 401


@app.route('/add-to-cart', methods=['POST']) #TODO將商品價格也加入資料庫
def add_to_cart():
    if  session.get('username')==None:
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
        cursorObj.execute("INSERT INTO shopping_cart (car_id, price, username) VALUES (?, ?, ?)", (str(product_name), int(price),str(username)))
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
    cursorObj.execute("SELECT car_id,price FROM shopping_cart WHERE username=?", (str(session.get('username')),))
    items = cursorObj.fetchall()
    cursorObj.close()
    con.close()
    cart_items = [{'car_id': item[0],'price':item[1]} for item in items]
    print(cart_items)
    return jsonify({'items': cart_items})

@app.route('/clear-cart-item', methods=['POST'])
def clearItem():
    data = request.get_json()
    items = data.get('items', [])
    if not items:
        return jsonify({'error': 'No items provided'}), 400
    con = sq.connect('eyefind.db')
    cursorObj = con.cursor()
    for id in items:   
        cursorObj.execute('DELETE FROM shopping_cart WHERE car_id=?', (id,))
    con.commit()
    cursorObj.close()
    con.close()
    return jsonify({'message': 'Selected items have been cleared'})

#結帳
@app.route('/process-payment', methods=['POST'])
def process_payment():
    car=''
    payment_info = request.json
    name = payment_info.get('name', None)
    email = payment_info.get('email', None)
    phone = payment_info.get('phone', None)
    payment_method = payment_info.get('payment-method', None)
    selected_items = payment_info.get('selectedItems', [])

    if name and email and phone and payment_method :
        con = sq.connect('eyefind.db')
        cursorObj = con.cursor()
        for item in selected_items:
            car_id = item['car_id']
            car+=car_id
            quantity = int(item['quantity'])
            cursorObj.execute("SELECT quantity FROM product WHERE car_id = ?", (car_id,))
            product = cursorObj.fetchone()
            print(product)
            if product:
                current_stock = product[0]
                if current_stock >= quantity:
                    # 更新庫存
                    new_stock = current_stock - quantity
                    cursorObj.execute("UPDATE product SET quantity = ? WHERE car_id = ?", (new_stock, car_id))
                else:
                    return jsonify({'message': 'Not enough stock for product ID {}'.format(car_id)}), 400
            else:
                return jsonify({'message': 'Product not found.'}), 404

        con.commit()
        cursorObj.close()
        con.close()
        print(car)
        response_data = {"status": "success", "message": "Payment processed successfully.","car_id": car}
        return jsonify(response_data)
    else:
        response_data = {"status": "error", "message": "All fields are required."}
        return jsonify(response_data), 400 

@app.route('/clear-cart', methods=['POST'])
def clearCart():
    try:
        con = sq.connect('eyefind.db')
        cursorObj = con.cursor()
        cursorObj.execute('DELETE FROM shopping_cart ')
        con.commit()
        cursorObj.close()
        con.close()
        return jsonify({'message': 'Cart cleared successfully'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500
    
#stock
@app.route('/stock/<product_id>')
def stock(product_id):
    stock_count = get_stock(product_id)
    return jsonify(stock=stock_count)

#購物車
@app.route('/cart',methods=['GET'])
def chart():
     return render_template("cart.html")


@app.route('/fashion', methods=['GET'])
def fashion():
    if  session.get('username')==None:
        return render_template("fashion.html")
    name=session.get('username')
    return render_template("fashion.html",message=name)
    

@app.route('/food', methods=['GET'])
def food():
    if  session.get('username')==None:
        return render_template("fashion.html")
    name=session.get('username')
    return render_template("fashion.html",message=name)

@app.route('/media', methods=['GET'])
def media():
    if  session.get('username')==None:
        return render_template("fashion.html")
    name=session.get('username')
    return render_template("fashion.html",message=name)

@app.route('/travel', methods=['GET'])
def travel():
    if  session.get('username')==None:
        return render_template("fashion.html")
    name=session.get('username')
    return render_template("fashion.html",message=name)

if __name__=='__main__':
    app.run(host='0.0.0.0', port=6016, debug=True)
