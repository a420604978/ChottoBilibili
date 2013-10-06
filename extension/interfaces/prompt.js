var $ = function(e){return document.getElementById(e);};
function trimtitle(text, soft){
	if(!soft){
		text = text.replace(/^\u3010(?:(?!\u3010).)+?\u3011/g, "");
	}else{
		text = text.replace(/^\u3010\d+\u6708\u3011/g, "");
	}
	text = text.replace(/(\u3010(?:(?!\u3010).)+?\u3011)+$/g, "");
	text = text.replace(/\s»$/,"");
	text = text.replace(/^«\s/,"");
	text = text.replace(/\s*$/,"");
	if(!soft){
		text = text.replace(/\d+\s*$/,"");
		text = text.replace(/\s*$/,"");
		text = text.replace(/\u7B2C.+?$/,"");
	}
	return text;
}

function match(title){
	var found = [];
	var masterMatcher = /\u7B2C([\u96F6\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07]+)[^\u5B63]/g;
	while(m = masterMatcher.exec(title)){
		found.push([m.index,m[1],0]);
	}
	//Another master matcher
	var secondaryMatcher = /(\d+)(?![\u6708\u5E74\d])/g;
	while(n = secondaryMatcher.exec(title)){
		var sid = parseInt(n[1]);
		if(sid < 1000 && 
			!(new RegExp("(\u7B2C){0,1}\\s*" + n[1] + "\\s*\u5B63").test(title)) && 
			!(new RegExp(n[1] + "\\s*\u5E74").test(title)) &&
			!(new RegExp("\u5168.*?\u96C6").test(title))){
			//This is not a season number or year
			found.push([n.index,n[1],1]);
		}
	}
	return found;
}

var trans = new TransientPrayer();
var bgml = new BangumiList();
var data = trans.get("add.data", null);

window.addEventListener("load", function(){	
	if(data == null){
		document.title = "Error: No Data";
		return;
	}
	document.title = chrome.i18n.getMessage("content_collect_title", trimtitle(data.title));
	$("bangumiNameGuess").innerText = trimtitle(data.title);
	$("bangumiTypeGuess").innerText = "追番列表";
	$("pBangumiName").value = trimtitle(data.title);
	$("pBangumiName").addEventListener("keyup", function(){
		if(this.value.length <= 48){
			$("bangumiNameGuess").innerText = this.value;
		}
		if(this.parentNode == null || this.parentNode.parentNode == null)
			return;
		else{
			if(this.value == "" || this.value.length > 48){
				this.parentNode.parentNode.className = "control-group error";
			}else{
				this.parentNode.parentNode.className = "control-group";
			}
		}
	});
	
	var found = match(trimtitle(data.title, true));
	if(found.length == 0){
		//Could Not even find a suitable thing
		$("cg_regex").className = "control-group error";
		$("cg_msg").innerText = "无法确定匹配式，请手动输入！"
	}else{
		//Populate the data
		var current = Tools.parseTextNumber(found[0][1]);
		var guessTotal = bgml.findClosestTotal(current);
		
		$("pProgress").value = current;
		$("pTotal").value = guessTotal;
		
		//Make sure that progress cannot be non-number
		$("pProgress").addEventListener("keyup",function(){
			this.value = this.value.replace(/[^0-9]/,"");
			if(this.value === "")
				return;
			try{
				this.value = parseInt(this.value);
			}catch(e){
				this.value = "0";
			} 
		});
		$("pTotal").addEventListener("keyup",function(){
			this.value = this.value.replace(/[^0-9]/,"");
			if(this.value === "")
				return;
			try{
				if($("pProgress") !== null && $("pProgress").value !== ""){
					this.value = Math.max(parseInt(this.value), parseInt($("pProgress").value));
				}else{
					this.value = parseInt(this.value);
				}
			}catch(e){
				this.value = "0";
			} 
		});
		
		
		//Create the rule
		var modTitle = trimtitle(data.title, true);
		var _temp_fore = modTitle.substr(0,found[0][0]);
		var _temp_back = modTitle.substr(found[0][0]+found[0][1].length);
		var _temp_fore_rule = _temp_fore.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		var _temp_back_rule = _temp_back.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, "\\$&");
		var rule = _temp_fore_rule;
		if(found[0][2] == 0){
			rule += "([\u96F6\u4E00\u4E8C\u4E09\u56DB\u4E94\u516D\u4E03\u516B\u4E5D\u5341\u767E\u5343\u4E07]+)";
		}else{
			rule += "(\\d+)";
		}
		rule += _temp_back_rule;
		
		$("pRegexp").value = rule;
	}
	
	$("btnSubmit").addEventListener("click",function(evt){
		//Create the rule based on the current information;
		if(evt !== null && evt.preventDefault !== null){
			evt.preventDefault();
		}
		var rule = {};
		if(data.avid !== null && data.avid[1] != null && /^\d+$/.test(data.avid[1])){
			rule.type = 8;
		}else{
			rule.type = 1;
		}
		try{
			if($("pTotal").value !== "" && $("pProgress").value !== ""){
				if(parseInt($("pTotal").value) < parseInt($("pProgress").value)){
					alert(chrome.i18n.getMessage("prompt_progress_too_large"));
					return;
				}else{
					rule.current = parseInt($("pProgress").value);
					rule.total = parseInt($("pTotal").value)
				}
			}else{
				alert(chrome.i18n.getMessage("prompt_progress_blank"));
				return;
			}
		}catch(e){
			alert(chrome.i18n.getMessage("prompt_progress_err"));
			return;
		}
		if($("pComments") !== null && $("pComments").value !== ""){
			rule.desc = $("pComments").value;
		}
		rule.name = $("pBangumiName").value;
		rule.matcher = {
			"m":$("pRegexp").value,
			"e":""
		};
		if(rule.type === 8){
			rule.last = parseInt(data.avid[1]);
		}
		//Create new instance of bgml
		var bgml = new BangumiList();
		
		//Check if this rule exists
		if(bgml.query(rule.name, "name") !== null){
			if(!confirm(chrome.i18n.getMessage("prompt_existing_record"))){
				return;
			}
		}
		bgml.add(rule, data.section);
		bgml.commit();
		window.close();
	});
	
	document.addEventListener("keydown", function(k){
		if(k !== null && k.keyCode === 13 && k.ctrlKey === true){
			$("btnSubmit").click();
		}
	});
});
