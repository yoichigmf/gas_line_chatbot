
function testGetGJSON(){

  var tg = GetFeaturesGeoJSON("シート1");

  let js = JSON.stringify( tg );

  console.log( js );
}


//   指定シートの地物のGeoJSONを作成する
function GetFeaturesGeoJSON( sheetname ){
  
   let geoJ = { 'type':'FeatureCollection', "name":sheetname,"crs":{"type":"name","properties":{"name":"urn:ogc:def:crs:OGC:1.3:CRS84"}},"features": []};

   let tgSheet =  SpreadsheetApp.getActiveSpreadsheet().getSheetByName( sheetname );

   const rows = tgSheet.getLastRow(); 


   let output_ar = new Array();    // array of output data

   let uid_ar = new Array();   //  array of user id

  // let non_loc_ar = new Array();  // array of non location data

   let ckey = 0;

   //let non_locr = new Array();    //  arrray of non location data for a user

   var arkey;

  // console.log( rows );

   if ( rows > 1){

     for ( let ir = 2 ; ir <= rows; ++ir ){
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

              
                //feature["id"] = arkey;
                //feature["type"] = 'Feature';

                let  coord= [ lon, lat ];

                var  geom = { type:"Point",
                               coordinates: coord  };

                var prop = {
                  user:userd,
                   date:dated,
                   kind: kind,
                   text:stext,
                   url: url,
                   proplist: atrar
                  };


                 var feature = { 
                   　　　　　　　　id: arkey,
                                type:'Feature',
                                geometry:geom ,
                                properties: prop };


                console.log( feature );


                output_ar.push(feature);

            }
         else {  //  location 以外の場合
             if ( ir > 0){

                    var ukey = "";

　　　　　　　　　　　　if ( array_key_exists( userd, uid_ar )) {

                  　　　　let ukeyd  = uid_ar[userd];
                         ukey = userd  + "_" + ukeyd;
                  
                        }
                         else {
                          ukey = arkey;

                         }   //  array_key_exists

                 

                  var natr = {
                  user:userd,
                   date:dated,
                   kind: kind,
                   text:stext,
                   url: url
               
                     };

                    //  console.log( "key "+ ukey);

                  if ( output_ar.length > 0 ) {

                    for ( var ip =0; ip < output_ar.length; ip++){
                     // console.log( "Okey "+ output_ar[ip].id );
                      if ( output_ar[ip].id == ukey ){
                          output_ar[ip].properties.proplist.push(natr);
                      }
                    }
                  }

                }  // ir > 0


             }   //  not location


        
     }
   }

   geoJ["features"]=output_ar;
   console.log( geoJ );

   console.log( output_ar );

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