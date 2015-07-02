# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431978726.731
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/create/jsloader.html'
_template_uri = u'/create/jsloader.html'
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
        __M_writer(u'\n<script type="text/javascript">\n    $LAB\n    .script("/combine/scripts?spin.js&ver=1.2.1").wait()\n    .script("/combine/scripts?harstorage.js&ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'").wait()\n    .wait(function(){\n        var superpose_form = new HARSTORAGE.SuperposeForm();\n        superpose_form.addSpinner();\n        superpose_form.setTimestamps("step_1_label");\n    })\n</script>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 5, "33": 5, "39": 33, "16": 0, "26": 1, "31": 1}, "uri": "/create/jsloader.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/create/jsloader.html"}
__M_END_METADATA
"""
