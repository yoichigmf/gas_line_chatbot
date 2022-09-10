//スプレッドシートのB1セルに配置したLINEボットのアクセストークンを取得
//const ACCESS_TOKEN = SpreadsheetApp.getActiveSheet().getRange(1, 2).getValue();

//   暫定対応   #propety という名前のシートにトークンとか書き込み
//  Bセルに値
//  Line Messaging APIトークン   1行目
//  DROPBOXACCESSTOKEN          2行目
//  SPEECHAPIKEY　　　　　　　　　 3行名


const ACCESS_TOKEN = getPropetySheet().getRange(1, 2).getValue();

const DROPBOX_TOKEN = getPropetySheet().getRange(2, 2).getValue();


//Googleドライブに作ったフォルダのURL
const FOLDER_ID = ScriptProperties.getProperty('FOLDER_ID');
//LINE返信用エンドポイント
const REPLY_URL = 'https://api.line.me/v2/bot/message/reply';


function  getPropetySheet(){

   let tgSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('#property');

   //console.log( tgSheet);
   return tgSheet;
}

function getUuid() {
  return Utilities.getUuid();
}

function testFilename(){

   fname = make_filename_path( "image", "jpg");

   console.log( fname );
}
function make_filename_path( kind, ext ){  //  make unique file name full path


           uid = getUuid();

           filePath = kind + "_" + uid + "." + ext;
      

           return filePath;
}


 function send2dropbox(file) {
  var dropboxTOKEN =  DROPBOX_TOKEN ;

  var path = 'somePath/' + file.getName();
  var dropboxurl = 'https://api.dropboxapi.com/2/files/save_url';
  var fileurl = 'https://drive.google.com/uc?export=download&id=' + file.getId(); 

  var headers = {
    'Authorization': 'Bearer ' + dropboxTOKEN,
     'Content-Type': 'application/json'
  };
  var payload = {
    "path": path,
    "url": fileurl
  }
  var options = {      
    method: 'POST',
    headers: headers,
    payload: payload      
  }; 

  var response = UrlFetchApp.fetch(dropboxurl, options);  
  Logger.log( response );
  return response;  
}


function testupload(){
    const folderId ='1_G2VZkqqXFo6OQ9zuAHy5icmwsrEtk3g';
    const folder = DriveApp.getFolderById(folderId);
    Logger.log( folder.getName());
    
    var tgfiles = folder.getFilesByName('1661572752303.jpg');
    //var tgfiles = folder.getFiles();

    while( tgfiles.hasNext()){
      var tgf = tgfiles.next();
      Logger.log( tgf.getName());
      uploadGoogleFilesToDropbox(tgf) ;
    }
}
function uploadGoogleFilesToDropbox(googleDriveFileId) {
  var parameters = {
    path: '/PDF/labnol.jpg',
    mode: 'add',
    autorename: true,
    mute: false,
  };

  // Add your Dropbox Access Token
  var dropboxAccessToken =  DROPBOX_TOKEN ;

  var headers = {
    'Content-Type': 'application/octet-stream',
    Authorization: 'Bearer ' + dropboxAccessToken,
    'Dropbox-API-Arg': JSON.stringify(parameters),
  };
 // Logger.log( googleDriveFileId.getName());
  var driveFile = googleDriveFileId;

  var options = {
    method: 'POST',
    headers: headers,
    payload: driveFile.getBlob().getBytes(),
  };
//Logger.log(options);
  var apiUrl = 'https://content.dropboxapi.com/2/files/upload';
  var response = JSON.parse(UrlFetchApp.fetch(apiUrl, options).getContentText());

  Logger.log(response);

  fname = response.path_display;

  ures = createSharedLink( '/PDF/labnol.jpg',);
  Logger.log(ures);
  Logger.log('File uploaded successfully to Dropbox');
}



function testShared(){

   var filepath = '/PDF/labnol.jpg';
   ret = createSharedLink( filepath );
  Logger.log(ret);
}


// get shared link metadata
function getSharedLinkMetadata(){
  
}


//  get url of drop box file
function createSharedLink( filepath ){
  var parameters = {
    path: filepath,
 //   settings: {
  //      access: "viewer",
  //      allow_download: true,
   //     audience: "public",
   //    requested_visibility: "public"
   // },
    
  };
/*

  curl -X POST https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings \
    --header "Authorization: Bearer <ACCESS_TOKEN>" \
    --header "Content-Type: application/json" \
    --data "{\"path\": \"/Prime_Numbers.txt\",\"settings\": {\"requested_visibility\": \"public\"}}"
*/

  // Add your Dropbox Access Token
  var dropboxAccessToken =  DROPBOX_TOKEN ;

  var headers = {
   'Content-Type': 'application/json',
    'Authorization': 'Bearer ' + dropboxAccessToken,
   //　'Dropbox-API-Arg': JSON.stringify(parameters),
  };
  var options = {
    'method': 'POST',
    'headers': headers,
    'payload':JSON.stringify(parameters),
     'muteHttpExceptions': true,
  };
  
  Logger.log(headers);
  Logger.log(options);
  var apiUrl = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

  try{
  var response = UrlFetchApp.fetch(apiUrl, options).getContentText();
  
  return response;
  }
  catch(e){
  Logger.log(e)
  }

}
//  $kind   'image'  'video'  'voice'
//  $ext    'jpg'    'mp4'    'mp4'
//  $content_type  application/octet-stream

//  content upload to dropbox

function upload_contents( kind , ext, content_type, response ,appname ) {
        
 //          file upload


           filename = make_filename( kind, ext );

           tgfilename = "/disasterinfo/" + appname + "/" + kind +"/" + filename ;

           var parameters = {
                  path: tgfilename,
                  mode: 'add',
                  autorename: true,
                 mute: false,
             };

           // Add your Dropbox Access Token
           var dropboxAccessToken =  DROPBOX_TOKEN ;

           var headers = {
               'Content-Type':  content_type,
                 Authorization: 'Bearer ' + dropboxAccessToken,
               'Dropbox-API-Arg': JSON.stringify(parameters),
              };
           //Logger.log( googleDriveFileId.getName());
  ////var driveFile = googleDriveFileId;

  var options = {
    method: 'POST',
    headers: headers,
    payload: response.getRawbody()
  };

      var apiUrl = 'https://content.dropboxapi.com/2/files/upload';
      var response2 = JSON.parse(UrlFetchApp.fetch(apiUrl, options).getContentText());

 /*



                   $ch = curl_init();

                  curl_setopt_array($ch, $options);

                 $result = curl_exec($ch);

                 $log->addWarning("result ${result}\n");


                  curl_close($ch);



                 $path = createSharedLink( $tgfilename );  //
                 return $path;

                 */

  }


function testToken(){
   console.log( ACCESS_TOKEN);
}

//LINEに投稿された写真を自動保存するためのGoogleドライブのフォルダを作成
function makeDirectory() {
  //スプレッドシートのB2セルからフォルダ名を取得
  const folderName = SpreadsheetApp.getActiveSheet().getRange(2, 2).getValue();
  //Googleドライブにフォルダを作成し、フォルダIDを取得
  const folderId = DriveApp.createFolder(folderName).getId();
  //GoogleドライブのフォルダIDをスクリプトプロパティに保存
  ScriptProperties.setProperty('FOLDER_ID', folderId);
}

//LINEにメッセージを送信する関数
function sendMsg(url, payload) {
  UrlFetchApp.fetch(url, {
    'headers': {
      'Content-Type': 'application/json; charset=UTF-8',
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'post',
    'payload': JSON.stringify(payload),
  });
}

//  指定ユーザのプロファイル取得　　( フォローある場合)
function  getUserProfile( id ){
 const url = 'https://api.line.me/v2/bot/profile/' + id ;

 try {
  const response = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'muteHttpExceptions':true,
    'method': 'get'
  });

  let json = JSON.parse(response);
  return json;
 }
 catch(e){
   return null;
 }
 
}

//LINEのトーク画面にユーザーが投稿した画像を取得し、返却する関数
function getImage(id) {
  //画像取得用エンドポイント
  const url = 'https://api-data.line.me/v2/bot/message/' + id + '/content';
  const data = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'get'
  });
  //ファイル名を被らせないように、今日のDateのミリ秒をファイル名につけて保存
  const img = data.getBlob().setName(Number(new Date()) + '.jpg');
  return img;
}
//LINEトークに投稿された画像をGoogleドライブに保存する関数
function saveImage(blob) {
  try {
    const folder = DriveApp.getFolderById(FOLDER_ID);
    const file = folder.createFile(blob);
    file.addViewers()
    return file.getId();
  } catch (e) {
    return false;
  }
}

//スクリプトが紐付いたスプレッドシートに投稿したユーザーIDとタイムスタンプを記録
function recodeUser(userId, timestamp, id) {
  //シートが1つしかない想定でアクティブなシートを読み込み、最終行を取得
  const mySheet = SpreadsheetApp.getActiveSheet();
  const lastRow = mySheet.getLastRow();
  //スプレッドシートに写真保存が実行された履歴を保存
 
  mySheet.getRange(1 + lastRow, 1).setValue(Utilities.formatDate(new Date(timestamp), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  mySheet.getRange(1 + lastRow, 2).setValue(userId);
  mySheet.getRange(1 + lastRow, 3).setValue("image");
  //mySheet.getRange(1 + lastRow, 3).setValue(id);
  mySheet.getRange(1 + lastRow, 4).setValue('https://drive.google.com/file/d/' + id);
  mySheet.getRange(1 + lastRow, 8).setValue('LINE');
  return 0;
}

function recodText(userId, timestamp, tgText) {
  //シートが1つしかない想定でアクティブなシートを読み込み、最終行を取得
  const mySheet = SpreadsheetApp.getActiveSheet();
  const lastRow = mySheet.getLastRow();
  // テキスト書き込み
  mySheet.getRange(1 + lastRow, 1).setValue(Utilities.formatDate(new Date(timestamp), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  mySheet.getRange(1 + lastRow, 2).setValue(userId);
  mySheet.getRange(1 + lastRow, 3).setValue("text");
  //mySheet.getRange(1 + lastRow, 3).setValue(id);
  mySheet.getRange(1 + lastRow, 5).setValue(tgText);
  mySheet.getRange(1 + lastRow, 8).setValue('LINE');
  return 0;
 
}


function recodLocation(userId, timestamp, lat, lon, address) {
  //シートが1つしかない想定でアクティブなシートを読み込み、最終行を取得
  const mySheet = SpreadsheetApp.getActiveSheet();
  const lastRow = mySheet.getLastRow();
  // テキスト書き込み
  mySheet.getRange(1 + lastRow, 1).setValue(Utilities.formatDate(new Date(timestamp), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  mySheet.getRange(1 + lastRow, 2).setValue(userId);
  mySheet.getRange(1 + lastRow, 3).setValue("location");
  //mySheet.getRange(1 + lastRow, 3).setValue(id);
  mySheet.getRange(1 + lastRow, 5).setValue(address);
  mySheet.getRange(1 + lastRow, 6).setValue(lat);
  mySheet.getRange(1 + lastRow, 7).setValue(lon);
  mySheet.getRange(1 + lastRow, 8).setValue('LINE');
  return 0;
 
}

function testprofile(){

  uprofile = getUserProfile('U5c07954fca1129144783a3d9027a9822');
  
  console.log( uprofile["displayName"])
}


//この関数の中にクエリパラメータを配列形式で設定する
//idがない場合は下記載の配列からidを消す
//id= のように空の場合のテストをしたい場合id:'' にする
function debugTest(){
  const e = {
    parameter:{
      id:'33',
      name: 'AA'      
    }
  }
  const a = doGet(e);

}



function doGet(e) {
 //パラメータをログに出力してみる。
  console.log(e.parameter['id']);
  console.log(e.parameter['name']);

  //パラメータがある場合変数にはパラメータの値が入る
  //パラメータが無いもしくはあるけれど値が空の場合変数にはfalseが入る
  let id=e.parameter['id'] ? e.parameter['id']:false
  let name=e.parameter['name'] ? e.parameter['name']:false


  if (id===false){
    console.log("パラメータidがないもしくは値が空の場合の処理")    
  }
  if (name===false){
　　　console.log("パラメータnameがないもしくは値が空の場合の処理")
  }
  return ContentService.createTextOutput("Hello doGet");
}

function doPost(e) {
  //アクティブなスプレッドシートを読み込み、メッセージフラブを読み取り
  const mySheet = SpreadsheetApp.getActiveSheet();
  const mesFlag = mySheet.getRange(3, 2).getValue();
  //LINEWebhookで受信したイベントの数だけ処理を実行
  for (let event of JSON.parse(e.postData.contents).events) {

    uprofile = getUserProfile(event.source.userId);


    username = '不明';
    if (uprofile != null){
       username = uprofile["displayName"];
    }
    
    //Webhookのメッセージタイプが画像の場合のみ処理を実行
    if (event.message.type == 'image') {
      try {
        let img = getImage(event.message.id);
        let id = saveImage(img);
        recodeUser(username, event.timestamp, id, event);
        if (mesFlag === 'ON') {
          sendMsg(REPLY_URL, {
            'replyToken': event.replyToken,
            'messages': [{
              'type': 'text',
              'text': '画像保存しました。\nhttps://drive.google.com/file/d/' + id + '\n',
            }]
          });
        }
      } catch (e) {
        Console.log(e);
      }
      //Webhookのメッセージタイプがテキストで「写真保存先」が含まれていると、保存先を通知
    } else if (event.message.type == 'text') {
      try {
          recodText(username, event.timestamp, event.message.text, event);
      }
      catch (e) {
        Console.log(e);
      }

      
      if (event.message.text.indexOf('画像保存先') > -1) {
        sendMsg(REPLY_URL, {
          'replyToken': event.replyToken,
          'messages': [{
            'type': 'text',
            'text': '写真保存先↓\nhttps://drive.google.com/drive/folders/' + FOLDER_ID,
          }]
        });  // send message
      } //  event.messsage
    } else if (event.message.type == 'location') {
        recodLocation(username, event.timestamp, event.message.latitude,  event.message.longitude,event.message.address);
    }
  }

  return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}
