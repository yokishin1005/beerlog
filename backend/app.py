from flask import Flask, request
from flask import jsonify
import json
from flask_cors import CORS
from db_control import crud, mymodels
import base64

import requests

# Azure Database for MySQL
# REST APIでありCRUDを持っている
app = Flask(__name__)
CORS(app)
 

@app.route("/")
def index():
    return "<p>Flask top page!</p>"

from flask import Flask, request, jsonify
from flask_jwt_extended import JWTManager, jwt_required, create_access_token, get_jwt_identity
from flask_cors import CORS
from db_control import crud, mymodels
from werkzeug.security import check_password_hash

app = Flask(__name__)
CORS(app)

app.config['JWT_SECRET_KEY'] = 'your-secret-key'  # JWTの秘密鍵を設定してください
jwt = JWTManager(app)

@app.route("/")
def index():
    return "<p>Flask top page!</p>"

@app.route('/login', methods=['POST'])
def login():
    user_id = request.json.get('user_id', None)
    password = request.json.get('user_password', None)
    user_dict = crud.myselect(mymodels.Users, user_id)
    
    if user_dict and check_password_hash(user_dict['user_password'], password):
        access_token = create_access_token(identity=user_dict['user_id'])
        return jsonify(access_token=access_token, user_id=user_dict['user_id']), 200
    else:
        return jsonify({"msg": "ユーザーIDまたはパスワードが間違っています"}), 401

@app.route("/user", methods=['GET'])
@jwt_required()
def read_user():
    user_id = get_jwt_identity()  # JWTからユーザーIDを取得
    result_dict = crud.myselect(mymodels.Users, user_id)
    
    if result_dict is None:
        return jsonify({"message": "User not found"}), 404
    
    return jsonify(result_dict), 200


@app.route("/post", methods=['GET'])
def get_post():
    result = crud.read_post(mymodels.Post.post_id)
    
    if result is None:
        return jsonify({"error": "post not found"}), 400
    
    return jsonify(result), 200

def create_post(user_id, store_name, review, rating):
    session = Session()
    try:
        store = session.query(Store).filter_by(store_name=store_name).first()
        if store:
            post = Post(user_id=user_id, store_id=store.store_id, review=review, rating=rating)
            session.add(post)
            session.commit()
            return post
        else:
            raise ValueError(f"Store '{store_name}' not found.")
    except Exception as e:
        session.rollback()
        raise e
    finally:
        session.close()


@app.route("/user", methods=['DELETE'])
def delete_post():
    model = mymodels.Post
    target_id = request.args.get('post_id') #クエリパラメータ
    result = crud.mydelete(model, target_id)
    return result, 200

@app.route("/fetchtest")
def fetchtest():
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    return response.json(), 200
