/*
its={
    'label':{
        count:xxx,
        items:{
            '1111':['aa','bb'],
            ...
        }
    },
    ...
}
*/

var w = window;
var log = function(){
   console.log.apply(console,arguments);
}
log('init');

var itemsNew=true;
var orgText;

$(function() {
    $.mobile.pushStateEnabled = false;
    $.mobile.allowCrossDomainPages = true;
    $.mobile.page.prototype.options.domCache = true;
    $.mobile.defaultPageTransition="none";
    
    $('#main').bind('swipeleft',function(){ $.mobile.changePage("#starpage");});
    $('#main').bind('swiperight',function(){ $.mobile.changePage("#setpage"); });
    $('#starpage').bind('swipeleft',function(){ $.mobile.changePage("#setpage");});
    $('#starpage').bind('swiperight',function(){ $.mobile.changePage("#main");});
    $('#setpage').bind('swipeleft',function(){ $.mobile.changePage("#main");});
    $('#setpage').bind('swiperight',function(){ $.mobile.changePage("#starpage");});
    
    $("#lang_from").change(function() {
        lang_from=this.value;
        w.localStorage.setItem("lang_from", this.value);
    });
    $("#lang_to").change(function() {
        lang_to=this.value;
        w.localStorage.setItem("lang_to", this.value);
    });
    $("#lang_change").bind('vclick',function() {

        var temp = lang_to;
        lang_to = lang_from;
        lang_from = temp;
        
        $("#lang_from").val(lang_from).selectmenu('refresh');
        $("#lang_to").val(lang_to).selectmenu('refresh');

        w.localStorage.setItem("lang_from", lang_from);
        w.localStorage.setItem("lang_to", lang_to);
    });
    var ttt;
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
			}).done(ttt = function (res){
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
                $(".star").button().bind('vclick', function(){
                  
                    if (!confirm('Save in "'+aktLab+'" Item "'+this.innerHTML+'"')) return true;
                    if (its[aktLab]){
                        var c = its[aktLab].count += 1;
                        its[aktLab].items[c]=[orgText,this.innerHTML];
                        
                    }else{
                        its[aktLab]={
                            count:1,
                            items:{ 1 : [orgText,this.innerHTML]}
                        }
                        ilab.push(aktLab);
                        w.localStorage.setItem('ilab', JSON.stringify(ilab));
                    }
                    w.localStorage.setItem(aktLab, JSON.stringify(its[aktLab]));
                    itemsNew=true;
                });
				
			}).fail(function(jqXHR, textStatus) {
			  w.alert( "Request failed: " + textStatus );
              ttt('[[["nach Hause","home","",""]],[["Adverb",["nach Hause","zu Hause","zuhause","daheim","heimwärts"],[["nach Hause",["home","homewards"]],["zu Hause",["at home","home","in","indoors","on the home front"]],["zuhause",["at home"]],["daheim",["home","at home"]],["heimwärts",["home","homeward","in a homeward direction"]]]],["Substantiv",["Haus","Heimat","Zuhause","Heim","Inland","Daheim","Wohnheim","Waisenhaus","Anstalt","Ziel"],[["Haus",["house","home","building","household","property","family"]],["Heimat",["home","homeland","native country","native land","motherland","home town"]],["Zuhause",["home"]],["Heim",["home","hostel","clubhouse","hall of residence","recreation center"]],["Inland",["inland","home"]],["Daheim"],["Wohnheim",["dormitory","dorm","hostel","hall of residence","home"]],["Waisenhaus",["orphanage","home"]],["Anstalt",["institution","institute","establishment","home"]],["Ziel",["target","goal","aim","objective","destination","home"]]]],["Adjektiv",["Heim-","heimisch","privat","inländisch"],[["Heim-",["home"]],["heimisch",["home","native","indigenous","familiar","local","regional"]],["privat",["private","home","personal","independent"]],["inländisch",["domestic","inland","home"]]]],["Verb",["heimkehren"],[["heimkehren",["home"]]]]],"en",,[["nach Hause",[5],1,0,780,0,2,0]],[["home",4,,,""],["home",5,[["nach Hause",780,1,0],["Zuhause",131,1,0],["Heimat",37,1,0],["Heim",28,1,0],["Haus",22,1,0]],[[0,4]],"home"]],,,[["en"]],441]');

			});
		}
		return false;
	});
    
    
    var starpageShow;
    $('#starpage').bind('pagebeforeshow',starpageShow = function(){
        log('starpage');
        if(!itemsNew) return true;
        var h='';
        for ( var lab in its){
            h+='<h4 style="margin-bottom: 0px;">'+lab+'</h4>';
            h+='<table style="width:100%;">';
            var items = its[lab].items;
            for (var i in items){
                h+='<tr><td>'+items[i][0]+'</td><td>'+ items[i][1]+'</td>';
                h+='<td><button class="starDel" data-icon="delete" data-iconpos="notext" data-mini="true" data-item="'+items[i][0]+' :: '+ items[i][1]+'" ';
                h+='data-label="'+lab+'">'+i+'</button></td><tr>';
            }
            h+='</table>';
        }
        
        $("#starPlatz").html(h);
        itemsNew=false;
        $(".starDel").button().bind('vclick',function(){
            log('click: .starDel');
            if (!confirm('Delete Item "'+$(this).data('item')+'"')) return true;
            var lab = '' + $(this).data('label');//toString
            delete its[lab].items[this.innerHTML];
            
            if($.isEmptyObject(its[lab].items)){
                delete its[lab];
                w.localStorage.removeItem(lab);
                var index = ilab.indexOf(lab);
                if (index !=-1) ilab.splice(index,1);
                console.log(ilab);
                w.localStorage.setItem('ilab', JSON.stringify(ilab));
                
            }else{
                w.localStorage.setItem(lab, JSON.stringify(its[lab]));    
            }
            itemsNew=true;
            starpageShow();
            
        });
            
    });
    
    //setpage
     $("#addLabel").bind('vclick',function() {

        var label = prompt("Add Label");
        if (!label || !label.trim()) return;
        $('#selectLabel').append('<option>'+label+'</option>');
        labels.push(label);
        w.localStorage.setItem('labels', JSON.stringify(labels));

    });
    $("#delLabel").bind('vclick',function() {
        $('#selectLabel option:selected').each(function(){
            if(this.value==-1)return;
            var index = labels.indexOf(this.text);
            if(index==-1) return;
            if (!confirm('Delete Label "'+this.text+'"')) return true;
            labels.splice(index, 1);
            w.localStorage.setItem('labels', JSON.stringify(labels));
            $(this).remove();
        });
        $("#selectLabel").selectmenu('refresh');
        aktLab=$('#selectLabel option:selected')[0].text;
        w.localStorage.setItem("aktLab", this.value);
    });
    $("#selectLabel").change(function() {
        aktLab=$('#selectLabel option:selected')[0].text;
        w.localStorage.setItem("aktLab", aktLab);

    });

});