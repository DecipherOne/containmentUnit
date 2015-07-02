# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1434658055.811
_enable_loop = True
_template_filename = u'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/executeCasperScripts.html'
_template_uri = u'/home/executeCasperScripts.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = []


def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        repr = context.get('repr', UNDEFINED)
        __M_writer = context.writer()

# This block is used to run casperjs scripts from a web interface.
        import os
        import subprocess
        
        APP_ROOT = "C:\Python27\Lib\site-packages\harstorage-1.0-py2.7.egg\harstorage"
        
        scriptDirectory = APP_ROOT + "\\templates\\home\\CasperScripts\\"
        args ="casperjs " + scriptDirectory + "performanceHarRepo.js " + scriptDirectory + "HighResLinks.json 100 3";
        print "app root is: " + APP_ROOT;
        #This opens a pipe to the standard cmd shell and sets input and output
        def executeCasperScript():
                myProc = subprocess.Popen(args,shell=True,stdin=subprocess.PIPE,stdout=subprocess.PIPE,stderr=subprocess.STDOUT);
                stdout_value, stderr_value = myProc.communicate('through stdin to stdout\n')
                print '\n\tcombined output:', repr(stdout_value)
                print '\n\tstderr value   :', repr(stderr_value)
        
        
        __M_locals_builtin_stored = __M_locals_builtin()
        __M_locals.update(__M_dict_builtin([(__M_key, __M_locals_builtin_stored[__M_key]) for __M_key in ['args','APP_ROOT','subprocess','executeCasperScript','scriptDirectory','os'] if __M_key in __M_locals_builtin_stored]))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"16": 0, "22": 1, "47": 22}, "uri": "/home/executeCasperScripts.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/executeCasperScripts.html"}
__M_END_METADATA
"""
