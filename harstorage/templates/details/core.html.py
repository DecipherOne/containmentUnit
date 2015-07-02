# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431976722.435
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/details/core.html'
_template_uri = '/details/core.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = []


def _mako_get_namespace(context, name):
    try:
        return context.namespaces[(__name__, name)]
    except KeyError:
        _mako_generate_namespaces(context)
        return context.namespaces[(__name__, name)]
def _mako_generate_namespaces(context):
    ns = runtime.TemplateNamespace(u'header', context._clean_inheritance_tokens(), templateuri=u'/common/header.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'header')] = ns

    ns = runtime.TemplateNamespace(u'footer', context._clean_inheritance_tokens(), templateuri=u'/common/footer.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'footer')] = ns

    ns = runtime.TemplateNamespace(u'jsloader', context._clean_inheritance_tokens(), templateuri=u'/details/jsloader.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'jsloader')] = ns

    ns = runtime.TemplateNamespace(u'dochead', context._clean_inheritance_tokens(), templateuri=u'/details/dochead.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'dochead')] = ns

def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        header = _mako_get_namespace(context, 'header')
        c = context.get('c', UNDEFINED)
        footer = _mako_get_namespace(context, 'footer')
        jsloader = _mako_get_namespace(context, 'jsloader')
        dochead = _mako_get_namespace(context, 'dochead')
        __M_writer = context.writer()
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n\n')
        __M_writer(escape(dochead.html("Details | " + c.label)))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n<center>\n    <div class="results">\n        <div id="timeline"></div>\n\n        <p class="title">Run Info</p>\n\n        <div class="selector">\n            <select id="run_timestamp" class="chosen-select">\n')
        for timestamp in c.timestamp:
            __M_writer(u'                <option value="')
            __M_writer(escape(timestamp))
            __M_writer(u'"> ')
            __M_writer(escape(timestamp))
            __M_writer(u'</option>\n')
        __M_writer(u'            </select>\n        </div>\n\n        <div class="spinner" id="spinner"></div>\n\n        <div class="tabber">\n            <div class="tabbertab" title="Summary">                \n                <div class="container-max">\n                    <div class="title-umax">Full Load Time:</div>       <div class="value" id="full-load-time">n/a</div>\n                    <div class="title-umax">onLoad Event:</div>         <div class="value" id="onload-event">n/a</div>\n                    <div class="title-umax">Start Render Time:</div>    <div class="value" id="start-render-time">n/a</div>\n                    <div class="title-umax">Time to First Byte:</div>   <div class="value" id="time-to-first-byte">n/a</div>\n                </div>\n                \n                <div class="container-max">\n                    <div class="title-max">Total DNS Time:</div>        <div class="value" id="total-dns-time">n/a</div>\n                    <div class="title-max">Total Transfer Time:</div>   <div class="value" id="total-transfer-time">n/a</div>\n                    <div class="title-max">Total Server Time:</div>     <div class="value" id="total-server-time">n/a</div>\n                    <div class="title-max">Avg. Connecting Time:</div>  <div class="value" id="avg-connecting-time">n/a</div>\n                    <div class="title-max">Avg. Blocking Time:</div>    <div class="value" id="avg-blocking-time">n/a</div>\n                </div>\n                <div class="container-min">\n                    <div class="title-min">Total Size:</div>           <div class="value" id="total-size">n/a</div>\n                    <div class="title-min">Text Files:</div>           <div class="value" id="text-size">n/a</div>\n                    <div class="title-min">Media Files:</div>          <div class="value" id="media-size">n/a</div>\n                    <div class="title-min">Cache Size:</div>           <div class="value" id="cache-size"></div>\n                </div>\n                <div class="container-umin">\n                    <div class="title-min">Requests:</div>             <div class="value-min" id="requests">n/a</div>\n                    <div class="title-min">Redirects:</div>            <div class="value-min" id="redirects">n/a</div>\n                    <div class="title-min">Bad Requests:</div>         <div class="value-min" id="bad-requests">n/a</div>\n                    <div class="title-min">Domains:</div>              <div class="value-min" id="domains">n/a</div>\n\n                    <div><input type="image" src="/images/help_button.png" class="image" onclick="window.open(\'http://code.google.com/p/harstorage/wiki/HowToUse#Summary_Stats\');"/></div>\n                </div>\n            </div>\n\n            <div class="tabbertab" title="Resources">\n                <div id="by-size"></div>\n                <div id="by-req"></div>\n            </div>\n\n            <div class="tabbertab" title="Domains">\n                <div id="domains-by-size"></div>\n                <div id="domains-by-req"></div>\n            </div>\n\n            <div class="tabbertab" title="Page Speed Details">\n                <div id="pagespeed"></div>\n            </div>\n\n            <div class="tabbertab" title="HAR Viewer">\n                <div id="harviewer"></div>\n                <div class="newtab">\n                    <button id="newtab">View in New Tab</button>\n                </div>\n            </div>\n\n            <div class="tabbertab" title="Manage Data">\n                <div id="manager">\n                    <button id="histo">View Histogram</button>\n                    <button id="agg-btn">Aggregate Tests</button>\n                    <button id="del-btn">Delete Current Test</button>\n                    <button id="del-all-btn">Delete All Tests</button>\n                </div>\n            </div>\n        </div>\n    </div>\n</center>\n')
        __M_writer(escape(jsloader.html()))
        __M_writer(u'\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"23": 3, "26": 4, "29": 1, "32": 2, "35": 0, "45": 1, "46": 2, "47": 3, "48": 4, "49": 6, "50": 6, "51": 7, "52": 7, "53": 16, "54": 17, "55": 17, "56": 17, "57": 17, "58": 17, "59": 19, "60": 88, "61": 88, "62": 89, "68": 62}, "uri": "/details/core.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/details/core.html"}
__M_END_METADATA
"""
