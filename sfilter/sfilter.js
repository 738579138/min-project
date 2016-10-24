/**
* sFilter 1.1

* author: ÉÙÏÀ
* update: 2010-09-27
* index: http://www.enjoyphp.com

**********************demo**********************
	<html>
	<head>
	<script type='text/javascript' src='jquery.js'></script>
	<script type='text/javascript' src='sfilter.js'></script>
	<link rel="stylesheet" href='sfilter.css' type="text/css" />

	<script type="text/javascript">
	$(document).ready(function(){
		$("#test").sfilter();
	});
	</script>
	</head>
	<body>
	<select id="test">
		<option value="0">ËùÓÐÆ·ÅÆ</option>
		<option value='70' >A¡¡ABC</option>
		<option value='191' >A¡¡°²Ì©</option>
		<option value='428' >A¡¡°²¼ª¶û</option>
		<option value='122' >A¡¡°²¿É</option>
		<option value='327' >A¡¡°®Äþ</option>
	</select>
	</body>
	</html>
*/
(function($) {
	$.fn.sfilter = function() {
		var _select			= this;								//ÏÂÀ­²Ëµ¥
		var s_width			= Math.round($(this).outerWidth());	//µÃµ½ÏÂÀ­²Ëµ¥¿í¶È
		var s_height		= Math.round($(this).outerHeight());
		var _select_size	= 0;								//ÓÃÓÚÏÂÀ­²Ëµ¥Ñ¡ÏîÊý¼ÆÊýÖ®ÓÃ
		var _select_value	= new Array();						//´æ´¢ÏÂÀ­²Ëµ¥µÄÖµµÄÊý×é
		var _select_text	= new Array();						//´æ´¢ÏÂÀ­²Ëµ¥µÄÎÄ±¾µÄÊý×é
		var name_round		= Math.round(Math.random()*10000);	//·ÀÖ¹±äÁ¿³åÍ»£¬ÔÚÐÂ½¨ÔªËØIDÉÏ¼ÓËæ»úÊý
		var now_select_li;										//ÓÃÓÚ´æ´¢µ±Ç°Ñ¡ÖÐµÄLIÑ¡ÏîµÄjquery±äÁ¿
		var mouse_on_list	= 0;
		var mouse_on_text	= 0;
		var id = this.attr("id");
		this.siblings('.'+id+'').remove();
		this.before("<div class='"+id+" cls_sfilter' id='sfilter_div"+name_round+"'>"+
						"<input  class='lol' type='text' style='width:"+(s_width-2)+"px;' id='sfilter_text"+name_round+"' />"+
						"<ul  class='cls_sfilter_list' id='sfilter_list"+name_round+"'></ul>"+
					"</div>");
		var sfilter_div			=	$("#sfilter_div"+name_round);
		var sfilter_text		=	$("#sfilter_text"+name_round);
		var sfilter_list		=	$('#sfilter_list'+name_round);
		var sfilter_text_offset;
		var sfilter_text_height;
		var sfilter_text_left;
		var sfilter_text_top;
		var sfilter_list_top;



		sfilter_div.height(sfilter_text_height);


		//½«Ñ¡Ïî»º´æÆðÀ´
		_select.children("option").each(function(){
			_select_size++;
			_select_value[_select_size]	= this.value;
			_select_text[_select_size]	= this.text;
		});
		//alert(_select_size);

		var sfilter_text_value	=	sfilter_text.val();


		//ÏÂÀ­²Ëµ¥µÄÊÂ¼þ°ó¶¨
		_select.bind("focus",function(){
			start_select();
		});

		//ÎÄ±¾¿òµÄÊÂ¼þ°ó¶¨
		sfilter_text
			.blur(function(){
				$("#show").val(mouse_on_list);
				if(mouse_on_list==0)
				{
					end_select();
				}
			})
			.mouseover(function(){
				mouse_on_text=1;
			})
			.mouseout(function(){
				mouse_on_text=0;
			})
			.keyup(function(){
				sfilter_text_new_value	=	sfilter_text.val();
				if(sfilter_text_new_value!=sfilter_text_value)
				{
					sfilter_text_value=sfilter_text_new_value;
					if(now_select_li!=undefined) {
						now_select_li=undefined;
					}
					filter_in();
				}
			})
			.keydown(function(event){
				var keycode = event.which;
				//alert(keycode);
				if(keycode == 38){ //up
					if(now_select_li!=undefined) {
						now_select_li.prev().mouseover();
					}else{
						sfilter_list.children("li:first").mouseover();
					}

				}else if(keycode == 40){//down
					if(now_select_li!=undefined) {
						now_select_li.next().mouseover();
					}else{
						sfilter_list.children("li:first").mouseover();
					}
				}else if(keycode == 13 || keycode==32){//enter/space
					if(now_select_li!=undefined) {
						to_select(now_select_li.attr('title'));
						end_select();
					}
				}


				var sfilter_list_scrollTop = sfilter_list.scrollTop();
				if(now_select_li!=undefined){
					var now_select_li_top =now_select_li.position().top;
				}else{
					var now_select_li_top=0;
				}
				$("#text1").val(now_select_li_top);
				$("#text2").val(sfilter_list_scrollTop);
				if(now_select_li_top < 0){
					sfilter_list.scrollTop(Math.round(sfilter_list_scrollTop+now_select_li_top));
				}else if(now_select_li_top>280){
					sfilter_list.scrollTop(Math.round(sfilter_list_scrollTop+now_select_li_top-280));
				}
				if(keycode ==13 || keycode==32){
                    return false;
                }
			})
			;


		//ÁÐ±íliµÄÊÂ¼þ°ó¶¨
		sfilter_list
			.mouseover(function(){
				mouse_on_list=1;
				$("#show").val(mouse_on_list);
			})
			.mouseout(function(){
				mouse_on_list=0;
				$("#show").val(mouse_on_list);
			});

		$(document).click(function(){
			if(mouse_on_list==0 && mouse_on_text==0)
			{
					end_select();
			}
		});

		//¿ªÊ¼Ñ¡Ôñ
		function start_select(){
			_select.hide();

			sfilter_div.css({
				"display"	:	"inline"
			});

			sfilter_text_new_value	=	sfilter_text.val();

			if((sfilter_text_new_value!=sfilter_text_value) || (sfilter_list.children().size()==0))
			{
				filter_in();
			}
			sfilter_text.focus();
		}
		//½áÊøÑ¡Ôñ
		function end_select(){
			sfilter_div.hide();
			_select.show();
		}

		//½«selectÖÐµÄÑ¡ÏîÔØÈëµ½ulÖÐµÄliÁÐ±íÖÐ
		function filter_in(){
			sfilter_list.empty();

			sfilter_text_offset	=	_select.offset();
			sfilter_text_height	=	Math.round(sfilter_text.outerHeight());
			sfilter_text_left	=	Math.round(sfilter_text_offset.left);
			sfilter_text_top	=	Math.round(sfilter_text_offset.top);
			sfilter_list_top	=	sfilter_text_top+sfilter_text_height;


			sfilter_text.css({
				"height"	:	(s_height-2)+"px"
			});

			sfilter_list.css({
				"width"		:	(s_width)+"px",
				"left"		:	0,
				"top"		:	(sfilter_text_height)+'px'
			});

			for(i=1;i<=_select_size;i++)
			{
				if((sfilter_text_value.length!=0) && (_select_text[i].toUpperCase().indexOf(sfilter_text_value.toUpperCase())==-1)){
					continue;
				} else {
					sfilter_list.append("<li title='"+_select_value[i]+"'\">"+_select_text[i]+"</li>");
					//alert("<li title='"+_select_value[i]+"' \">"+_select_text[i]+"</li>");
				}
			}

			sfilter_list.children("li")
				.mouseover(function(){
					if(now_select_li!=undefined) {
						now_select_li.removeClass("select_class");
					}

					$(this).addClass("select_class");
					now_select_li=$(this);


				})
				.click(function(){
					to_select(this.title);
					end_select();
				});

		}

		//Ñ¡¶¨Ä³¸öÖµ
		function to_select(svalue){
			_select.val(svalue);
		}



	};
})(jQuery);


