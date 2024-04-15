# uname() error回避
import platform
print("platform", platform.uname())
 
from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker, joinedload
import json
import pandas as pd

from db_control.connect import engine
from db_control.mymodels import Users, Post, Photo
import base64
 

def myinsert(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    query = insert(mymodel).values(values)
    try:
        # トランザクションを開始
        with session.begin():
            # データの挿入
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()
 
    # セッションを閉じる
    session.close()
    return "inserted"
 
def myselect(mymodel, user_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = session.query(mymodel).filter(mymodel.user_id == user_id)
    try:
        # トランザクションを開始
        with session.begin():
            # Usersのデータを取得し、関連する全てのPostsとPhotosをプリロードする
            results = query.options(
                joinedload(Users.posts).joinedload(Post.photos)
            ).all()
            if not results:
                return None
            # 結果をオブジェクトから辞書に変換
            result_dict = {
                "user_id": results[0].user_id,
                "user_name": results[0].user_name,
                "user_mail": results[0].user_mail,
                "user_password": results[0].user_password,  # 追加: user_password を含める
                "user_profile": results[0].user_profile,
                "age": results[0].age,
                "gender": results[0].gender,
                "user_picture": base64.b64encode(results[0].user_picture).decode() if results[0].user_picture else None,
                "posts": [
                    {
                        "post_id": post.post_id,
                        "review": post.review,
                        "rating": post.rating,
                        "photos": [
                            base64.b64encode(photo.photo_data).decode() if photo.photo_data else None
                            for photo in post.photos
                        ]
                    }
                    for post in results[0].posts
                ]
            }
            return result_dict
    finally:
        session.close()
        
        
def read_post(post_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        # トランザクションを開始
        with session.begin():
            # Postsのデータを取得し、関連するPhotosをプリロードする
            post = session.query(Post).options(joinedload(Post.photos), joinedload(Post.store)).filter_by(post_id=post_id).first()
            if post is None:
                return {"error": "Post not found"}
            
            # 結果をオブジェクトから辞書に変換
            result = {
                "store_name": post.store.store_name,
                "post_id": post.post_id,
                "user_id": post.user_id,
                "review": post.review,
                "rating": post.rating,
                "photos": [
                    {
                        "photo_id": photo.photo_id,
                        "photo_data": base64.b64encode(photo.photo_data).decode() if photo.photo_data else None
                    }
                    for photo in post.photos
                ]
            }
            return result
    except Exception as e:
        print(f"Error: {e}")
        return {"error": "Internal server error"}
    finally:
        session.close()
        
def myupdate(mymodel, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    user_id = values.pop("user_id")
    
    try:
        # トランザクションを開始
        with session.begin():
            # Usersテーブルの更新
            user_query = update(Users).where(Users.user_id == user_id).values(values)
            session.execute(user_query)
            
            # Postsテーブルの更新
            posts_data = values.pop("posts", [])
            for post_data in posts_data:
                post_id = post_data.pop("post_id", None)
                if post_id:
                    post_query = update(Post).where(Post.post_id == post_id).values(post_data)
                    session.execute(post_query)
                else:
                    post = Post(user_id=user_id, **post_data)
                    session.add(post)
                    
                # Photosテーブルの更新
                photos_data = post_data.pop("photos", [])
                for photo_data in photos_data:
                    photo_id = photo_data.pop("photo_id", None)
                    if photo_id:
                        photo_query = update(Photo).where(Photo.photo_id == photo_id).values(photo_data)
                        session.execute(photo_query)
                    else:
                        photo = Photo(post_id=post.post_id, **photo_data)
                        session.add(photo)
                        
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、更新に失敗しました")
        session.rollback()
    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
    finally:
        session.close()
        
    return "put"

def mydelete(mymodel, user_id):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()
    query = delete(mymodel).where(mymodel.user_id==user_id)
    try:
        # トランザクションを開始
        with session.begin():
            result = session.execute(query)
    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()
 
    # セッションを閉じる
    session.close()
    return user_id + " is deleted"