/* 
* @Author: anchen
* @Date:   2015-10-28 14:52:39
* @Last Modified by:   anchen
* @Last Modified time: 2015-10-29 15:17:36
*/

$(document).ready(function(){
    function wordChange(){
       $(window).resize(change);
           function change(){
            if($("html").width() >= 640){
                $("html").css({
                    "font-size": "24px"
                })
            }else {
                $("html").css({
                    "font-size": 24/640*$("html").width()+"px"
                })
            }
       }change();
    }wordChange();
});