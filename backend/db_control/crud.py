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

    try:
        # トランザクションを開始
        with session.begin():
            if isinstance(mymodel, mymodel.Post):  # 修正: isinstance を使用
                # 投稿データを挿入する
                query = insert(mymodel.Post).values(values)  # 修正: mymodels.Post を使用
                result = session.execute(query)
                inserted_post_id = result.inserted_primary_key[0]

                # 画像データが含まれている場合は、Photo モデルにも挿入する
                if 'photo' in values:
                    photo_base64 = values['photo']
                    photo_data = base64.b64decode(photo_base64)

                    photo_values = {
                        'post_id': inserted_post_id,
                        'photo_data': photo_data
                    }
                    photo_query = insert(mymodel.Photo).values(photo_values)
                    session.execute(photo_query)

                return inserted_post_id
            else:
                # その他のモデルの場合は、通常の挿入処理を行う
                query = insert(mymodel).values(values)
                result = session.execute(query)
                return result.inserted_primary_key[0]

    except sqlalchemy.exc.IntegrityError:
        print("一意制約違反により、挿入に失敗しました")
        session.rollback()
        return None

    finally:
        # セッションを閉じる
        session.close()


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