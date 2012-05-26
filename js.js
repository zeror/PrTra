$(function() {
    $("#lang_from").change(function() {
        lang_from=this.value;
        localStorage.setItem("lang_from", this.value);
    });
    $("#lang_to").change(function() {
        lang_to=this.value;
        localStorage.setItem("lang_to", this.value);
    });
    $("#lang_change").click(function() {
        var temp = lang_to;
        lang_to = lang_from;
        lang_from = temp;
        
        $("#lang_from").val(lang_from).selectmenu('refresh');
        $("#lang_to").val(lang_to).selectmenu('refresh');

        localStorage.setItem("lang_from", lang_from);
        localStorage.setItem("lang_to", lang_to);
    });
    $("#searchform").submit(function() {
		var text = $.trim($("#text").val());
		if(text.length > 0){
			console.log('terwr');
			$.ajax({
				type: "GET",
				url: "http://translate.google.de/translate_a/t",
				//url: "http://pro.gseel.de/test/logParam.php",
				data: { client: "t", text: text, hl:lang_to, sl:lang_from, tl :lang_to }
			}).done(function (res){
				var translated='';
				var json=JSON.parse(res.replace(/,,/g,",null,").replace(/,,/g,",null,"));
				try{
					json[0][0][0]; console.log('Parse OK');
				}catch(e){
					translated = 'Parse Error';
					return;
				}
				console.log(json);
				for (var i=0, l=json[0].length; i < l; i++){
					translated += json[0][i][0];
				}
				console.log(translated);
				$("#trans").html(translated+'<button class="star" data-icon="star" data-iconpos="notext" data-inline="true" ></button>');
				var h='';
				if( Array.isArray(json[1])	){
					for (var i=0, li=json[1].length; i < li; i++){
						if (!json[1][i][0]) continue;
						h+='<div style="float: left;margin: 5px;">'; 
						h+='<div style="font-weight: bold;">'+ json[1][i][0]+'</div>'; 
						for (var j=0, lj=json[1][i][1].length; j < lj; j++){
							h+='<div>'+ json[1][i][1][j]+'<button class="star" data-icon="star" data-iconpos="notext" data-inline="true"></button></div>'; 
						}
						h+='</div>'; 
					}
				}
				$("#trans2").html(h);
                $(".star").button();
				
                
                /*
					localStorage.setItem("key", "wert");
					localStorage.getItem("key");
					localStorage.clear();
					localStorage.length*/
		
			
				//alert(transText);
			}).fail(function(jqXHR, textStatus) {
			  alert( "Request failed: " + textStatus );
			});
		}
		return false;
	});

});