//スプレッドシートのB1セルに配置したLINEボットのアクセストークンを取得
//const ACCESS_TOKEN = SpreadsheetApp.getActiveSheet().getRange(1, 2).getValue();

//   暫定対応   #propety という名前のシートにトークンとか書き込み
//  Bセルに値
//  Line Messaging APIトークン   1行目
//  DROPBOXACCESSTOKEN          2行目
//  SPEECHAPIKEY　　　　　　　　　 3行名


const ACCESS_TOKEN = getPropetySheet().getRange(1, 2).getValue();

const DROPBOX_TOKEN = getPropetySheet().getRange(2, 2).getValue();

const APPNAME = getPropetySheet().getRange(4, 2).getValue();

//Googleドライブに作ったフォルダのURL
const FOLDER_ID = ScriptProperties.getProperty('FOLDER_ID');
//LINE返信用エンドポイント
const REPLY_URL = 'https://api.line.me/v2/bot/message/reply';


function  getPropetySheet(){

   let tgSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('#property');

   //console.log( tgSheet);
   return tgSheet;
}

//  シート１を取得
function  getFirstSheet(){

   let tgSheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('シート1');

   //console.log( tgSheet);
   return tgSheet;
}

function getUuid() {
  return Utilities.getUuid();
}

//   書き込み対象シートを取得
function  getTargetSheet(){

　　　let fsheet = getFirstSheet();

     return fsheet;

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
      resultf = "/PDF/test.jpg"
      uploadGoogleFilesToDropbox(tgf, resultf ) ;
    }
}




function make_filename( kind, ext ){  //  make unique file name

   uid = getUuid();

   filePath = kind + "_" + uid + "." + ext;
      

    return filePath;


}


function testbinupload(){
    const folderId ='1_G2VZkqqXFo6OQ9zuAHy5icmwsrEtk3g';
    const folder = DriveApp.getFolderById(folderId);
    Logger.log( folder.getName());
    
    var tgfiles = folder.getFilesByName('1661572752303.jpg');
    //var tgfiles = folder.getFiles();


    appname = "sample";
    kind = "image";
    ext = "jpg";

    while( tgfiles.hasNext()){
      var tgf = tgfiles.next();
      Logger.log( tgf.getName());

      filename = make_filename( kind, ext );

      tgfilename = "/disasterinfo/" + appname + "/" + kind +"/" + filename ;

      Logger.log( tgfilename);
      resultf = tgfilename;
      let bdata = tgf.getBlob().getBytes();
      ret = uploadBindataToDropbox(bdata, resultf ) ;

     Logger.log( ret );
    }
}

//  バイナリデータをDropBoxに保存する

function uploadBindataToDropbox( bindata, resultfilename ) {
  var parameters = {
    path: resultfilename ,
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
 // var driveFile = googleDriveFileId;

  var options = {
    method: 'POST',
    headers: headers,
    payload: bindata,
  };
//Logger.log(options);
  var apiUrl = 'https://content.dropboxapi.com/2/files/upload';
  var response = JSON.parse(UrlFetchApp.fetch(apiUrl, options).getContentText());

  Logger.log(response);

  fname = response.path_display;

  ures = createSharedLink( resultfilename );
  Logger.log(ures);
  Logger.log('File uploaded successfully to Dropbox');

  return ures;
}

//  Google drive 上のファイルをDropBoxに保存する
function uploadGoogleFilesToDropbox(googleDriveFileId, resultfilename ) {
  var parameters = {
    path: resultfilename ,
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

  ures = createSharedLink( resultfilename );
  Logger.log(ures);
  Logger.log('File uploaded successfully to Dropbox');

  return ures;
}



function testShared(){

   var filepath = '/PDF/labnol.jpg';
   ret = createSharedLink( filepath );
  Logger.log(ret);
}




//  get url of drop box file
function createSharedLink( filepath ){
  var parameters = {
    path: filepath,

    
  };

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
     'setting':{
     'requested_visibility':{".tag":"public"}},
     'muteHttpExceptions': true,
  };
  
  Logger.log(headers);
  Logger.log(options);
  var apiUrl = 'https://api.dropboxapi.com/2/sharing/create_shared_link_with_settings';

  try{
  var response = UrlFetchApp.fetch(apiUrl, options).getContentText();
   rt = JSON.parse(response);
  return rt;
  }
  catch(e){
  Logger.log(e);
  return null;
  }

}
//  $kind   'image'  'video'  'voice'
//  $ext    'jpg'    'mp4'    'mp4'
//  $content_type  application/octet-stream

//  content upload to dropbox

function upload_contents( kind , ext, content_type, bindata ,appname ) {
        
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
 

           var options = {
              method: 'POST',
              headers: headers,
              payload:bindata
             // payload: response.getRawbody()
        };

      var apiUrl = 'https://content.dropboxapi.com/2/files/upload';
      var response2 = JSON.parse(UrlFetchApp.fetch(apiUrl, options).getContentText());


    var response3 = createSharedLink( tgfilename );

    return response3;


  }

//LINEのトーク画面にユーザーが投稿した画像を取得  byte列を返す
function getImageBytes(id) {
  //画像取得用エンドポイント
  const url = 'https://api-data.line.me/v2/bot/message/' + id + '/content';
  const data = UrlFetchApp.fetch(url, {
    'headers': {
      'Authorization': 'Bearer ' + ACCESS_TOKEN,
    },
    'method': 'get'
  });

  return data.getBlob.getBytes();

  //
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

  //return data.getBlob;

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
function recordUser(userId, timestamp, id) {
  //シートが1つしかない想定でアクティブなシートを読み込み、最終行を取得
  const mySheet =  getTargetSheet();
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

function recordText(userId, timestamp, tgText) {
  //　　書き込み対象シートを読み込み、最終行を取得
  const mySheet = getTargetSheet();
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


function recordLocation(userId, timestamp, lat, lon, address) {
  //書き込み対象シートを読み込み、最終行を取得
  const mySheet = getTargetSheet();
  const lastRow = mySheet.getLastRow();
  // テキスト書き込み
  mySheet.getRange(1 + lastRow, 1).setValue(Utilities.formatDate(new Date(timestamp), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  mySheet.getRange(1 + lastRow, 2).setValue(userId);
  mySheet.getRange(1 + lastRow, 3).setValue("location");
  //mySheet.getRange(1 + lastRow, 3).setValue(id);
  mySheet.getRange(1 + lastRow, 5).setValue(address);
  mySheet.getRange(1 + lastRow, 6).setValue(lat);
  mySheet.getRange(1 + lastRow, 7).setValue(lon);
  mySheet.getRange(1 + lastRow, 8).setValue('line');
  return 0;
 
}

function  recordImg(username, timestamp, fileurl, event){
  const mySheet = getTargetSheet();
  const lastRow = mySheet.getLastRow();
  // テキスト書き込み
  mySheet.getRange(1 + lastRow, 1).setValue(Utilities.formatDate(new Date(timestamp), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  mySheet.getRange(1 + lastRow, 2).setValue(username);
  mySheet.getRange(1 + lastRow, 3).setValue("image");

  mySheet.getRange(1 + lastRow, 4).setValue(fileurl);
  imgurl = fileurl.replace("dl=0", "dl=1");
  imgurl = "=image(\"" + imgurl + "\")";
  mySheet.getRange(1 + lastRow, 5).setValue(imgurl);
  //mySheet.getRange(1 + lastRow, 7).setValue(lon);
  mySheet.getRange(1 + lastRow, 8).setValue('line');
  return 0;

}

function  recordMov(username, timestamp, fileurl, event){
  const mySheet = getTargetSheet();
  const lastRow = mySheet.getLastRow();
  // テキスト書き込み
  mySheet.getRange(1 + lastRow, 1).setValue(Utilities.formatDate(new Date(timestamp), 'JST', 'yyyy-MM-dd HH:mm:ss'));
  mySheet.getRange(1 + lastRow, 2).setValue(username);
  mySheet.getRange(1 + lastRow, 3).setValue("video");

  mySheet.getRange(1 + lastRow, 4).setValue(fileurl);
  imgurl = fileurl.replace("dl=0", "dl=1");
  imgurl = "=image(\"" + imgurl + "\")";
  mySheet.getRange(1 + lastRow, 5).setValue(imgurl);
  //mySheet.getRange(1 + lastRow, 7).setValue(lon);
  mySheet.getRange(1 + lastRow, 8).setValue('line');
  return 0;

}



//この関数の中にクエリパラメータを配列形式で設定する
//idがない場合は下記載の配列からidを消す
//id= のように空の場合のテストをしたい場合id:'' にする
function debugTest(){
  const e = {
    parameter:{
      id:'33',
      name: 'AA'  ,
      cmd:'GETFEATURS'

    }
  }
  const a = doGet(e);

  console.log(a);

}


function debugTest2(){
  const e = {
    parameter:{
      id:'33',
      name: 'AA'  ,
      cmd:'MAP'

    }
  }


    
  const a = doGet(e);

  console.log(a);

}

function debugTest3(){
  const e = {
    parameter:{
      id:'33',
      name: 'AA'  ,
      cmd:'MAPD'

    }
  }


    
  const a = doGet(e);

  console.log(a);

}

function sheetnames() { 
  var out = new Array()
  var sheets = SpreadsheetApp.getActiveSpreadsheet().getSheets();
  for (var i=0 ; i<sheets.length ; i++) out.push( [ sheets[i].getName() ] )
  return out  
}



function testgjson(){

  let gj = getGeoJson();
  console.log(gj);
  let js =JSON.stringify( gj );

  console.log(js);

}

function  getGeoJson(){

let gjson =
{
"type": "FeatureCollection",
"name": "sampledata",
"crs": { "type": "name", "properties": { "name": "urn:ogc:def:crs:OGC:1.3:CRS84" } },
"features": [
{ "type": "Feature", "properties": { "fid": 1, "name": "sample1", "dt": "2022-10-09T00:00:00" }, "geometry": { "type": "Point", "coordinates": [ 139.768754134689544, 35.67818273215471 ] } },
{ "type": "Feature", "properties": { "fid": 2, "name": "sample2", "dt": "2022-10-04T00:00:00" }, "geometry": { "type": "Point", "coordinates": [ 139.772060947524153, 35.680218430776414 ] } },
{ "type": "Feature", "properties": { "fid": 3, "name": "sample3", "dt": "2022-10-09T20:37:04" }, "geometry": { "type": "Point", "coordinates": [ 139.763513148310153, 35.679593367015016 ] } }
]
};

return gjson;



}


function doGet(e) {
 //パラメータをログに出力してみる。
  console.log(e.parameter['id']);
  console.log(e.parameter['name']);
  console.log(e.parameter['cmd']);


  

  let  CMD = e.parameter['cmd'];

  if ( CMD != undefined) {

  //  シートリストの取得
  if ( CMD.toUpperCase() == 'GETSHEETS'){

      console.log("sheets !!");

      let snames = sheetnames();

      console.log( snames );

      return ContentService.createTextOutput(JSON.stringify( snames )).setMimeType(ContentService.MimeType.JSON);


  }　
  else if (CMD.toUpperCase() == 'GETFEATURS'){
    //   地物の取得

　　　let  tgsheet = e.parameter['sheet'] ? e.parameter['sheet']:false;

     if ( tgsheet === false ){  //  シートの指定が無い場合
　　　　　　tgsheet = "シート1";
     }

     
     let gjson = GetFeaturesGeoJSON( tgsheet );

　　　space = 2;
     console.log( JSON.stringify( gjson, null,space ));

     return ContentService.createTextOutput(JSON.stringify( gjson, null, space  )).setMimeType(ContentService.MimeType.JSON);

  }
    else if (CMD.toUpperCase() == 'GFTEST'){
    //   地物の取得

　　/*
　let  tgsheet = e.parameter['sheet'] ? e.parameter['sheet']:false;

     if ( tgsheet === false ){  //  シートの指定が無い場合
　　　　　　tgsheet = "シート1";
     }

     
     let gjson = GetFeaturesGeoJSON( tgsheet );

     console.log( JSON.stringify( gjson ));
     */

    let gjson = getGeoJson();


     return ContentService.createTextOutput(JSON.stringify( gjson )).setMimeType(ContentService.MimeType.JSON);

  }
  else if (CMD.toUpperCase() == 'MAP'){



   var htmlOutput = HtmlService.createTemplateFromFile("index").evaluate();

     htmlOutput
    .setTitle("地図表示テスト")
    .addMetaTag('viewport', 'width=device-width, initial-scale=1')


   return htmlOutput;
  }

  }


  return ContentService.createTextOutput("Hello doGet");
}



function testbinpost(){
    const folderId ='1_G2VZkqqXFo6OQ9zuAHy5icmwsrEtk3g';
    const folder = DriveApp.getFolderById(folderId);
    Logger.log( folder.getName());
    
    var tgfiles = folder.getFilesByName('1661572752303.jpg');
    //var tgfiles = folder.getFiles();


    appname = "sample";
    kind = "image";
    ext = "jpg";

    while( tgfiles.hasNext()){
      var tgf = tgfiles.next();
      Logger.log( tgf.getName());

      filename = make_filename( kind, ext );

      tgfilename = "/disasterinfo/" + appname + "/" + kind +"/" + filename ;

      Logger.log( tgfilename);
      resultf = tgfilename;
      let bdata = tgf.getBlob().getBytes();
      //ret = uploadBindataToDropbox(bdata, resultf ) ;

     //Logger.log( ret );

      addimage( bdata , resultf );
    }
}


function addimage( bindata, resultfilename){
//Webhookのメッセージタイプが画像の場合のみ処理を実行
    
      
        let appname = getAppname();

       // let img = getImageBytes(event.message.id);
              
        img = bindata;
        kind = "image";
        ext = "jpg";

      //  filename = make_filename( kind, ext );

      //  resultfilename = "/disasterinfo/" + appname + "/" + kind +"/" + filename ;

        response = uploadBindataToDropbox( img , resultfilename ) 
      

        fileurl = response["url"];
       
       Logger.log( fileurl);
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
    
    client_pg = "line";

    //Webhookのメッセージタイプが画像の場合のみ処理を実行
    if (event.message.type == 'image') {
      try {



       // let appname = getAppname();
    
     
        let img = getImage(event.message.id);


        kind = "image";
        ext = "jpg";

        filename = make_filename( kind, ext );

        resultfilename = "/disasterinfo/" + APPNAME + "/" + kind +"/" + filename ;

        response = uploadBindataToDropbox( img , resultfilename ) 
  

        fileurl = response["url"];
      

        recordImg(username, event.timestamp, fileurl, event);

        if (true) {
          sendMsg(REPLY_URL, {
            'replyToken': event.replyToken,
            'messages': [{
              'type': 'text',
              'text': '画像共有　' + fileurl ,
            }]
          });
        }
      } catch (e) {
        Console.log(e);
      }

    } else if (event.message.type == 'video' ){

    try {
     
        let img = getImage(event.message.id);


        kind = "video";
        ext = "mp4";

        filename = make_filename( kind, ext );

        resultfilename = "/disasterinfo/" + APPNAME + "/" + kind +"/" + filename ;

        response = uploadBindataToDropbox( img , resultfilename ) 
  

        fileurl = response["url"];
      

        recordMov(username, event.timestamp, fileurl, event);

        if (true) {
          sendMsg(REPLY_URL, {
            'replyToken': event.replyToken,
            'messages': [{
              'type': 'text',
              'text': '動画共有　' + fileurl ,
            }]
          });
        }
      } catch (e) {
        Console.log(e);
      }
    
   



    } else if (event.message.type == 'text') {
      try {


          //   #help    #map  #list   

          //  #comment   


          recordText(username, event.timestamp, event.message.text, event);
      　　 if (true) {
          　sendMsg(REPLY_URL, {
            'replyToken': event.replyToken,
            'messages': [{
              'type': 'text',
              'text': 'テキストメッセージ 　' +  event.message.text ,
            }]
          });
        }

      }
      catch (e) {
        Console.log(e);
      }

    
    } else if (event.message.type == 'location') {

        //title = event.message.title;
        address = event.message.address;
        latitude = event.message.latitude;
        longitude = event.message.longitude;

         try {
             recordLocation(username, event.timestamp, event.message.latitude,  event.message.longitude,event.message.address);

          

          let loctext = "入力位置情報 " + address + " " +  latitude + " " + longitude;

             sendMsg(REPLY_URL, {
            'replyToken': event.replyToken,
            'messages': [{
              'type': 'text',
              'text': loctext,
                 }]
            });
         }
            catch (e) {
            Console.log(e);
            }
    }


  }

  return ContentService.createTextOutput(JSON.stringify({ 'content': 'post ok' })).setMimeType(ContentService.MimeType.JSON);
}
