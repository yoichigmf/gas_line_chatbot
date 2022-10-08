
function testGetGJSON(){

  GetFeaturesGeoJSON( "シート1");
}


//   指定シートの地物のGeoJSONを作成する
function GetFeaturesGeoJSON( sheetname ){
  
   let geoJ = { 'type':'FeatureCollection', 'features': new Array()};

   let tgSheet =  SpreadsheetApp.getActiveSpreadsheet().getSheetByName( sheetname );

   const rows = tgSheet.getLastRow(); 


   let output_ar = new Array();    // array of output data

   let uid_ar = new Array();   //  array of user id

   let non_loc_ar = new Array();  // array of non location data

   let ckey = 0;

   let non_locr = new Array();    //  arrray of non location data for a user



   console.log( rows );

   if ( rows > 1){

     for ( let ir = 1 ; ir < rows; ++ir ){
        let tgr = tgSheet.getRange(ir,1 ,1,8).getValues();

        //console.log( tgr );
       // console.log(tgr[0][7]);

        let dated = tgr[0][0];
        let userd = tgr[0][1];
        let kind  = tgr[0][2];
        let url   = tgr[0][3];
        let  stext = tgr[0][4];





        if ( tgr[0][7] == "report_post"){

            console.log("report_post");


            continue;

        }
        else if ( tgr[0][7] == "line" ){
            //console.log("LINE");
      

        }


        if ( kind == "location") {
               console.log(userd);
      

               let lat = tgr[0][5];
               let lon = tgr[0][6];

               console.log(uid_ar);

               if ( array_key_exists( userd, uid_ar )) {

                  ckey = uid_ar[userd] + 1;
                  uid_ar[userd] = ckey;
               }
               else {
                 ckey = 0;
                 uid_ar[userd] = ckey;
               }
               //console.log(lat);



                let arkey = userd + "_" + ckey ;
                
                let atrar = new Array();

                feature = new Array();

                feature["id"] = arkey;
                feature["type"] = 'Feature';

                let geom = new Array();

                geom["type"] = "Point";

                let  coordinate = [ lon, lat ];

                geom["coordinates"] = coordinate;
                //coordinate.add( lon );

                feature["geometry"]=geom;

                //let prop = new Array();
                var prop = {
                  user:userd,
                   date:dated,
                   kind: kind,
                   text:stext,
                   url: url,
                   proplisr: atrar
        };

                feature["properties"] =prop;


                geoJ["features"].push(feature);
                
                //console.log( "push" );


            }


        
     }
   }

   console.log( geoJ );
   return geoJ;
}

//  配列中に指定キーがあるかどうか
 function array_key_exists( userd, uid_ar ){

  

   if ( uid_ar[userd] != undefined) {
      return true;
   }
   else {

   return false;
   }
 }