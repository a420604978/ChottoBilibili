var $ = function (e) {
    return document.getElementById(e);
};
var $c = function (c) {
    return document.getElementsByClassName(c);
};

function openPopup(pageURL, title, w, h) {
    var left = (screen.width / 2) - (w / 2), top = (screen.height / 2) - (h / 2);
    console.log("Left:" + left + " Top:" + top);
    chrome.extension.sendMessage({
        "method": "openPopup",
        "width":w,
		"height":h,
		"top":top,
		"left":left,
		url:pageURL,
    }, function(resp){});
    return null;
}

function addCollectInterface() {
    var tmInfo = $c("tminfo");
    try {
        if (tmInfo !== null && tmInfo.length > 0) {
            var infoBlock = tmInfo[0],sectData = infoBlock.getElementsByTagName('a');
            var section = "";
            for (var n = 0; n < sectData.length; n++) {
                if (n != 0)
                    section += "_" + sectData[n].innerText;
                else
                    section = sectData[n].innerText;
            }
            var trigger = document.createElement('a');
            trigger.setAttribute("href", "javascript:;");
            trigger.style.color = "#f93";
            trigger.addEventListener("click", function () {
                var avid = /av(\d+)/.exec(document.location.pathname);
                var title = "";
                var tbox = document.getElementsByClassName('info');
                if (tbox.length > 0) {
                    var titles = tbox[0].getElementsByTagName('h2');
                    if (titles.length > 0) {
                        var titleElem = titles[0];
                        var title = titleElem.innerText;
                        title = title.replace(/\s»$/, '');
                        title = title.replace(/^«\s/, '');
                    }
                }
                chrome.extension.sendMessage({
                    "method": "addFollowDlg",
                    "title": title,
                    "section": section,
                    "avid": avid
                }, function (response) {
                    if (response.accepted) {
                    	
                        console.log(chrome.extension.getURL("addprompt.html"));
                        var w = openPopup(chrome.extension.getURL("addprompt.html"), "", 600, 480);
                    } else {
                        alert(chrome.i18n.getMessage("add_match_not_found"));
                    }
                });
            });
            document.addEventListener("keydown",function(k){
            	if(k !== null && k.keyCode !== null && k.keyCode === 187 && k.ctrlKey === true && k.altKey === true){
            		trigger.style.backgroundColor = "#F93";
            		trigger.style.color = "#FFF";
            		trigger.click();
            	}
            });
            trigger.appendChild(document.createTextNode(
                chrome.i18n.getMessage("content_collect")));
            if ($("stow_count") != null) {
                infoBlock.insertBefore(trigger, $("stow_count").nextSibling);
                $("stow_count").style.marginRight = "0px";
                trigger.style.marginRight = "13px";
                var text = trigger.innerText;
                trigger.innerText = "(" + text + ")";
            } else
                infoBlock.appendChild(trigger);
        }
    } catch (e) {
        console.log("[ChottoBilibili] Matcher returned illegal reference.");
    }
}

addCollectInterface();
