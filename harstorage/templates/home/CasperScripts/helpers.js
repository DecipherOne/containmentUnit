// Turn a (possibly) relative URI into a full RFC 3986-compliant URI
// With minor modifications, courtesy: https://gist.github.com/Yaffle/1088850

var fileIndex=null,
myDate = new DateTime(),
mode = "a",
 streamData=null, 
fs = require('fs'),
myItCount = 0;

function getParameterByName(parameter,page) {
        var match = RegExp('[?&]' + parameter + '=([^&]*)').exec(page);
        return match[1].replace(/\+/g, ' ');
}

function getHostName(url) {
    var match = url.match(/:\/\/(www[0-9]?\.)?(.[^/:]+)/i);
    if (match !== null && match.length > 2 &&
        typeof match[2] === 'string' && match[2].length > 0) {
    return match[2];
    }
    else {
        return null;
    }
}

function getRandomNum(min, max) {
        return Math.floor(Math.random() * (max - min) + min);
}

function absoluteUri(base, href) {

    // Parse a URI and return its constituent parts
    function parseUri(url) {
        var match = String(url).replace(/^\s+|\s+$/g, '').match(/^([^:\/?#]+:)?(\/\/(?:[^:@]*(?::[^:@]*)?@)?(([^:\/?#]*)(?::(\d*))?))?([^?#]*)(\?[^#]*)?(#[\s\S]*)?/);
        return (match ? { href: match[0] || '', protocol: match[1] || '', authority: match[2] || '', host: match[3] || '', hostname: match[4] || '',
                          port: match[5] || '', pathname: match[6] || '', search: match[7] || '', hash: match[8] || '' } : null);
    }

    // Resolve dots in the path
    function resolvePathDots(input) {
        var output = [];
        input.replace(/^(\.\.?(\/|$))+/, '')
             .replace(/\/(\.(\/|$))+/g, '/')
             .replace(/\/\.\.$/, '/../')
             .replace(/\/?[^\/]*/g, function (part) { part === '/..' ? output.pop() : output.push(part); });
        return output.join('').replace(/^\//, input.charAt(0) === '/' ? '/' : '');
    }

    // Parse base and href 
    href = parseUri(href || '');
    base = parseUri(base || '');

    // Build and return the URI 
    return !href || !base ? null : (href.protocol || base.protocol) +
           (href.protocol || href.authority ? href.authority : base.authority) +
           (resolvePathDots(href.protocol || href.authority || href.pathname.charAt(0) === '/' ? href.pathname : (href.pathname ? ((base.authority && !base.pathname ? '/' : '') + base.pathname.slice(0, base.pathname.lastIndexOf('/') + 1) + href.pathname) : base.pathname))) +
           (href.protocol || href.authority || href.pathname ? href.search : (href.search || base.search)) + href.hash;

}

function createHAR(address, title, startTime, resources)
{
    var entries = [];

    resources.forEach(function (resource) {
        var request = resource.request,
            startReply = resource.startReply,
            endReply = resource.endReply;

        if (!request || !startReply || !endReply) {
            return;
        }

        // Exclude Data URI from HAR file because
        // they aren't included in specification
       if (request.url.match(/(^data:image\/.*)/i)) {
          return;
    }

        entries.push({
            startedDateTime: request.time.toISOString(),
            time: endReply.time - request.time,
            request: {
                method: request.method,
                url: request.url,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: request.headers,
                queryString: [],
                headersSize: -1,
                bodySize: -1
            },
            response: {
                status: endReply.status,
                statusText: endReply.statusText,
                httpVersion: "HTTP/1.1",
                cookies: [],
                headers: endReply.headers,
                redirectURL: "",
                headersSize: -1,
                bodySize: startReply.bodySize,
                content: {
                    size: startReply.bodySize,
                    mimeType: endReply.contentType
                }
            },
            cache: {},
            timings: {
                blocked: 0,
                dns: -1,
                connect: -1,
                send: 0,
                wait: startReply.time - request.time,
                receive: endReply.time - startReply.time,
                ssl: -1
            },
            pageref: address
        });
    });

    return {
        log: {
            version: '1.2',
            creator: {
                name: "PhantomJS",
                version: phantom.version.major + '.' + phantom.version.minor +
                    '.' + phantom.version.patch
            },
            pages: [{
                startedDateTime: startTime.toISOString(),
                id: address,
                title: title,
                pageTimings: {
                    _renderStart:casper.startTime,
                    onLoad: casper.endTime - casper.startTime
                }
            }],
            entries: entries
        }
    };
};



function initHtmlIndex(iterations,startUrl,pendingUrls){
    
    var urls = startUrl+',';
    urls += pendingUrls.slice();
    streamData = "<html><head><link type='text/css' rel='stylesheet' href='style.css' /></head><body><div id='mainCont'>";
    streamData += "<div class='iterationHeader'><h4>Load Performance Testing</h4></div>";
    streamData += "<div class='iterationHeader'><h4>Beggining Testing on the Following URLS Testing Pages " + iterations + " times.</h4></div>";
    streamData += "<div class='iterationHeader'><h4>"+ urls+  "</h4></div>";
    fileIndex = 'reportIndex'+ myDate.formats.pretty.a + '.html';
    fileIndex = fileIndex.replace(/[?:/]/g,"");
    
}

function addHarToHtmlIndex(harFile,itCount){

    if(myItCount !== itCount){
        streamData += "<div class='iterationHeader'><h4> Testing pages for the " + itCount + " time. </div>";
        myItCount = itCount;
    }

    var externalPath ="http://10.196.100.81:5000/results/details?label=";
    streamData += "<div class='harLink'><a href='" + externalPath + harFile + "' target='_blank'>" + harFile + "</a></div>";

}

function finalizeHtmlIndex(){
    //We are done so we will finish the html structure off.
    streamData += "<div id='footer'> This file generated at "+ myDate.formats.pretty.a +
      "</div>";
    streamData += "</div></body></html>";
    fs.write(fileIndex,streamData,mode);
}

function DateTime() {
    function getDaySuffix(a) {
        var b = "" + a,
            c = b.length,
            d = parseInt(b.substring(c-2, c-1)),
            e = parseInt(b.substring(c-1));
        if (c == 2 && d == 1) return "th";
        switch(e) {
            case 1:
                return "st";
                break;
            case 2:
                return "nd";
                break;
            case 3:
                return "rd";
                break;
            default:
                return "th";
                break;
        };
    };

    this.getDoY = function(a) {
        var b = new Date(a.getFullYear(),0,1);
    return Math.ceil((a - b) / 86400000);
    }

    this.date = arguments.length == 0 ? new Date() : new Date(arguments);

    this.weekdays = new Array('Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday');
    this.months = new Array('January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December');
    this.daySuf = new Array( "st", "nd", "rd", "th" );

    this.day = {
        index: {
            week: "0" + this.date.getDay(),
            month: (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()
        },
        name: this.weekdays[this.date.getDay()],
        of: {
            week: ((this.date.getDay() < 10) ? "0" + this.date.getDay() : this.date.getDay()) + getDaySuffix(this.date.getDay()),
            month: ((this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()) + getDaySuffix(this.date.getDate())
        }
    }

    this.month = {
        index: (this.date.getMonth() + 1) < 10 ? "0" + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
        name: this.months[this.date.getMonth()]
    };

    this.year = this.date.getFullYear();

    this.time = {
        hour: {
            meridiem: (this.date.getHours() > 12) ? (this.date.getHours() - 12) < 10 ? "0" + (this.date.getHours() - 12) : this.date.getHours() - 12 : (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
            military: (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
            noLeadZero: {
                meridiem: (this.date.getHours() > 12) ? this.date.getHours() - 12 : this.date.getHours(),
                military: this.date.getHours()
            }
        },
        minute: (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes(),
        seconds: (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds(),
        milliseconds: (this.date.getMilliseconds() < 100) ? (this.date.getMilliseconds() < 10) ? "00" + this.date.getMilliseconds() : "0" + this.date.getMilliseconds() : this.date.getMilliseconds(),
        meridiem: (this.date.getHours() > 12) ? "PM" : "AM"
    };

    this.sym = {
        d: {
            d: this.date.getDate(),
            dd: (this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate(),
            ddd: this.weekdays[this.date.getDay()].substring(0, 3),
            dddd: this.weekdays[this.date.getDay()],
            ddddd: ((this.date.getDate() < 10) ? "0" + this.date.getDate() : this.date.getDate()) + getDaySuffix(this.date.getDate()),
            m: this.date.getMonth() + 1,
            mm: (this.date.getMonth() + 1) < 10 ? "0" + (this.date.getMonth() + 1) : this.date.getMonth() + 1,
            mmm: this.months[this.date.getMonth()].substring(0, 3),
            mmmm: this.months[this.date.getMonth()],
            yy: (""+this.date.getFullYear()).substr(2, 2),
            yyyy: this.date.getFullYear()
        },
        t: {
            h: (this.date.getHours() > 12) ? this.date.getHours() - 12 : this.date.getHours(),
            hh: (this.date.getHours() > 12) ? (this.date.getHours() - 12) < 10 ? "0" + (this.date.getHours() - 12) : this.date.getHours() - 12 : (this.date.getHours() < 10) ? "0" + this.date.getHours() : this.date.getHours(),
            hhh: this.date.getHours(),
            m: this.date.getMinutes(),
            mm: (this.date.getMinutes() < 10) ? "0" + this.date.getMinutes() : this.date.getMinutes(),
            s: this.date.getSeconds(),
            ss: (this.date.getSeconds() < 10) ? "0" + this.date.getSeconds() : this.date.getSeconds(),
            ms: this.date.getMilliseconds(),
            mss: Math.round(this.date.getMilliseconds()/10) < 10 ? "0" + Math.round(this.date.getMilliseconds()/10) : Math.round(this.date.getMilliseconds()/10),
            msss: (this.date.getMilliseconds() < 100) ? (this.date.getMilliseconds() < 10) ? "00" + this.date.getMilliseconds() : "0" + this.date.getMilliseconds() : this.date.getMilliseconds()
        }
    };

    this.formats = {
        compound: {
            commonLogFormat: this.sym.d.dd + "/" + this.sym.d.mmm + "/" + this.sym.d.yyyy + ":" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            exif: this.sym.d.yyyy + ":" + this.sym.d.mm + ":" + this.sym.d.dd + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            /*iso1: "",
            iso2: "",*/
            mySQL: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            postgreSQL1: this.sym.d.yyyy + "." + this.getDoY(this.date),
            postgreSQL2: this.sym.d.yyyy + "" + this.getDoY(this.date),
            soap: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss + "." + this.sym.t.mss,
            //unix: "",
            xmlrpc: this.sym.d.yyyy + "" + this.sym.d.mm + "" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            xmlrpcCompact: this.sym.d.yyyy + "" + this.sym.d.mm + "" + this.sym.d.dd + "T" + this.sym.t.hhh + "" + this.sym.t.mm + "" + this.sym.t.ss,
            wddx: this.sym.d.yyyy + "-" + this.sym.d.m + "-" + this.sym.d.d + "T" + this.sym.t.h + ":" + this.sym.t.m + ":" + this.sym.t.s
        },
        constants: {
            atom: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            cookie: this.sym.d.dddd + ", " + this.sym.d.dd + "-" + this.sym.d.mmm + "-" + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            iso8601: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc822: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc850: this.sym.d.dddd + ", " + this.sym.d.dd + "-" + this.sym.d.mmm + "-" + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc1036: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc1123: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yyyy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc2822: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yyyy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rfc3339: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            rss: this.sym.d.ddd + ", " + this.sym.d.dd + " " + this.sym.d.mmm + " " + this.sym.d.yy + " " + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss,
            w3c: this.sym.d.yyyy + "-" + this.sym.d.mm + "-" + this.sym.d.dd + "T" + this.sym.t.hhh + ":" + this.sym.t.mm + ":" + this.sym.t.ss
        },
        pretty: {
            a: this.sym.t.hh + ":" + this.sym.t.mm + "." + this.sym.t.ss + '' + this.time.meridiem + " " + this.sym.d.dddd + " " + this.sym.d.ddddd + " of " + this.sym.d.mmmm + ", " + this.sym.d.yyyy,
            b: this.sym.t.hh + ":" + this.sym.t.mm + " " + this.sym.d.dddd + " " + this.sym.d.ddddd + " of " + this.sym.d.mmmm + ", " + this.sym.d.yyyy
        }
    };
};


exports.addHarToHtmlIndex = addHarToHtmlIndex;
exports.finalizeHtmlIndex = finalizeHtmlIndex;
exports.initHtmlIndex = initHtmlIndex;
exports.fileIndex = fileIndex;
exports.createHAR = createHAR;
exports.absoluteUri = absoluteUri;
