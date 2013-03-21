/** This is used to fix stuff, it contains defaults **/
var CONSOLE_FIX_DEFAULTS = {
	"settings":{
		".head":0,
		"matcher":{
			"tid":{
				"\u52a8\u753b":1,
				"\u97f3\u4e50":3,
				"\u6e38\u620f":4,
				"\u5a31\u4e50":5,
				"\u610f\u89c1\u7559\u8a00\u7c3f":9,
				"\u5c08\u8f2f":11,
				"\u516c\u544a":12,
				"\u65b0\u756a\u8fde\u8f7d":13,
				"\u5c08\u8f2f\u4e09\u6b21\u5143":15,
				"flash\u6e38\u620f":16,
				"\u6e38\u620f\u89c6\u9891":17,
				"\u6e38\u620f\u653b\u7565\u00b7\u89e3\u8bf4":18,
				"Mugen":19,
				"\u821e\u8e48":20,
				"\u751f\u6d3b\u5a31\u4e50":21,
				"MAD\u00b7AMV":24,
				"MMD\u00b73D":25,
				"\u4e8c\u6b21\u5143\u9b3c\u755c":26,
				"\u671f\u520a\u00b7\u5176\u4ed6":27,
				"\u97f3\u4e50\u89c6\u9891":28,
				"\u4e09\u6b21\u5143\u97f3\u4e50":29,
				"VOCALOID\u76f8\u5173":30,
				"\u7ffb\u5531":31,
				"\u5c08\u8f2f\u4e8c\u6b21\u5143":32,
				"\u65b0\u756a\u4e8c\u6b21\u5143":33,
				"\u65b0\u756a\u4e09\u6b21\u5143":34,
				"\u79d1\u5b66\u6280\u672f":36,
				"\u79d1\u666e\u77e5\u8bc6":37,
				"\u4eba\u6587\u5730\u7406":38,
				"\u5168\u7403\u79d1\u6280":39,
				"\u91ce\u751f\u6280\u672f":40	
			},
			"tidversion":2
		},
		"timers":{
			"refresh":60,
			"sync":60
		},
		"watchlist":{
			"autoupdate":{
				"delay":0,
				"enabled":true
			},
			"hideRaws":{
				"series":true,
				"tags":false
			}
		},
		"privacy":{
			"history":{
				"allow":true,
				"bangumi":0,
				"douga":0,
				"collection":0,
				"music":0,
				"other":0
			},
			"allow3rdParty":false,
			"allowPlugins":true,
			"promptPlugins":true
		},
		"interface":{
			"pnToggle":true,
			"contextMenu":{
				"enabled":true,
				"matchers":{
					"av(\\d+)":"http://www.bilibili.tv/video/av{1}"
				}
			},
			"condensed":true
		},
		"sync":{
			"enabled":false,
			"server":"",
			"key":"",
			"deviceId":"",
			"lastSync":0,
			"serverHead":0
		},
		"plugins":{
			"security":{
				"trusted":"10001:C4E3F7212602E1E396C0B6623CF11D26204ACE3E7D26685E037AD2507DCE82FC28F2D5F8A67FC3AFAB89A6D818D1F4C28CFA548418BD9F8E7426789A67E73E41",
				"trusted":"3:BC86E3DC782C446EE756B874ACECF2A115E613021EAF1ED5EF295BEC2BED899D26FE2EC896BF9DE84FE381AF67A7B7CBB48D85235E72AB595ABF8FE840D5F8DB"
			}
		}
	},
	"transient":[],
	"flags":{
		"invoke.disableAlarms":"undefined",
		"invoke.cacheClean":"2d",
		"header.imgOrder":"randomNewest",
		"taskqueue.terminateTimeout":"disabled",
		"language.override":"default",
		"theme.showHiddenThemes":false,
		"theme.experimentalHeader":false,
		"sync.ignorePermissions":false,
		"automation.executeMacros":false
	}
};

