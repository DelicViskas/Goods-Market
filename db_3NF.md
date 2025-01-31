# Схема базы данных:

  ## Users
    1. users_id(PK)
    2. user_name
    3. email
    4. password
    5. created

  ## Categories
    1. category_id(PK)
    2. name

  ## Goods
    1. goods_id(PK)
    2. user_id(FK)
    3. category_id(FK)
    4. title
    5. price
    6. description
    7. created

  ## Reviews
    1. review_id(PK)
    2. sender_rw_id(FK)
    3. receiver_rw_id(FK)
    4. rating
    5. comment
    6. created

  ## Messages
    1. messages_id(PK)
    2. sender_ms_id(FK)
    3. receiver_ms_id(FK)
    4. content
    5. created

  ## Favorites
    1. favorite_id(PK)
    2. user_id(FK)
    3. goods_id(FK)
