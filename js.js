
/*//z.B.
var items=[
    { de:'das Haus', en:'home', lab:'label', 12:['de','en'] }
]; 
var de=[], em=[], lab=[]; //zB
                /*
    				localStorage.setItem("key", "wert");
					localStorage.getItem("key");
					localStorage.clear();
					localStorage.length
*/
//$( document ).bind( "mobileinit", function() {
    $.mobile.pushStateEnabled = false;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.page.prototype.options.domCache = true;
    $.mobile.defaultPageTransition="none"
//});

var w = window;
var log = function(){
   // console.log.apply(console,arguments);
}
log('init');
var items=w.localStorage.getItem('items');
try{ items=JSON.parse(items); }catch(e){ items=[] };

if(!Array.isArray(items)) items=[];

var itemsNew=true;
var orgText;

$(function() {
    $("#lang_from").change(function() {
        lang_from=this.value;
        w.localStorage.setItem("lang_from", this.value);
    });
    $("#lang_to").change(function() {
        lang_to=this.value;
        w.localStorage.setItem("lang_to", this.value);
    });
    $("#lang_change").click(function() {
        var temp = lang_to;
        lang_to = lang_from;
        lang_from = temp;
        
        $("#lang_from").val(lang_from).selectmenu('refresh');
        $("#lang_to").val(lang_to).selectmenu('refresh');

        w.localStorage.setItem("lang_from", lang_from);
        w.localStorage.setItem("lang_to", lang_to);
    });
    $("#searchform").submit(function() {
		orgText = $.trim($("#text").val());
		if(orgText.length > 0){
			log('orgText.length > 0');
			$.ajax({
				type: "GET",
				url: "http://translate.google.de/translate_a/t",
                //url: 'http://prtra.zeror.c9.io/go',
				//url: "http://pro.gseel.de/test/logParam.php",
				data: { client: "t", text: orgText, hl:lang_to, sl:lang_from, tl :lang_to }
			}).done(function (res){
				log(res);
                var translated='';
				var json=JSON.parse(res.replace(/,,/g,",null,").replace(/,,/g,",null,"));
				try{
					json[0][0][0]; log('Parse OK');
				}catch(e){
					translated = 'Parse Error';
					return;
				}
				//log(json);
				for (var i=0, l=json[0].length; i < l; i++){
					translated += json[0][i][0];
				}
				log(translated);
				$("#trans").html('<button class="star" data-icon="star" data-iconpos="right" data-mini="true" data-inline="true" >'+translated+'</button>');
				var h='';
				if( Array.isArray(json[1])	){
					for (var i=0, li=json[1].length; i < li; i++){
						if (!json[1][i][0]) continue;
						h+='<div style="float: left;margin: 3px;">'; 
						h+='<div style="text-align: center;"><h4>'+ json[1][i][0]+'</h4></div>'; 
						for (var j=0, lj=json[1][i][1].length; j < lj; j++){
							h+='<button class="star" data-icon="star" data-iconpos="right" data-mini="true">'+json[1][i][1][j]+'</button>'; 
						}
						h+='</div>'; 
					}
				}
				$("#trans2").html(h);
                $(".star").button().click(function(){
                    if (!confirm('Save Item "'+this.innerHTML+'"')) return true;

                    items.push([orgText,this.innerHTML]);
                    itemsNew=true;
                    w.localStorage.setItem('items', JSON.stringify(items));
                });
				
			}).fail(function(jqXHR, textStatus) {
			  w.alert( "Request failed: " + textStatus );
			});
		}
		return false;
	});
    
    $("#starpage").click(function(){
        log('starpage');
        if(!itemsNew) return true;
        
        var h='<table style="width:100%;">';
        for (var i=0, li=items.length; i < li; i++){
            h+='<tr><td>'+items[i][0]+'</td><td>'+ items[i][1]+'</td>';
            h+='<td><button class="starDel" data-icon="delete" data-iconpos="notext" data-item="'+items[i][0]+' :: '+ items[i][1]+'">'+i+'</button></td><tr>';
        }
        h+='</table>';
        
        $("#starPlatz").html(h);
        itemsNew=false;
        $(".starDel").button().click(function(){
            log('click: .starDel');
            if (!confirm('Delete Item "'+$(this).data('item')+'"')) return true;
            items.splice(this.innerHTML,1);
            itemsNew=true;
            w.localStorage.setItem('items', JSON.stringify(items));
            $("#starpage").click();
            
        });
            
    });

});