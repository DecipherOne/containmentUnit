# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1434654169.364
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/jsloader.html'
_template_uri = u'/home/jsloader.html'
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
        __M_writer = context.writer()
        __M_writer(u'\n<script type=\'text/javascript\'>\n    $LAB\n    .script("/scripts/jquery-1.7.min.js").wait()\n    .script("/combine/scripts" +\n            "?datatables/jquery.dataTables.min.js&ver=1.8.2" +\n            "&datatables/ColReorder.min.js&ver=1.0.4").wait()\n    .wait(function(){\n        $(document).ready(function() {\n            $(\'#stats_table\').dataTable({\n                "bJQueryUI": true,\n                "sPaginationType": "full_numbers",\n                "sDom": \'R<"H"lfr>t<"F"ip<\',\n                "bAutoWidth": false,\n                "iDisplayLength": 10,\n                "aaSorting": [[ 0, "desc" ]]\n            });\n\n            $(\'#summary-table\').css(\'visibility\', \'visible\');\n        });\n    })\n\t.script("/scripts/tabber.js").script("/scripts/ectoCooler.js")\n</script>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "26": 1, "36": 30, "30": 1}, "uri": "/home/jsloader.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/jsloader.html"}
__M_END_METADATA
"""
