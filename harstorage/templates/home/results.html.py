# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1434645962.704
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/results.html'
_template_uri = u'/home/results.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = []


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        h = context.get('h', UNDEFINED)
        range = context.get('range', UNDEFINED)
        c = context.get('c', UNDEFINED)
        __M_writer = context.writer()
        __M_writer(u'<div class="uploader">\r\n\t<form action="/results/upload" enctype="multipart/form-data" method="post" style="float:left; margin-right:16px; margin-left:50px;">\r\n\t\t<fieldset>\r\n\t\t\t<legend>New File</legend>\r\n\t\t\t<input class="file"     id="file"   name="file"     type="file"     size="25" />\r\n\t\t\t<input class="button"   id="upload" name="upload"   type="submit"   value="Upload"/>\r\n\t\t</fieldset>\r\n\t</form>\r\n</div>\r\n<div class="uploader">\r\n\t<form action="#">\r\n\t\t<fieldset>\r\n\t\t\t<legend>Reports</legend>\r\n\t\t\t<button class="button"  style="width:200px;" type="button" onclick="window.location.href=\'/superposed/create\';">Aggregate and Compare</button>\r\n\t\t</fieldset>\r\n\t</form>\r\n</div>\r\n\r\n\r\n\r\n<div class="summary" id="summary-table" style="margin:16px auto 16px auto;">\r\n\t<p class="title">Latest Results</p>\r\n\r\n\t<table class="display" id="stats_table">\r\n\t\t<thead>\r\n\t\t\t<tr>\r\n\t\t\t\t<th width="18%" class="left">Timestamp</th>\r\n\t\t\t\t<th width="20%" class="left">Label</th>\r\n\t\t\t\t<th width="33%" class="left">URL</th>\r\n\t\t\t\t<th width="10%" class="center">Total Size (kB)</th>\r\n\t\t\t\t<th width="9%" class="center">Total Requests</th>\r\n\t\t\t\t<th width="10%" class="center">Full Load Time (s)</th>\r\n\t\t\t</tr>\r\n\t\t</thead>\r\n\t\t<tbody>\r\n')
        for index in range(c.rowcount):
            __M_writer(u'\t\t\t<tr> \r\n\t\t\t\t<td class="left">')
            __M_writer(escape(c.metrics_table[0][index]))
            __M_writer(u'</td>\r\n\t\t\t\t<td class="left"><a href="')
            __M_writer(escape(h.url_for(controller='results',action='details',label=c.metrics_table[1][index],method='GET')))
            __M_writer(u'">')
            __M_writer(escape(c.metrics_table[1][index]))
            __M_writer(u'</a></td>\r\n\t\t\t\t<td class="left"><a href="')
            __M_writer(escape(h.url_for(controller='results',action='details',url=c.metrics_table[2][index],method='GET')))
            __M_writer(u'">')
            __M_writer(escape(c.metrics_table[2][index]))
            __M_writer(u'</a></td>\r\n\t\t\t\t<td class="center">')
            __M_writer(escape(c.metrics_table[3][index]))
            __M_writer(u'</td>\r\n\t\t\t\t<td class="center">')
            __M_writer(escape(c.metrics_table[4][index]))
            __M_writer(u'</td>\r\n\t\t\t\t<td class="center">')
            __M_writer(escape(c.metrics_table[5][index]))
            __M_writer(u'</td>\r\n\t\t\t</tr>\r\n')
        __M_writer(u'\t\t</tbody>\r\n\t</table>\r\n</div>\r\n        \r\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "24": 1, "25": 36, "26": 37, "27": 38, "28": 38, "29": 39, "30": 39, "31": 39, "32": 39, "33": 40, "34": 40, "35": 40, "36": 40, "37": 41, "38": 41, "39": 42, "40": 42, "41": 43, "42": 43, "43": 46, "49": 43}, "uri": "/home/results.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/results.html"}
__M_END_METADATA
"""
