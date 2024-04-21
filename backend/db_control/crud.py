# uname() error回避
import platform
print("platform", platform.uname())
 
from sqlalchemy import create_engine, insert, delete, update, select
import sqlalchemy
from sqlalchemy.orm import sessionmaker, joinedload
import json
import pandas as pd

from db_control.connect import engine
from db_control.mymodels import Users, Post, Photo, Store, Brand
import base64


def myselect(mymodel, user_id=None):  # 修正: user_id のデフォルト値を None に設定
    # セッションの構築
    Session = sessionmaker(bind=engine)
    session = Session()

    query = session.query(mymodel)

    if user_id is not None:  # 修正: user_id が None でない場合のみフィルタリングを適用
        query = query.filter(mymodel.user_id == user_id)

    query = query.options(
        joinedload(mymodel.posts).joinedload(Post.store),
        joinedload(mymodel.posts).joinedload(Post.photos)
    )

    try:
        # トランザクションの開始
        with session.begin():
            # 関連する全ての投稿と写真を取得し、店舗情報も含めてデータをフェッチ
            results = query.all()
            if not results:
                return None

            # オブジェクトから辞書に変換、店舗名も含める
            result_dict = {
                "user_id": results[0].user_id,
                "user_name": results[0].user_name,
                "user_mail": results[0].user_mail,
                "user_password": results[0].user_password,
                "user_profile": results[0].user_profile,
                "age": results[0].age,
                "gender": results[0].gender,
                "user_picture": base64.b64encode(results[0].user_picture).decode() if results[0].user_picture else None,
                "posts": [
                    {
                        "post_id": post.post_id,
                        "review": post.review,
                        "rating": post.rating,
                        "store_name": post.store.store_name if post.store else None,
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
        
def edit_post(post_id, values):
    # session構築
    Session = sessionmaker(bind=engine)
    session = Session()

    try:
        # トランザクションを開始
        with session.begin():
            # Postsテーブルの更新前に `photos` を除外
            photos_data = values.pop("photos", [])
            
            # Postsテーブルの更新
            post_query = update(Post).where(Post.post_id == post_id).values(values)
            session.execute(post_query)

            # Photosテーブルの更新
            for photo_data in photos_data:
                photo_id = photo_data.pop("photo_id", None)
                if photo_id:
                    photo_query = update(Photo).where(Photo.photo_id == photo_id).values(photo_data)
                    session.execute(photo_query)
                else:
                    photo = Photo(post_id=post_id, **photo_data)
                    session.add(photo)

        session.commit()
        return "Post updated successfully"

    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、更新に失敗しました")
        session.rollback()
        return "Post update failed due to integrity constraint violation"

    except Exception as e:
        print(f"Error: {e}")
        session.rollback()
        return "Post update failed"

    finally:
        session.close()


def create_post(user_id, review, rating, store_name, photo_file):
    Session = sessionmaker(bind=engine)
    session = Session()
    try:
        # store_nameに基づいてstore_idを取得
        store = session.query(Store).filter(Store.store_name == store_name).first()
        if store is None:
            return {"status": "error", "message": "Store not found"}
        store_id = store.store_id

        # 新しいPostを作成
        new_post = Post(user_id=user_id, store_id=store_id, review=review, rating=rating)
        session.add(new_post)
        session.commit()

        # 写真データを取得し、バイナリデータに変換
        photo_data = photo_file.read()

        # 新しいPhotoを作成
        new_photo = Photo(post_id=new_post.post_id, photo_data=photo_data)
        session.add(new_photo)
        session.commit()

        return {"status": "success", "message": "Post created successfully"}
    except Exception as e:
        session.rollback()
        return {"status": "error", "message": str(e)}
    finally:
        session.close()

def suggest_store(query):
    
    Session = sessionmaker(bind=engine)
    session = Session()
    
    if query:
        # store_nameに部分一致するStoreを最大5件取得
        stores = session.query(Store).filter(Store.store_name.like(f'%{query}%')).limit(5).all()
        suggestions = [store.store_name for store in stores]
        return suggestions
    else:
        return []