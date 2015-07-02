# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1435846206.743
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/ectoCooler.html'
_template_uri = u'/home/ectoCooler.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = []


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        __M_writer = context.writer()
        __M_writer(u'\r\n<div id="ectoMain">\r\n\t<div id="logo" style="float:left;">\r\n\t\t<img src="/images/slimer.png" />\r\n\t</div>\r\n\t<form id="casperForm" class="uploader" style="width:70%; background-color:#c2c2c2;margin:16px auto 16px 25%;">\r\n\t\t<label for="casperScripts" style="margin:0px 10px 0px 40px">Select The Casperjs Script to Run </label>\r\n\t\t<select id="casperScripts" style="margin:16px auto 16px 2%;">\r\n\t\t\t<option>Casperjs Script</option>\r\n\t\t\t<option value=1 selected>Performance Measurement - Har Storage</option>\r\n\t\t</select>\r\n\t\t\r\n\t\t<fieldset id="harOptions" style="width:90%;margin:16px auto 16px auto;">\r\n\t\t\t<legend>ScriptOptions</legend>\r\n\t\t\t<div id="scriptOptCont"> Parameters for selected Script go Here.</div>\r\n\t\t</fieldset>\r\n\t\t\r\n\t\t<button id="ghostIt" class="button"  style="width:200px;position:relative;left:69%;" type="button" onclick="#">Execute Script</button>\r\n\t</form>\r\n\t<hr style="width:100%" />\r\n\t<div id="scriptOutputCont" style="width:70%; background-color:#c2c2c2;margin:16px auto 16px 25%;">\r\n\t\t<div id="casperScripts" style="width:98%; height:300px;background-color:#000000; margin:16px auto 16px auto; overflow:scroll;">\r\n\t\t\t<span id="scriptOutput">\r\n\t\t\t\t<p>&nbsp;&nbsp;&nbsp;&nbsp;\t---- Script Output ----</p>\r\n\t\t\t\t\r\n\t\t\t</span>\r\n\t\t</div>\r\n\t</div>\r\n</div>')
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "27": 21, "21": 1}, "uri": "/home/ectoCooler.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/ectoCooler.html"}
__M_END_METADATA
"""
