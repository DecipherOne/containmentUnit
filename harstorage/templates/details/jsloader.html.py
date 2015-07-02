# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431976722.441
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/details/jsloader.html'
_template_uri = u'/details/jsloader.html'
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
        __M_writer(u'\n<script type="text/javascript">\n    $LAB\n    .script("/scripts/tabber.js?ver=1.9.1").wait()\n    .script("/scripts/jquery-1.7.min.js").wait()\n    .script("/scripts/harviewer/require.js").wait()\n    .script("/scripts/harviewer/core/trace.js").wait()\n    .script("/scripts/harviewer/domplate/domplate.js").wait()\n    .script("/combine/scripts" +\n            "?highcharts/highcharts.js&ver=2.2.0" +\n            "&highcharts/themes.js&ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'" +\n            "&highcharts/exporting.js&ver=2.2.0").wait()\n    .script("/scripts/spin.js?ver=1.2.1").wait()\n    .script("/scripts/chosen.jquery.js?ver=0.9.5").wait()\n    .script("/scripts/harstorage.js?ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'").wait()\n    .wait(function(){\n        var run_info = new HARSTORAGE.RunInfo("')
        __M_writer(escape(c.mode))
        __M_writer(u'", "')
        __M_writer(escape(c.label))
        __M_writer(u'", "')
        __M_writer(escape(c.query))
        __M_writer(u'", "')
        __M_writer(escape(c.histo))
        __M_writer(u'");\n        run_info.addSpinner();\n        run_info.get();\n        run_info.timedStyleChange();\n\n        var timeline = new HARSTORAGE.Timeline(run_info);\n        timeline.get("')
        __M_writer(escape(c.label))
        __M_writer(u'", "')
        __M_writer(escape(c.mode))
        __M_writer(u'");\n    })\n</script>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 11, "33": 11, "34": 15, "35": 15, "36": 17, "37": 17, "38": 17, "39": 17, "40": 17, "41": 17, "42": 17, "43": 17, "44": 23, "45": 23, "46": 23, "47": 23, "16": 0, "53": 47, "26": 1, "31": 1}, "uri": "/details/jsloader.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/details/jsloader.html"}
__M_END_METADATA
"""
