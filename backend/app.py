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


@app.route("/post", methods=['PUT'])
def edit_post():
    post_id = request.json.get('post_id')
    values = request.json
    
    result = crud.edit_post(post_id, values)
    return result, 200


@app.route("/post", methods=['POST'])
@jwt_required()
def create_post():
    user_id = get_jwt_identity()  # JWTからユーザーIDを取得
    review = request.form.get('review')
    rating = request.form.get('rating')
    store_name = request.form.get('store_name')
    photo_file = request.files.get('photo')  # ファイルフィールド名を指定

    result = crud.create_post(user_id, review, rating, store_name, photo_file)
    if result['status'] == 'success':
        return jsonify(result), 201
    else:
        return jsonify(result), 400

@app.route("/store/suggest", methods=['GET'])
def suggest_store():
    query = request.args.get('query')
    suggestions = crud.suggest_store(query)
    return jsonify(suggestions), 200


@app.route("/fetchtest")
def fetchtest():
    response = requests.get('https://jsonplaceholder.typicode.com/users')
    return response.json(), 200
