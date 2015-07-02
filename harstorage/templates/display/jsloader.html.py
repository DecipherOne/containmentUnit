# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1435672957.991
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/jsloader.html'
_template_uri = u'/display/jsloader.html'
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
        __M_writer(u'\n<script type="text/javascript">\n    $LAB\n    .script("/scripts/jquery-1.7.min.js").wait()\n')
        if c.table == "true":
            __M_writer(u'    .script("/combine/scripts" +\n            "?datatables/jquery.dataTables.min.js&ver=1.8.2" +\n            "&datatables/ColReorder.min.js&ver=1.0.4" +\n            "&datatables/TableTools.min.js&ver=1.0.4").wait()\n')
        if c.chart == "true":
            __M_writer(u'    .script("/combine/scripts" +\n            "?highcharts/highcharts.js&ver=2.2.0" +\n            "&highcharts/themes.js&ver=')
            __M_writer(escape(c.rev))
            __M_writer(u'" +\n            "&highcharts/exporting.js&ver=2.2.0").wait()\n')
        __M_writer(u'    .script("/scripts/chosen.jquery.js?ver=0.9.5")\n    .script("/scripts/harstorage.js?ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'").wait()\n    .wait(function(){\n')
        if c.chart == "true":
            __M_writer(u'        var columns = new HARSTORAGE.Columns();\n        columns.draw("')
            __M_writer(escape(c.points))
            __M_writer(u'", "')
            __M_writer(escape(c.chart_type))
            __M_writer(u'");\n')
        __M_writer(u'\n        HARSTORAGE.AggregatedStatistics("metrics");\n\n')
        if c.table == "true":
            __M_writer(u'        $(document).ready(function() {\n            $("#stats_table").dataTable({\n                "bJQueryUI": true,\n                "sPaginationType": "full_numbers",\n                "sDom": \'R<"H"Tfr>t<"F"ip>\',\n                "oTableTools": {\n                        "sSwfPath": "/swf/copy_cvs_xls.swf",\n                        "aButtons": ["copy", "csv", "xls"]\n                },\n                "bAutoWidth": false,\n                "iDisplayLength": 100,\n                "sScrollX": "4270px"\n            });\n\n            $("#summary-table").css("visibility", "visible");\n        });\n')
        __M_writer(u'    })\n\t.script("/scripts/tabber.js")\n</script>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "26": 1, "31": 1, "32": 5, "33": 6, "34": 11, "35": 12, "36": 14, "37": 14, "38": 17, "39": 18, "40": 18, "41": 20, "42": 21, "43": 22, "44": 22, "45": 22, "46": 22, "47": 24, "48": 27, "49": 28, "50": 45, "56": 50}, "uri": "/display/jsloader.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/jsloader.html"}
__M_END_METADATA
"""
