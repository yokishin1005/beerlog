from sqlalchemy import create_engine, Column, Integer, String, ForeignKey, Sequence, Numeric
from sqlalchemy.orm import sessionmaker, relationship
from sqlalchemy.ext.declarative import declarative_base
from sqlalchemy import Column, Integer, String, LargeBinary, Text

Base = declarative_base()

# ユーザーテーブル定義
class Users(Base):
    __tablename__ = 'users'
    user_id = Column(String(255), primary_key=True)
    user_name = Column(String(50), nullable=False)
    user_mail = Column(String(255), nullable=False)
    user_password = Column(String(255), nullable=False)
    user_picture = Column(LargeBinary)  # BLOB型でプロフィール画像を格納
    user_profile = Column(Text)  # ユーザーのプロフィール文
    age = Column(Integer)
    gender = Column(String(50))

    # UserとPostは1対多の関係
    posts = relationship('Post', back_populates='users')

# POSTテーブル定義
class Post(Base):
    __tablename__ = 'posts'
    post_id = Column(Integer, primary_key=True, autoincrement=True)
    user_id = Column(String(255), ForeignKey('users.user_id'))
    store_id = Column(Integer, ForeignKey('stores.store_id')) 
    review = Column(Text)  # レビューコメント
    rating = Column(Integer)  # 評価は1から5まで
    
    # Postは特定のUserに属する
    users = relationship('Users', back_populates='posts')
    # PostとPhotoは1対多の関係
    photos = relationship('Photo', back_populates='post')
    store = relationship('Store', back_populates='posts')

# 写真テーブル定義
class Photo(Base):
    __tablename__ = 'photos'
    photo_id = Column(Integer, primary_key=True, autoincrement=True)
    post_id = Column(Integer, ForeignKey('posts.post_id'))
    photo_data = Column(LargeBinary)
    
    # PhotoはPostに属する
    post = relationship('Post', back_populates='photos')
    
    
# Userモデルに'posts'関係を追加
    Users.posts = relationship('Post', order_by=Post.post_id, back_populates='users')
    
class Store(Base):
    __tablename__ = 'stores'
    store_id = Column(Integer, Sequence('store_id_seq'), primary_key=True, autoincrement=True)
    store_name = Column(String(255), nullable=False)
    store_address = Column(String(255), nullable=False)
    store_contact = Column(String(255), nullable=True)
    lat = Column(Numeric(10, 8))  # 全体で10桁、小数点以下8桁
    lng = Column(Numeric(11, 8))  # 全体で11桁、小数点以下8桁
    brand_id = Column(String(255), ForeignKey('brands.brand_id'))
    posts = relationship('Post', back_populates='store')

class Brand(Base):
    __tablename__ = 'brands'
    brand_id = Column(Integer, Sequence('brand_id_seq'), primary_key=True, autoincrement=True)
    brand_name = Column(String(255), nullable=False)
    brand_picture = Column(LargeBinary)
    manufacturer_id = Column(String(255), ForeignKey('manufacturers.manufacturer_id'))
    manufacturer = relationship('Manufacturer', back_populates='brands')

class Manufacturer(Base):
    __tablename__ = 'manufacturers'
    manufacturer_id = Column(Integer, Sequence('manufacturer_id_seq'), primary_key=True, autoincrement=True)
    manufacturer_name = Column(String(255), nullable=False)
    brands = relationship('Brand', back_populates='manufacturer')
    
if __name__ == '__main__':
    app.run(debug=True)