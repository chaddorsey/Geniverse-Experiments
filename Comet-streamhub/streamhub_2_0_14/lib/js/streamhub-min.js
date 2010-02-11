var StreamHub=function(){this.pRequestQueue=[];
this.mTopicToListener={};
this.sDomain=StreamHub.DomainUtils.extractDomain(document.domain);
this.bIsResponseIFrameConnected=false;
this.connectionMonitorId=null;
this.oLogger=new StreamHub.NullLogger();
this.sUid=new Date().valueOf();
this.pConnectionListeners=[]
};
StreamHub.POLLING_CONNECTION="POLL";
StreamHub.STREAMING_CONNECTION="STREAM";
StreamHub.prototype={connect:function(A){this.sUrl=A;
this.sConnectionType=StreamHub.STREAMING_CONNECTION;
document.domain=this.sDomain;
if(A.serverList){this.sUid=A.staticUID||this.sUid;
this.sFailoverAlgorithm=(A.failoverAlgorithm===undefined)?"ordered":A.failoverAlgorithm;
this.nReconnectDelayMillis=this.nInitialReconnectDelayMillis=(A.initialReconnectDelayMillis===undefined)?1000:A.initialReconnectDelayMillis;
this.nMaxReconnectDelayMillis=(A.maxReconnectDelayMillis===undefined)?-1:A.maxReconnectDelayMillis;
this.nMaxReconnectAttempts=(A.maxReconnectAttempts===undefined)?-1:A.maxReconnectAttempts;
this.bExponentialBackOff=(A.useExponentialBackOff===undefined)?false:A.useExponentialBackOff;
this.nBackOffMultiplier=(A.backOffMultiplier===undefined)?1:A.backOffMultiplier;
this.sConnectionType=(A.connectionType===undefined)?StreamHub.STREAMING_CONNECTION:A.connectionType;
this.nReconnectAttempts=0;
this.pServerList=A.serverList;
this.nServerIndex=0;
this.sUrl=A.serverList[this.nServerIndex];
if(this.sFailoverAlgorithm=="priority"){this.nServerIndex=-1
}}this.doConnect(this.sUrl)
},disconnect:function(){var A=this.sDisconnectUrl;
this.oLogger.log("Disconnecting");
this.stopPolling();
this.request(A,"disconnect",this.buildDisconnectionResponse(this));
this.isDeliberateDisconnect=true
},subscribe:function(D,C){this.addSubscriptionListeners(D,C);
var B=this.buildSubscriptionList(D);
var A=this.sSubscribeUrl+"&topic="+B;
this.request(A,B,this.buildSubscriptionResponse(this))
},unsubscribe:function(C){var A=this.buildSubscriptionList(C);
var B=this.sUnSubscribeUrl+"&topic="+A;
this.request(B,A,this.buildUnSubscribeResponse(this))
},publish:function(A,C){var B=this.sPublishUrl+"&topic="+A+"&payload="+encodeURIComponent(C);
this.oLogger.log("Publishing to "+B);
this.request(B,A,this.buildPublishResponse(this))
},setLogger:function(A){if(typeof A.log!=="function"){alert("Logger must have a function called 'log'")
}else{this.oLogger=A
}},addConnectionListener:function(A){this.pConnectionListeners.push(A)
},connectFrames:function(A){if(StreamHub.Browser.isIEFamily()){if(this.sConnectionType===StreamHub.STREAMING_CONNECTION){this.eResponseIFrame=this.addIFrame({id:"responseIFrame"+new Date().valueOf(),src:""});
this.connectResponseIFrame()
}this.eRequestIFrame=this.addIFrame({id:"requestFrame"+new Date().valueOf(),src:""});
this.connectRequestIFrame()
}else{this.eContainerIFrame=this.addIFrame({id:"containerIFrame"+new Date().valueOf(),src:this.sIFrameHtmlUrl})
}},doConnect:function(A){this.preConnectCleanUp();
window.x=this.buildOnResponseData(this);
if(this.sConnectionType===StreamHub.STREAMING_CONNECTION){if(StreamHub.Browser.isFirefoxFamily()&&!StreamHub.Browser.isFF3()){window.l=this.buildConnectionLost(this)
}else{window.l=function(){}
}}window.c=this.buildConnect(this);
window.onunload=this.buildCleanUp(this);
if(StreamHub.Browser.isIEFamily()||StreamHub.Browser.isFF3()){window.r=this.buildOnRequestComplete(this)
}this.buildUrls(A);
this.connectFrames(A)
},buildConnect:function(A){return function(){if(A.bConnectCalled===false){A.bConnectCalled=true;
var B=A.eContainerIFrame.contentWindow.document.getElementsByTagName("frame");
A.eRequestIFrame=B[0];
A.eResponseIFrame=B[1];
A.connectRequestIFrame.apply(A);
if(A.sConnectionType===StreamHub.STREAMING_CONNECTION){A.connectResponseIFrame.apply(A)
}}}
},addSubscriptionListeners:function(C,B){if(C instanceof Array){for(var A=0;
A<C.length;
A++){this.addTopicListener(C[A],B)
}}else{this.addTopicListener(C,B)
}},buildSubscriptionList:function(D){var B=D;
if(D instanceof Array){B="";
for(var A=0;
A<D.length;
A++){var C=D[A];
B+=C;
if(A!=(D.length-1)){B+=","
}}}return B
},connectRequestIFrame:function(){this.oLogger.log("Connecting request iFrame to "+this.sRequestUrl);
this.request(this.sRequestUrl,"Connect",this.buildConnectionResponse(this))
},connectResponseIFrame:function(){this.oLogger.log("Connecting response iFrame to "+this.sResponseUrl);
if(StreamHub.Browser.isIEFamily()){this.eResponseIFrame.src=this.sResponseUrl
}else{if(this.eContainerIFrame.contentWindow.connect===undefined){this.oLogger.log("Could not connect to response iframe");
this.reconnect();
return 
}this.eContainerIFrame.contentWindow.connect(this.sResponseUrl)
}this.startConnectionMonitor()
},setOnLoad:function(A,B){if(A.addEventListener){A.onload=B
}else{if(A.attachEvent){A.onload=null;
A.attachEvent("onload",B)
}}},addTopicListener:function(B,A){this.mTopicToListener[B]=A
},buildPollingHandler:function(oHub){return function(sTopic,sResponse){try{var pMessages=eval("("+sResponse+")");
oHub.oLogger.log("Polling response is : "+sResponse+" for topic '"+sTopic+"'. Num messages: "+pMessages.length);
for(var i=0;
i<pMessages.length;
i++){x(pMessages[i])
}}catch(e){oHub.oLogger.log("Problem parsing poll response: "+e)
}}
},buildSubscriptionResponse:function(A){return function(C,B){A.oLogger.log("Subscription response is : "+B+" for topic '"+C+"'")
}
},buildUnSubscribeResponse:function(A){return function(C,B){A.oLogger.log("Unsubscribe response is : "+B+" for topic '"+C+"'")
}
},buildPublishResponse:function(A){return function(C,B){A.oLogger.log("Publish response is : "+B+" for topic '"+C+"'")
}
},buildConnectionResponse:function(A){return function(C,B){A.oLogger.log("Connection response is : "+B);
if(A.sConnectionType===StreamHub.POLLING_CONNECTION){A.startPolling.apply(A)
}}
},buildDisconnectionResponse:function(A){return function(C,B){A.oLogger.log("Disconnection response is : "+B)
}
},reconnect:function(){if(this.isDeliberateDisconnect!==true&&!this.isResponseIFrameConnected()&&(this.nMaxReconnectAttempts==-1||this.nReconnectAttempts<this.nMaxReconnectAttempts)){try{var B=this;
clearTimeout(this.reconnectorId);
if(this.bExponentialBackOff&&this.nReconnectAttempts>0){this.nReconnectDelayMillis*=this.nBackOffMultiplier;
if(this.nMaxReconnectDelayMillis!=-1&&this.nReconnectDelayMillis>this.nMaxReconnectDelayMillis){this.nReconnectDelayMillis=this.nMaxReconnectDelayMillis
}}this.oLogger.log("Attempting reconnect in "+this.nReconnectDelayMillis+"ms");
this.reconnectorId=setTimeout(function(){if((B.nMaxReconnectAttempts==-1||B.nReconnectAttempts<B.nMaxReconnectAttempts)&&!B.isResponseIFrameConnected.apply(B)){if(B.sFailoverAlgorithm=="priority"){B.nServerIndex=(B.nServerIndex+1)%B.pServerList.length
}B.doReconnection.apply(B)
}},this.nReconnectDelayMillis)
}catch(A){this.oLogger.log("Error setting interval: "+A)
}}},doReconnection:function(){var B=this.sUrl;
if(this.nServerIndex!==undefined){var A=this.pServerList.length;
if(this.sFailoverAlgorithm=="ordered"){this.nServerIndex=(this.nServerIndex+1)%A
}else{if(this.sFailoverAlgorithm=="random"){this.nServerIndex=Math.floor(Math.random()*A)
}}B=this.pServerList[this.nServerIndex]
}this.nReconnectAttempts++;
this.oLogger.log("Reconnecting... Trying "+B);
this.doConnect(B);
this.reconnect()
},onReconnect:function(){try{clearTimeout(this.reconnectorId)
}catch(A){}if(this.sFailoverAlgorithm=="priority"){this.nServerIndex=-1
}this.nReconnectAttempts=0;
this.nReconnectDelayMillis=this.nInitialReconnectDelayMillis;
this.notifyConnectionEstablishedListeners()
},buildConnectionLost:function(A){return function(){A.oLogger.log("Lost connection to server");
A.notifyConnectionLostListeners.apply(A);
A.bIsResponseIFrameConnected=false;
A.reconnect.apply(A)
}
},notifyConnectionLostListeners:function(){for(var A=0;
A<this.pConnectionListeners.length;
A++){this.pConnectionListeners[A].onConnectionLost()
}},notifyConnectionEstablishedListeners:function(){for(var A=0;
A<this.pConnectionListeners.length;
A++){this.pConnectionListeners[A].onConnectionEstablished()
}},imageRequest:function(B){var A=document.createElement("img");
A.src=B;
document.body.appendChild(A)
},request:function(B,A,C){this.pRequestQueue.push({url:B,callback:C,topic:A});
if(this.isResponseIFrameConnected()&&this.pRequestQueue.length==1){this.processRequestQueue()
}},processRequestQueue:function(){if(this.pRequestQueue.length>0){if(!StreamHub.Browser.isIEFamily()&&!StreamHub.Browser.isFF3()){this.setOnLoad(this.eRequestIFrame,this.buildOnRequestComplete(this))
}var B=this.pRequestQueue[0].url;
this.oLogger.log("Requesting: "+B);
if(StreamHub.Browser.isIEFamily()){this.eRequestIFrame.src=B
}else{try{this.eContainerIFrame.contentWindow.request(B,this)
}catch(A){this.oLogger.log("Failed requesting: "+B+". Error was: "+A+". Trying again in 1 second.");
var C=this;
setTimeout(function(){C.processRequestQueue.apply(C)
},1000)
}}}},addIFrame:function(B){var A=document;
if(StreamHub.Browser.isIEFamily()){this.createHtmlFile();
A=this.transferDoc
}var C=this.createIFrame(A,B);
A.body.appendChild(C);
return C
},createElement:function(C,A,B){var D=C.createElement(A);
D.id=B;
return D
},createIFrame:function(B,A){var C=this.createElement(B,"IFRAME",A.id);
C.style.visibility="hidden";
C.style.display="none";
C.style.height="0px";
C.style.width="0px";
C.src=A.src;
if(A.onLoadFn!==undefined){this.setOnLoad(C,A.onLoadFn)
}return C
},createHtmlFile:function(){if(this.transferDoc===undefined){this.transferDoc=new ActiveXObject("htmlfile");
this.transferDoc.open();
this.transferDoc.write("<html>");
this.transferDoc.write("<script>document.domain='"+this.sDomain+"';<\/script>");
this.transferDoc.write("</html>");
this.transferDoc.close();
this.transferDoc.parentWindow.x=x;
this.transferDoc.parentWindow.r=this.buildOnRequestComplete(this)
}},startPolling:function(){this.oLogger.log("Starting poling...");
var A=this;
this.oPollingId=setInterval(function(){A.request(A.sPollingUrl,"poll",A.buildPollingHandler(A))
},1000)
},stopPolling:function(){this.oLogger.log("Stopping poling");
clearInterval(this.oPollingId)
},startConnectionMonitor:function(){if(StreamHub.Browser.isWebkitFamily()){this.setOnLoad(this.eResponseIFrame,this.buildConnectionLost(this))
}else{this.startDefaultConnectionMonitor(this)
}},startDefaultConnectionMonitor:function(A){if(A.connectionMonitorId==null){A.connectionMonitorId=setInterval(function(){var B=A.getIFrameReadyState(A.eResponseIFrame);
if(B=="complete"){clearInterval(A.connectionMonitorId);
A.connectionMonitorId=null;
(A.buildConnectionLost(A))()
}},1000)
}},getIFrameReadyState:function(B){if(StreamHub.Browser.isIEFamily()){return B.readyState
}try{return B.readyState||B.contentWindow.document.readyState
}catch(A){return"complete"
}},isResponseIFrameConnected:function(){return this.bIsResponseIFrameConnected||this.sConnectionType===StreamHub.POLLING_CONNECTION
},buildOnResponseData:function(A){return function(C){try{A.oLogger.log("onResponseData via response iFrame : ["+C+"]")
}catch(B){}if(C.topic&&typeof A.mTopicToListener[C.topic]=="function"){A.mTopicToListener[C.topic](C.topic,C)
}else{if(A.isResponseIFrameConnectionOk(C)){A.bIsResponseIFrameConnected=true;
A.addIFrame({id:"blankIFrame"+new Date().valueOf(),src:"about:blank"});
A.onReconnect.apply(A);
A.processRequestQueue()
}}}
},isResponseIFrameConnectionOk:function(A){return A.toString().indexOf("response OK")>-1
},buildUrls:function(A){var B=new Date().valueOf();
this.sIFrameHtmlUrl=A+"iframe.html?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sRequestUrl=A+"request/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sResponseUrl=A+"response/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sPublishUrl=A+"publish/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sSubscribeUrl=A+"subscribe/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sUnSubscribeUrl=A+"unsubscribe/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sDisconnectUrl=A+"disconnect/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B;
this.sPollingUrl=A+"poll/?uid="+this.sUid+"&domain="+this.sDomain+"&r="+B
},buildOnRequestComplete:function(A){return function(){var C=A.pRequestQueue[0];
var B=null;
try{B=A.eRequestIFrame.contentWindow.document.body.innerHTML
}catch(D){A.oLogger.log("buildOnRequestComplete(): Error getting iFrame contents: "+D)
}if(C!==undefined&&B!==null){C.callback(C.topic,B)
}A.pRequestQueue.shift();
A.processRequestQueue()
}
},preConnectCleanUp:function(){this.eRequestIFrame=document.getElementById("requestIFrame");
this.eResponseIFrame=document.getElementById("responseIFrame");
(this.buildCleanUp(this))()
},buildCleanUp:function(A){return function(){try{if(A.isDeliberateDisconnect===false){A.imageRequest(A.sDisconnectUrl)
}A.bConnectCalled=false;
if(A.pRequestQueue!==undefined&&A.pRequestQueue.length>0){A.pRequestQueue=[]
}if(A.eRequestIFrame!==undefined&&A.eRequestIFrame!==null){A.eRequestIFrame.src="";
A.eRequestIFrame.contentWindow.document.close();
A.eRequestIFrame=null
}if(A.eResponseIFrame!==undefined&&A.eResponseIFrame!==null){A.eResponseIFrame.src="";
A.eResponseIFrame.contentWindow.document.close();
A.eResponseIFrame=null
}if(A.tranferDoc!==undefined){A.transferDoc=null
}if(window.x){window.x=null
}if(window.r){window.r=null
}if(window.CollectGarbage){CollectGarbage()
}}catch(C){try{A.oLogger.log("Error during cleanup '"+C+"'")
}catch(B){}}}
}};
StreamHub.ConnectionListener=function(){};
StreamHub.ConnectionListener.prototype={onConnectionEstablished:function(){},onConnectionLost:function(){}};
StreamHub.Browser={isWebkitFamily:function(){return navigator.userAgent.indexOf("WebKit/")>-1
},isIEFamily:function(){return navigator.userAgent.indexOf("MSIE")>-1
},isFirefoxFamily:function(){return navigator.userAgent.indexOf("Firefox/")>-1
},isFF3:function(){return navigator.userAgent.indexOf("Firefox/3")>-1
},isSafari:function(){return navigator.userAgent.indexOf("Safari/")>-1&&navigator.userAgent.indexOf("Chrome/")<0
},isChrome:function(){return navigator.userAgent.indexOf("Chrome/")>-1
},isIE6:function(){return navigator.userAgent.indexOf("MSIE 6")>-1
},isIE7:function(){return navigator.userAgent.indexOf("MSIE 7")>-1
},isIE8:function(){return navigator.userAgent.indexOf("MSIE 8")>-1
}};
StreamHub.ElementLogger=function(A){this.oDoc=document;
this.eLogContainer=this.oDoc.getElementById(A.elementId)
};
StreamHub.ElementLogger.prototype={log:function(B){var A=this.oDoc.createElement("DIV");
A.innerHTML=B;
this.eLogContainer.appendChild(A)
}};
StreamHub.NullLogger=function(){};
StreamHub.NullLogger.prototype={log:function(){}};
StreamHub.CountLogger=function(A){this.nCount=0;
this.eLogContainer=document.getElementById(A.elementId)
};
StreamHub.CountLogger.prototype={log:function(A){this.eLogContainer.innerHTML=(++this.nCount)+" messages logged"
}};
StreamHub.DomainUtils={pTLDs:["com","net","org","gov","co"],pNumbers:["0","1","2","3","4","5","6","7","8","9"],extractDomain:function(B){var C=B.charAt(B.length-1);
if(StreamHub.DomainUtils.isNumeric(C)){return B
}var D=B.split(".");
var E=D.length-2;
if(StreamHub.DomainUtils.isTLD(D[E])&&D.length>2){E=D.length-3
}var A=D.length-E;
return D.splice(E,A).join(".")
},isNumeric:function(B){for(var A=0;
A<StreamHub.DomainUtils.pNumbers.length;
A++){if(B===StreamHub.DomainUtils.pNumbers[A]){return true
}}return false
},isTLD:function(B){for(var A=0;
A<StreamHub.DomainUtils.pTLDs.length;
A++){if(B===StreamHub.DomainUtils.pTLDs[A]){return true
}}return false
}};