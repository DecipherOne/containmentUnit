# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431979903.493
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/histogram/jsloader.html'
_template_uri = u'/histogram/jsloader.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = ['html']


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        __M_writer = context.writer()
        return ''
    finally:
        context.caller_stack._pop_frame()


def render_html(context):
    __M_caller = context.caller_stack._push_frame()
    try:
        c = context.get('c', UNDEFINED)
        __M_writer = context.writer()
        __M_writer(u'\n<script type="text/javascript">\n    $LAB\n    .script("/scripts/jquery-1.7.min.js").wait()\n    .script("/combine/scripts" +\n            "?highcharts/highcharts.js&ver=2.2.0" +\n            "&highcharts/themes.js&ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'" +\n            "&highcharts/exporting.js&ver=2.2.0").wait()\n    .script("/scripts/chosen.jquery.js?ver=0.9.5")\n    .script("/scripts/harstorage.js?ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'").wait()\n    .wait(function(){\n        HARSTORAGE.AggregatedStatistics("timings");\n\n        var chart = new HARSTORAGE.Histogram();\n        chart.draw("')
        __M_writer(escape(c.data))
        __M_writer(u'","')
        __M_writer(escape(c.title))
        __M_writer(u'");\n    })\n</script>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 7, "33": 7, "34": 10, "35": 10, "36": 15, "37": 15, "38": 15, "39": 15, "45": 39, "16": 0, "26": 1, "31": 1}, "uri": "/histogram/jsloader.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/histogram/jsloader.html"}
__M_END_METADATA
"""
