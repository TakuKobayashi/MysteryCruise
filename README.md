# ```data.json```に記述されるデータの構造について
以下のような構造でJSONデータがとして記述されます
```
{
  // 指令一覧
  "missions": [
     {
         //指令を一意に識別することができるID
         "id": 1,
         //管理画面で登録した指令の内容
         "text": "",
         //ユーザへの配信済みフラグ(0:未配信、1:配信済み)
         "is_published": 0,
     }
  ],
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

# 司令を通知させたい時
```
http://localhost:8000/notice?missionId=[ミッションId]
```
でミッションIDを入れて、GetでHTTPリクエストしてください。