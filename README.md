# ```data.json```に記述されるデータの構造について
以下のような構造でJSONデータがとして記述されます
```
{
  // 司令一覧
  "missions": [],
  // Userの一覧
  "users": [
    {
      //Userを一意に識別することができるUUID
      "uuid": "",
      //最後にログインした時間
      "lastAccessedAt": 1548539891219,
      //Userが登録した時間
      "createdAt": 1548539891219
    }
  ],
  // チャット情報の一覧
  "messages": [
    {
      //チャットを投稿したUserを識別するUUID
      "user_uuid": "",
      //チャットに投稿した内容
      "text": "",
      //チャットを一意に識別できるUUID
      "uuid": ""
    }
  ]
}
```
