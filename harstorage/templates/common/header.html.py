# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1434641019.156
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/common/header.html'
_template_uri = u'/common/header.html'
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
        __M_writer(u'\n<div class="header">\n    <div class="left"><a href="/">CRT - HAR Storage</a></div>\n\t\n    <div class="right"><a href="http://code.google.com/p/harstorage/" target="_blank">Google Code Page</a></div>\n    <div class="right"><a href="javascript:HARSTORAGE.view_preferences()">Result ChartTheme</a></div>\n    <div class="hr"></div>\n    <div id="preferences">\n        <strong>Theme</strong>\n\n        <div class="hr"></div>\n\n        <form id="theme-list" action="none">\n            <input class="radio" type="radio" name="theme" value="light" /><span class="theme-name">Light<br /></span>\n            <input class="radio" type="radio" name="theme" value="light-green" /><span class="theme-name">Light Green<br /></span>\n            <input class="radio" type="radio" checked="true" name="theme" value="dark-green" /><span class="theme-name">Dark Green</span>\n        </form>\n\n        <div class="hr"></div>\n\n        <button type="button" onclick="javascript:HARSTORAGE.update_preferences();">Apply</button>\n\n        <div id="close">\n            <a href="javascript:HARSTORAGE.view_preferences()">X</a>\n        </div>\n    </div>\n\t\n</div>\n')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "26": 1, "36": 30, "30": 1}, "uri": "/common/header.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/common/header.html"}
__M_END_METADATA
"""
