# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1435672958.002
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/dochead.html'
_template_uri = u'/display/dochead.html'
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


def render_html(context,title):
    __M_caller = context.caller_stack._push_frame()
    try:
        c = context.get('c', UNDEFINED)
        __M_writer = context.writer()
        __M_writer(u'\n<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN"\n"http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">\n<html xmlns="http://www.w3.org/1999/xhtml" lang="en" xml:lang="en">\n<head>\n    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>\n    <title>')
        __M_writer(escape(title))
        __M_writer(u'</title>\n\n    <link rel="stylesheet" type="text/css" href="/styles/main.css?ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'" />\n    <link rel="stylesheet" type="text/css" href="/combine/styles?datatables/table_jui.css&ver=1.8.2&datatables/ColReorder.css&ver=1.0.4&datatables/TableTools_JUI.css&ver=1.0.4" />\n    <link rel="stylesheet" type="text/css" href="/styles/datatables/jquery-ui-1.8.4.custom.css" />\n    <link rel="stylesheet" type="text/css" href="/styles/chosen/chosen.css?ver=0.9.5" />\n\t<link rel="stylesheet" type="text/css" href="/styles/tabber.css?ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'" />\n    <!--[if IE]>\n        <link rel="stylesheet" type="text/css" href="/styles/main-ie.css?ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'" />\n    <![endif]-->\n\n    <script type=\'text/javascript\' src="/combine/scripts?LAB.min.js&ver=2.0.3&preferences.js&ver=')
        __M_writer(escape(c.rev))
        __M_writer(u'"></script>\n</head>\n<body>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 7, "33": 7, "34": 9, "35": 9, "36": 13, "37": 13, "38": 15, "39": 15, "40": 18, "41": 18, "47": 41, "16": 0, "26": 1, "31": 1}, "uri": "/display/dochead.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/dochead.html"}
__M_END_METADATA
"""
