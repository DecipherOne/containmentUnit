# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431978730.419
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/modules.html'
_template_uri = u'/display/modules.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = ['table', 'chart']


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        __M_writer = context.writer()
        __M_writer(u'\n\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_table(context):
    __M_caller = context.caller_stack._push_frame()
    try:
        h = context.get('h', UNDEFINED)
        c = context.get('c', UNDEFINED)
        range = context.get('range', UNDEFINED)
        len = context.get('len', UNDEFINED)
        __M_writer = context.writer()
        __M_writer(u'\n<div id="summary-table">\n<table class="display" id="stats_table">\n    <thead>\n        <tr>\n            <th width="340px" class="left">')
        __M_writer(escape(c.headers[0]))
        __M_writer(u'</th>\n')
        for column in range(len(c.headers)-1):
            __M_writer(u'                <th class="center">')
            __M_writer(escape(c.headers[column+1]))
            __M_writer(u'</th>\n')
        __M_writer(u'        </tr>\n    </thead>\n    <tbody>\n')
        for row in range(c.rowcount):
            __M_writer(u'        <tr>\n            <td class="left"><a href="')
            __M_writer(escape(h.url_for(controller='results', action='details', label=c.metrics_table[0][row], method='GET')))
            __M_writer(u'">')
            __M_writer(escape(c.metrics_table[0][row]))
            __M_writer(u'</a></td>\n')
            for column in range(len(c.headers)-1):
                __M_writer(u'                <td class="center">')
                __M_writer(escape(c.metrics_table[column+1][row]))
                __M_writer(u'</td>\n')
            __M_writer(u'        </tr>\n')
        __M_writer(u'    </tbody>\n</table>\n</div>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_chart(context):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_writer = context.writer()
        __M_writer(u'\n<div id="chart"></div>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "21": 3, "27": 5, "35": 5, "36": 10, "37": 10, "38": 11, "39": 12, "40": 12, "41": 12, "42": 14, "43": 17, "44": 18, "45": 19, "46": 19, "47": 19, "48": 19, "49": 20, "50": 21, "51": 21, "52": 21, "53": 23, "54": 25, "60": 1, "64": 1, "70": 64}, "uri": "/display/modules.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/modules.html"}
__M_END_METADATA
"""
