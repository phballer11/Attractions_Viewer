(self.webpackChunk_N_E=self.webpackChunk_N_E||[]).push([[931],{4279:function(e,t,r){Promise.resolve().then(r.bind(r,2137))},8355:function(e,t){var r,i,n;i=[],void 0!==(n="function"==typeof(r=function e(){"use strict";var t="undefined"!=typeof self?self:"undefined"!=typeof window?window:void 0!==t?t:{},r=!t.document&&!!t.postMessage,i=t.IS_PAPA_WORKER||!1,n={},s=0,a={parse:function(r,i){var o,u=(i=i||{}).dynamicTyping||!1;if(E(u)&&(i.dynamicTypingFunction=u,u={}),i.dynamicTyping=u,i.transform=!!E(i.transform)&&i.transform,i.worker&&a.WORKERS_SUPPORTED){var c=function(){if(!a.WORKERS_SUPPORTED)return!1;var r,i,o=(r=t.URL||t.webkitURL||null,i=e.toString(),a.BLOB_URL||(a.BLOB_URL=r.createObjectURL(new Blob(["var global = (function() { if (typeof self !== 'undefined') { return self; } if (typeof window !== 'undefined') { return window; } if (typeof global !== 'undefined') { return global; } return {}; })(); global.IS_PAPA_WORKER=true; ","(",i,")();"],{type:"text/javascript"})))),u=new t.Worker(o);return u.onmessage=g,u.id=s++,n[u.id]=u}();return c.userStep=i.step,c.userChunk=i.chunk,c.userComplete=i.complete,c.userError=i.error,i.step=E(i.step),i.chunk=E(i.chunk),i.complete=E(i.complete),i.error=E(i.error),delete i.worker,void c.postMessage({input:r,config:i,workerId:c.id})}var p=null;return a.NODE_STREAM_INPUT,"string"==typeof r?(r=65279===(o=r).charCodeAt(0)?o.slice(1):o,p=i.download?new h(i):new l(i)):!0===r.readable&&E(r.read)&&E(r.on)?p=new d(i):(t.File&&r instanceof File||r instanceof Object)&&(p=new f(i)),p.stream(r)},unparse:function(e,t){var r=!1,i=!0,n=",",s="\r\n",o='"',u=o+o,h=!1,f=null,l=!1;!function(){if("object"==typeof t){if("string"!=typeof t.delimiter||a.BAD_DELIMITERS.filter(function(e){return -1!==t.delimiter.indexOf(e)}).length||(n=t.delimiter),("boolean"==typeof t.quotes||"function"==typeof t.quotes||Array.isArray(t.quotes))&&(r=t.quotes),"boolean"!=typeof t.skipEmptyLines&&"string"!=typeof t.skipEmptyLines||(h=t.skipEmptyLines),"string"==typeof t.newline&&(s=t.newline),"string"==typeof t.quoteChar&&(o=t.quoteChar),"boolean"==typeof t.header&&(i=t.header),Array.isArray(t.columns)){if(0===t.columns.length)throw Error("Option columns is empty");f=t.columns}void 0!==t.escapeChar&&(u=t.escapeChar+o),("boolean"==typeof t.escapeFormulae||t.escapeFormulae instanceof RegExp)&&(l=t.escapeFormulae instanceof RegExp?t.escapeFormulae:/^[=+\-@\t\r].*$/)}}();var d=RegExp(p(o),"g");if("string"==typeof e&&(e=JSON.parse(e)),Array.isArray(e)){if(!e.length||Array.isArray(e[0]))return c(null,e,h);if("object"==typeof e[0])return c(f||Object.keys(e[0]),e,h)}else if("object"==typeof e)return"string"==typeof e.data&&(e.data=JSON.parse(e.data)),Array.isArray(e.data)&&(e.fields||(e.fields=e.meta&&e.meta.fields||f),e.fields||(e.fields=Array.isArray(e.data[0])?e.fields:"object"==typeof e.data[0]?Object.keys(e.data[0]):[]),Array.isArray(e.data[0])||"object"==typeof e.data[0]||(e.data=[e.data])),c(e.fields||[],e.data||[],h);throw Error("Unable to serialize unrecognized input");function c(e,t,r){var a="";"string"==typeof e&&(e=JSON.parse(e)),"string"==typeof t&&(t=JSON.parse(t));var o=Array.isArray(e)&&0<e.length,u=!Array.isArray(t[0]);if(o&&i){for(var h=0;h<e.length;h++)0<h&&(a+=n),a+=_(e[h],h);0<t.length&&(a+=s)}for(var f=0;f<t.length;f++){var l=o?e.length:t[f].length,d=!1,c=o?0===Object.keys(t[f]).length:0===t[f].length;if(r&&!o&&(d="greedy"===r?""===t[f].join("").trim():1===t[f].length&&0===t[f][0].length),"greedy"===r&&o){for(var p=[],g=0;g<l;g++){var m=u?e[g]:g;p.push(t[f][m])}d=""===p.join("").trim()}if(!d){for(var y=0;y<l;y++){0<y&&!c&&(a+=n);var v=o&&u?e[y]:y;a+=_(t[f][v],y)}f<t.length-1&&(!r||0<l&&!c)&&(a+=s)}}return a}function _(e,t){if(null==e)return"";if(e.constructor===Date)return JSON.stringify(e).slice(1,25);var i=!1;l&&"string"==typeof e&&l.test(e)&&(e="'"+e,i=!0);var s=e.toString().replace(d,u);return(i=i||!0===r||"function"==typeof r&&r(e,t)||Array.isArray(r)&&r[t]||function(e,t){for(var r=0;r<t.length;r++)if(-1<e.indexOf(t[r]))return!0;return!1}(s,a.BAD_DELIMITERS)||-1<s.indexOf(n)||" "===s.charAt(0)||" "===s.charAt(s.length-1))?o+s+o:s}}};if(a.RECORD_SEP="\x1e",a.UNIT_SEP="\x1f",a.BYTE_ORDER_MARK="\uFEFF",a.BAD_DELIMITERS=["\r","\n",'"',a.BYTE_ORDER_MARK],a.WORKERS_SUPPORTED=!r&&!!t.Worker,a.NODE_STREAM_INPUT=1,a.LocalChunkSize=10485760,a.RemoteChunkSize=5242880,a.DefaultDelimiter=",",a.Parser=_,a.ParserHandle=c,a.NetworkStreamer=h,a.FileStreamer=f,a.StringStreamer=l,a.ReadableStreamStreamer=d,t.jQuery){var o=t.jQuery;o.fn.parse=function(e){var r=e.config||{},i=[];return this.each(function(e){if(!("INPUT"===o(this).prop("tagName").toUpperCase()&&"file"===o(this).attr("type").toLowerCase()&&t.FileReader)||!this.files||0===this.files.length)return!0;for(var n=0;n<this.files.length;n++)i.push({file:this.files[n],inputElem:this,instanceConfig:o.extend({},r)})}),n(),this;function n(){if(0!==i.length){var t,r,n,u,h=i[0];if(E(e.before)){var f=e.before(h.file,h.inputElem);if("object"==typeof f){if("abort"===f.action)return t="AbortError",r=h.file,n=h.inputElem,u=f.reason,void(E(e.error)&&e.error({name:t},r,n,u));if("skip"===f.action)return void s();"object"==typeof f.config&&(h.instanceConfig=o.extend(h.instanceConfig,f.config))}else if("skip"===f)return void s()}var l=h.instanceConfig.complete;h.instanceConfig.complete=function(e){E(l)&&l(e,h.file,h.inputElem),s()},a.parse(h.file,h.instanceConfig)}else E(e.complete)&&e.complete()}function s(){i.splice(0,1),n()}}}function u(e){this._handle=null,this._finished=!1,this._completed=!1,this._halted=!1,this._input=null,this._baseIndex=0,this._partialLine="",this._rowCount=0,this._start=0,this._nextChunk=null,this.isFirstChunk=!0,this._completeResults={data:[],errors:[],meta:{}},(function(e){var t=v(e);t.chunkSize=parseInt(t.chunkSize),e.step||e.chunk||(t.chunkSize=null),this._handle=new c(t),(this._handle.streamer=this)._config=t}).call(this,e),this.parseChunk=function(e,r){if(this.isFirstChunk&&E(this._config.beforeFirstChunk)){var n=this._config.beforeFirstChunk(e);void 0!==n&&(e=n)}this.isFirstChunk=!1,this._halted=!1;var s=this._partialLine+e;this._partialLine="";var o=this._handle.parse(s,this._baseIndex,!this._finished);if(!this._handle.paused()&&!this._handle.aborted()){var u=o.meta.cursor;this._finished||(this._partialLine=s.substring(u-this._baseIndex),this._baseIndex=u),o&&o.data&&(this._rowCount+=o.data.length);var h=this._finished||this._config.preview&&this._rowCount>=this._config.preview;if(i)t.postMessage({results:o,workerId:a.WORKER_ID,finished:h});else if(E(this._config.chunk)&&!r){if(this._config.chunk(o,this._handle),this._handle.paused()||this._handle.aborted())return void(this._halted=!0);o=void 0,this._completeResults=void 0}return this._config.step||this._config.chunk||(this._completeResults.data=this._completeResults.data.concat(o.data),this._completeResults.errors=this._completeResults.errors.concat(o.errors),this._completeResults.meta=o.meta),this._completed||!h||!E(this._config.complete)||o&&o.meta.aborted||(this._config.complete(this._completeResults,this._input),this._completed=!0),h||o&&o.meta.paused||this._nextChunk(),o}this._halted=!0},this._sendError=function(e){E(this._config.error)?this._config.error(e):i&&this._config.error&&t.postMessage({workerId:a.WORKER_ID,error:e,finished:!1})}}function h(e){var t;(e=e||{}).chunkSize||(e.chunkSize=a.RemoteChunkSize),u.call(this,e),this._nextChunk=r?function(){this._readChunk(),this._chunkLoaded()}:function(){this._readChunk()},this.stream=function(e){this._input=e,this._nextChunk()},this._readChunk=function(){if(this._finished)this._chunkLoaded();else{if(t=new XMLHttpRequest,this._config.withCredentials&&(t.withCredentials=this._config.withCredentials),r||(t.onload=k(this._chunkLoaded,this),t.onerror=k(this._chunkError,this)),t.open(this._config.downloadRequestBody?"POST":"GET",this._input,!r),this._config.downloadRequestHeaders){var e=this._config.downloadRequestHeaders;for(var i in e)t.setRequestHeader(i,e[i])}if(this._config.chunkSize){var n=this._start+this._config.chunkSize-1;t.setRequestHeader("Range","bytes="+this._start+"-"+n)}try{t.send(this._config.downloadRequestBody)}catch(e){this._chunkError(e.message)}r&&0===t.status&&this._chunkError()}},this._chunkLoaded=function(){var e;4===t.readyState&&(t.status<200||400<=t.status?this._chunkError():(this._start+=this._config.chunkSize?this._config.chunkSize:t.responseText.length,this._finished=!this._config.chunkSize||this._start>=(null===(e=t.getResponseHeader("Content-Range"))?-1:parseInt(e.substring(e.lastIndexOf("/")+1))),this.parseChunk(t.responseText)))},this._chunkError=function(e){var r=t.statusText||e;this._sendError(Error(r))}}function f(e){(e=e||{}).chunkSize||(e.chunkSize=a.LocalChunkSize),u.call(this,e);var t,r,i="undefined"!=typeof FileReader;this.stream=function(e){this._input=e,r=e.slice||e.webkitSlice||e.mozSlice,i?((t=new FileReader).onload=k(this._chunkLoaded,this),t.onerror=k(this._chunkError,this)):t=new FileReaderSync,this._nextChunk()},this._nextChunk=function(){this._finished||this._config.preview&&!(this._rowCount<this._config.preview)||this._readChunk()},this._readChunk=function(){var e=this._input;if(this._config.chunkSize){var n=Math.min(this._start+this._config.chunkSize,this._input.size);e=r.call(e,this._start,n)}var s=t.readAsText(e,this._config.encoding);i||this._chunkLoaded({target:{result:s}})},this._chunkLoaded=function(e){this._start+=this._config.chunkSize,this._finished=!this._config.chunkSize||this._start>=this._input.size,this.parseChunk(e.target.result)},this._chunkError=function(){this._sendError(t.error)}}function l(e){var t;u.call(this,e=e||{}),this.stream=function(e){return t=e,this._nextChunk()},this._nextChunk=function(){if(!this._finished){var e,r=this._config.chunkSize;return r?(e=t.substring(0,r),t=t.substring(r)):(e=t,t=""),this._finished=!t,this.parseChunk(e)}}}function d(e){u.call(this,e=e||{});var t=[],r=!0,i=!1;this.pause=function(){u.prototype.pause.apply(this,arguments),this._input.pause()},this.resume=function(){u.prototype.resume.apply(this,arguments),this._input.resume()},this.stream=function(e){this._input=e,this._input.on("data",this._streamData),this._input.on("end",this._streamEnd),this._input.on("error",this._streamError)},this._checkIsFinished=function(){i&&1===t.length&&(this._finished=!0)},this._nextChunk=function(){this._checkIsFinished(),t.length?this.parseChunk(t.shift()):r=!0},this._streamData=k(function(e){try{t.push("string"==typeof e?e:e.toString(this._config.encoding)),r&&(r=!1,this._checkIsFinished(),this.parseChunk(t.shift()))}catch(e){this._streamError(e)}},this),this._streamError=k(function(e){this._streamCleanUp(),this._sendError(e)},this),this._streamEnd=k(function(){this._streamCleanUp(),i=!0,this._streamData("")},this),this._streamCleanUp=k(function(){this._input.removeListener("data",this._streamData),this._input.removeListener("end",this._streamEnd),this._input.removeListener("error",this._streamError)},this)}function c(e){var t,r,i,n=/^\s*-?(\d+\.?|\.\d+|\d+\.\d+)([eE][-+]?\d+)?\s*$/,s=/^((\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d\.\d+([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z))|(\d{4}-[01]\d-[0-3]\dT[0-2]\d:[0-5]\d([+-][0-2]\d:[0-5]\d|Z)))$/,o=this,u=0,h=0,f=!1,l=!1,d=[],c={data:[],errors:[],meta:{}};if(E(e.step)){var g=e.step;e.step=function(t){if(c=t,k())y();else{if(y(),0===c.data.length)return;u+=t.data.length,e.preview&&u>e.preview?r.abort():(c.data=c.data[0],g(c,o))}}}function m(t){return"greedy"===e.skipEmptyLines?""===t.join("").trim():1===t.length&&0===t[0].length}function y(){return c&&i&&(b("Delimiter","UndetectableDelimiter","Unable to auto-detect delimiting character; defaulted to '"+a.DefaultDelimiter+"'"),i=!1),e.skipEmptyLines&&(c.data=c.data.filter(function(e){return!m(e)})),k()&&function(){if(c){if(Array.isArray(c.data[0])){for(var t=0;k()&&t<c.data.length;t++)c.data[t].forEach(r);c.data.splice(0,1)}else c.data.forEach(r)}function r(t,r){E(e.transformHeader)&&(t=e.transformHeader(t,r)),d.push(t)}}(),function(){if(!c||!e.header&&!e.dynamicTyping&&!e.transform)return c;function t(t,r){var i,a=e.header?{}:[];for(i=0;i<t.length;i++){var o,u,f=i,l=t[i];e.header&&(f=i>=d.length?"__parsed_extra":d[i]),e.transform&&(l=e.transform(l,f)),o=f,u=l,e.dynamicTypingFunction&&void 0===e.dynamicTyping[o]&&(e.dynamicTyping[o]=e.dynamicTypingFunction(o)),l=!0===(e.dynamicTyping[o]||e.dynamicTyping)?"true"===u||"TRUE"===u||"false"!==u&&"FALSE"!==u&&(!function(e){if(n.test(e)){var t=parseFloat(e);if(-9007199254740992<t&&t<9007199254740992)return!0}return!1}(u)?s.test(u)?new Date(u):""===u?null:u:parseFloat(u)):u,"__parsed_extra"===f?(a[f]=a[f]||[],a[f].push(l)):a[f]=l}return e.header&&(i>d.length?b("FieldMismatch","TooManyFields","Too many fields: expected "+d.length+" fields but parsed "+i,h+r):i<d.length&&b("FieldMismatch","TooFewFields","Too few fields: expected "+d.length+" fields but parsed "+i,h+r)),a}var r=1;return!c.data.length||Array.isArray(c.data[0])?(c.data=c.data.map(t),r=c.data.length):c.data=t(c.data,0),e.header&&c.meta&&(c.meta.fields=d),h+=r,c}()}function k(){return e.header&&0===d.length}function b(e,t,r,i){var n={type:e,code:t,message:r};void 0!==i&&(n.row=i),c.errors.push(n)}this.parse=function(n,s,o){var u=e.quoteChar||'"';if(e.newline||(e.newline=function(e,t){e=e.substring(0,1048576);var r=RegExp(p(t)+"([^]*?)"+p(t),"gm"),i=(e=e.replace(r,"")).split("\r"),n=e.split("\n"),s=1<n.length&&n[0].length<i[0].length;if(1===i.length||s)return"\n";for(var a=0,o=0;o<i.length;o++)"\n"===i[o][0]&&a++;return a>=i.length/2?"\r\n":"\r"}(n,u)),i=!1,e.delimiter)E(e.delimiter)&&(e.delimiter=e.delimiter(n),c.meta.delimiter=e.delimiter);else{var h=function(t,r,i,n,s){var o,u,h,f;s=s||[",","	","|",";",a.RECORD_SEP,a.UNIT_SEP];for(var l=0;l<s.length;l++){var d=s[l],c=0,p=0,g=0;h=void 0;for(var y=new _({comments:n,delimiter:d,newline:r,preview:10}).parse(t),v=0;v<y.data.length;v++)if(i&&m(y.data[v]))g++;else{var k=y.data[v].length;p+=k,void 0!==h?0<k&&(c+=Math.abs(k-h),h=k):h=k}0<y.data.length&&(p/=y.data.length-g),(void 0===u||c<=u)&&(void 0===f||f<p)&&1.99<p&&(u=c,o=d,f=p)}return{successful:!!(e.delimiter=o),bestDelimiter:o}}(n,e.newline,e.skipEmptyLines,e.comments,e.delimitersToGuess);h.successful?e.delimiter=h.bestDelimiter:(i=!0,e.delimiter=a.DefaultDelimiter),c.meta.delimiter=e.delimiter}var l=v(e);return e.preview&&e.header&&l.preview++,t=n,c=(r=new _(l)).parse(t,s,o),y(),f?{meta:{paused:!0}}:c||{meta:{paused:!1}}},this.paused=function(){return f},this.pause=function(){f=!0,r.abort(),t=E(e.chunk)?"":t.substring(r.getCharIndex())},this.resume=function(){o.streamer._halted?(f=!1,o.streamer.parseChunk(t,!0)):setTimeout(o.resume,3)},this.aborted=function(){return l},this.abort=function(){l=!0,r.abort(),c.meta.aborted=!0,E(e.complete)&&e.complete(c),t=""}}function p(e){return e.replace(/[.*+?^${}()|[\]\\]/g,"\\$&")}function _(e){var t,r=(e=e||{}).delimiter,i=e.newline,n=e.comments,s=e.step,o=e.preview,u=e.fastMode,h=t=void 0===e.quoteChar||null===e.quoteChar?'"':e.quoteChar;if(void 0!==e.escapeChar&&(h=e.escapeChar),("string"!=typeof r||-1<a.BAD_DELIMITERS.indexOf(r))&&(r=","),n===r)throw Error("Comment character same as delimiter");!0===n?n="#":("string"!=typeof n||-1<a.BAD_DELIMITERS.indexOf(n))&&(n=!1),"\n"!==i&&"\r"!==i&&"\r\n"!==i&&(i="\n");var f=0,l=!1;this.parse=function(a,d,c){if("string"!=typeof a)throw Error("Input must be a string");var _=a.length,g=r.length,m=i.length,y=n.length,v=E(s),k=[],b=[],w=[],R=f=0;if(!a)return Q();if(e.header&&!d){var x=a.split(i)[0].split(r),C=[],S={},O=!1;for(var I in x){var A=x[I];E(e.transformHeader)&&(A=e.transformHeader(A,I));var T=A,D=S[A]||0;for(0<D&&(O=!0,T=A+"_"+D),S[A]=D+1;C.includes(T);)T=T+"_"+D;C.push(T)}if(O){var L=a.split(i);L[0]=C.join(r),a=L.join(i)}}if(u||!1!==u&&-1===a.indexOf(t)){for(var j=a.split(i),F=0;F<j.length;F++){if(w=j[F],f+=w.length,F!==j.length-1)f+=i.length;else if(c)break;if(!n||w.substring(0,y)!==n){if(v){if(k=[],B(w.split(r)),J(),l)return Q()}else B(w.split(r));if(o&&o<=F)return k=k.slice(0,o),Q(!0)}}return Q()}for(var z=a.indexOf(r,f),M=a.indexOf(i,f),U=RegExp(p(h)+p(t),"g"),N=a.indexOf(t,f);;)if(a[f]!==t){if(n&&0===w.length&&a.substring(f,f+y)===n){if(-1===M)return Q();f=M+m,M=a.indexOf(i,f),z=a.indexOf(r,f)}else if(-1!==z&&(z<M||-1===M))w.push(a.substring(f,z)),f=z+g,z=a.indexOf(r,f);else{if(-1===M)break;if(w.push(a.substring(f,M)),H(M+m),v&&(J(),l))return Q();if(o&&k.length>=o)return Q(!0)}}else for(N=f,f++;;){if(-1===(N=a.indexOf(t,N+1)))return c||b.push({type:"Quotes",code:"MissingQuotes",message:"Quoted field unterminated",row:k.length,index:f}),W();if(N===_-1)return W(a.substring(f,N).replace(U,t));if(t!==h||a[N+1]!==h){if(t===h||0===N||a[N-1]!==h){-1!==z&&z<N+1&&(z=a.indexOf(r,N+1)),-1!==M&&M<N+1&&(M=a.indexOf(i,N+1));var P=K(-1===M?z:Math.min(z,M));if(a.substr(N+1+P,g)===r){w.push(a.substring(f,N).replace(U,t)),a[f=N+1+P+g]!==t&&(N=a.indexOf(t,f)),z=a.indexOf(r,f),M=a.indexOf(i,f);break}var q=K(M);if(a.substring(N+1+q,N+1+q+m)===i){if(w.push(a.substring(f,N).replace(U,t)),H(N+1+q+m),z=a.indexOf(r,f),N=a.indexOf(t,f),v&&(J(),l))return Q();if(o&&k.length>=o)return Q(!0);break}b.push({type:"Quotes",code:"InvalidQuotes",message:"Trailing quote on quoted field is malformed",row:k.length,index:f}),N++}}else N++}return W();function B(e){k.push(e),R=f}function K(e){var t=0;if(-1!==e){var r=a.substring(N+1,e);r&&""===r.trim()&&(t=r.length)}return t}function W(e){return c||(void 0===e&&(e=a.substring(f)),w.push(e),f=_,B(w),v&&J()),Q()}function H(e){f=e,B(w),w=[],M=a.indexOf(i,f)}function Q(e){return{data:k,errors:b,meta:{delimiter:r,linebreak:i,aborted:l,truncated:!!e,cursor:R+(d||0)}}}function J(){s(Q()),k=[],b=[]}},this.abort=function(){l=!0},this.getCharIndex=function(){return f}}function g(e){var t=e.data,r=n[t.workerId],i=!1;if(t.error)r.userError(t.error,t.file);else if(t.results&&t.results.data){var s={abort:function(){i=!0,m(t.workerId,{data:[],errors:[],meta:{aborted:!0}})},pause:y,resume:y};if(E(r.userStep)){for(var a=0;a<t.results.data.length&&(r.userStep({data:t.results.data[a],errors:t.results.errors,meta:t.results.meta},s),!i);a++);delete t.results}else E(r.userChunk)&&(r.userChunk(t.results,s,t.file),delete t.results)}t.finished&&!i&&m(t.workerId,t.results)}function m(e,t){var r=n[e];E(r.userComplete)&&r.userComplete(t),r.terminate(),delete n[e]}function y(){throw Error("Not implemented.")}function v(e){if("object"!=typeof e||null===e)return e;var t=Array.isArray(e)?[]:{};for(var r in e)t[r]=v(e[r]);return t}function k(e,t){return function(){e.apply(t,arguments)}}function E(e){return"function"==typeof e}return i&&(t.onmessage=function(e){var r=e.data;if(void 0===a.WORKER_ID&&r&&(a.WORKER_ID=r.workerId),"string"==typeof r.input)t.postMessage({workerId:a.WORKER_ID,results:a.parse(r.input,r.config),finished:!0});else if(t.File&&r.input instanceof File||r.input instanceof Object){var i=a.parse(r.input,r.config);i&&t.postMessage({workerId:a.WORKER_ID,results:i,finished:!0})}}),(h.prototype=Object.create(u.prototype)).constructor=h,(f.prototype=Object.create(u.prototype)).constructor=f,(l.prototype=Object.create(l.prototype)).constructor=l,(d.prototype=Object.create(u.prototype)).constructor=d,a})?r.apply(t,i):r)&&(e.exports=n)},2137:function(e,t,r){"use strict";r.r(t),r.d(t,{default:function(){return f}});var i=r(7437),n=r(2265),s=r(9671),a=r.n(s),o=r(8355),u=r.n(o);let h=async()=>{let e=[],t=await fetch("/data/japan_restaurants.csv"),r=await t.text();return u().parse(r,{header:!0,skipEmptyLines:!0,transform:(e,t)=>{if("openingHours"===t||"count_per_rating"===t||"images"===t||"reviews"===t||"tags"===t)try{let r=JSON.parse(e);if("reviews"===t)return Array.from(new Set(r)).filter(e=>e.length>4).sort((e,t)=>t.length-e.length);if("images"===t)return r.filter((e,t,r)=>{let i=e.match(/\/p\/(.*?)=/);if(i){let e=i[1];return r.findIndex(t=>t.includes("/p/".concat(e,"=")))===t}return!0});return r}catch(r){return console.error("Error parsing JSON for ".concat(t,": ").concat(e)),e}return"website"===t&&e.length>0&&!e.startsWith("http")?"http://".concat(e):e},complete:t=>{e.push(...t.data)}}),e};function f(){let[e,t]=(0,n.useState)({}),[r,s]=(0,n.useState)([]);return(0,n.useEffect)(()=>{(async()=>{try{let e=await h();console.log(e),s(e)}catch(e){console.error("Error fetching CSV data:",e)}})()},[]),(0,i.jsx)("main",{className:a().main,children:(0,i.jsxs)("div",{children:[(0,i.jsx)("h1",{children:"Prompt"}),r?(0,i.jsxs)("div",{style:{display:"flex",flexDirection:"column",margin:"auto",gap:"24px"},children:[(0,i.jsx)("h2",{children:"Results:"}),r.map((e,t)=>(0,i.jsx)("div",{style:{marginBottom:"24px"},children:(0,i.jsxs)("p",{children:[t+1," - ",e.name]})},t))]}):(0,i.jsx)("p",{children:"No results yet."})]})})}},9671:function(e){e.exports={main:"page_main__GlU4n",description:"page_description__86bsR",code:"page_code__9lUUd",grid:"page_grid__f5Kdy",card:"page_card__QV0Om",center:"page_center__5oHG7",logo:"page_logo__7fc9l",content:"page_content__kDoxQ",vercelLogo:"page_vercelLogo__rOY_u",rotate:"page_rotate__durgN"}}},function(e){e.O(0,[967,971,23,744],function(){return e(e.s=4279)}),_N_E=e.O()}]);