var Main = new function () {
	this.list = new BangumiList("plugin",new CommitCallback());
	this.settings = new SettingsConnector();
	this.startCheck = function (){
		var createSectTask = function (section){
			var worker = new SectionWorker(section, Main.list);
			if(worker.done(true))
				return; /* Nothing to do! */
				
			var task = jsPoll.create(function(self){
				var xhr = new XMLHttpRequest();
				var local = self.local;
				var inst = self;
				xhr.onreadystatechange = function(){
					if(xhr.readyState == 4){
						try{
							var api = JSON.parse(xhr.responseText);
						}catch(e){
							if(xhr.responseText == "error"){
								console.log("[Err](API)Resp: E_API_ERROR");
								inst.complete();
								return;
							}
							if(local.retryCount < 8){
								local.retryCount++;
								setTimeout(function(){
									jsPoll.push(task);
									inst.complete();
								},1000 * Math.pow(2,local.retryCount));
								return;
							}else{
								console.log("[Err](API)Resp: E_LIMIT_OVER");
								/* Flush the worker */
								worker.flush();
								inst.complete();
								return;
							}
						}
						if(api.code != null && api.code == -1){
							console.log("[Err](API):" + api.error);
							inst.complete();
							return;
						}
						/* Api Data Correctly Read */
						for(var j=0;j < Math.min(parseInt(api.num) - (local.curpage - 1) * 200,200);j++){
							if(api.list["" + j] == null)
								continue;
							worker.matchInstance(api.list["" + j]);
							if(worker.done(true)){
								break;
							}
						}
						local.rempages = parseInt(api.pages) - local.curpage;
						local.curpage++;
						if(!worker.done()){
							if(local.rempages > 0){
								jsPoll.push(task);
								inst.complete();
							}else{
								worker.flush();
								inst.complete();
							}
						}else{
							/* Worker is done! */
							inst.complete();
						}
						console.log("[Log] Batch " + (local.curpage - 1)); 
					}
				};
				xhr.open("GET", 
				  "http://api.bilibili.tv/list?type=json&appkey=" + Main.settings.getApiKey() + 
				  "&tid=" + worker.getSection() + 
				  "&page=" + local.curpage + 
				  "&pagesize=200&order=default", true);
				xhr.send();
			});
			task.local.curpage = 1;
			task.local.rempages = 1;
			task.local.retryCount = 0;
			/** Push this task **/
			jsPoll.push(task);
		};
		/** Create tasks according to section **/
		var sections = Main.list.getSections();
		for(var i = 0; i < sections.length; i++){
			createSectTask(sections[i]);
		}
		/** Also, add a new task to fetch the bangumidata **/
		var nt = jsPoll.create(function(self){
			var xhr = self.global.xhr;
			xhr.onreadystatechange = function (){
				if(xhr.readyState == 4){
					try{
						var api = JSON.parse(xhr.responseText);
					}catch(e){
						if(xhr.responseText == "error"){
							console.log("[Err](API)Resp: E_API_ERROR");
							self.complete();
							return;
						}
					}
				}
			};
			xhr.open("GET","http://api.bilibili.tv/bangumi?type=json&appkey" + Main.settings.getApiKey() +
			"&btype=2",true);
			xhr.send();
		});
		
		/** Run The jsPoll~ **/
		jsPoll.run();
	};
	this.recache = function(){
		var caches = Main.list.getAllCached();
		var cacheDB = new CacheDB();
		cacheDB.refresh();
		jsPoll.global.xhr = new XMLHttpRequest();
		jsPoll.create(function(self){
		
		});
	};
}

/** ADD LISTENERS FOR INCOMING REQUESTS **/
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	if(sender.tab){
		if(request.method == null){
			console.log("[War](Msg)Illegal Msg.Intern");
			sendResponse({});//Snub it
			return;
		}
		switch(request.method){
			case "biliStalker":{
				sendResponse({});
				return;
			}break;
			case "getSetting":{
				var sObj = (Main == null) ? new SettingsConnector() : Main.settings;
				var val = sObj.get(request.key);
				sendResponse({value:val});
				return;
			}break;
			case "getBangumiList":{
				try{
					var bgml = JSON.parse(localStorage["bangumi"]);
					sendResponse(bgml);
				}catch(e){
					sendResponse({});
				}
				return;
			}break;
		}
	}else{
		
	}
	sendResponse({});/* Snub them */
});

/** Create the timers or alarms **/
if(!chrome.runtime){
	/* Include support for legacy chrome */
	var duration = Main.settings.get('refresh.dur');
	duration = (duration == null ? 15 : duration);
	setInterval(duration * 60000, function(){
		//Main.startCheck();
	}); 
}else{
	var delay = Main.settings.get("refresh.dur");
	delay = (delay == null ? 15 : delay);
	chrome.alarms.create('refresh',{periodInMinutes: delay});
	chrome.alarms.onAlarm.addListener(function(a){
		if(a.name == "refresh"){
			//Main.startCheck();
		}
	});
}