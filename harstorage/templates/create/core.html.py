# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431978726.722
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/create/core.html'
_template_uri = '/create/core.html'
_source_encoding = 'utf-8'
from webhelpers.html import escape
_exports = []


def _mako_get_namespace(context, name):
    try:
        return context.namespaces[(__name__, name)]
    except KeyError:
        _mako_generate_namespaces(context)
        return context.namespaces[(__name__, name)]
def _mako_generate_namespaces(context):
    ns = runtime.TemplateNamespace(u'header', context._clean_inheritance_tokens(), templateuri=u'/common/header.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'header')] = ns

    ns = runtime.TemplateNamespace(u'footer', context._clean_inheritance_tokens(), templateuri=u'/common/footer.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'footer')] = ns

    ns = runtime.TemplateNamespace(u'jsloader', context._clean_inheritance_tokens(), templateuri=u'/create/jsloader.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'jsloader')] = ns

    ns = runtime.TemplateNamespace(u'dochead', context._clean_inheritance_tokens(), templateuri=u'/common/dochead.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'dochead')] = ns

def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        header = _mako_get_namespace(context, 'header')
        c = context.get('c', UNDEFINED)
        footer = _mako_get_namespace(context, 'footer')
        jsloader = _mako_get_namespace(context, 'jsloader')
        dochead = _mako_get_namespace(context, 'dochead')
        __M_writer = context.writer()
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n\n')
        __M_writer(escape(dochead.html("Superposed Tests")))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n<center>\n    <div class="sp-create">\n        <div class="howto">\n            <a href="http://code.google.com/p/harstorage/wiki/SuperposedTests" target="_blank"><strong>How to aggregate and compare results?</strong></a>\n        </div>\n\n        <div class="spinner" id="spinner"></div>\n\n        <div class="form">\n            <form action="display" id="superpose-form" method="get" onsubmit="return false;">\n                <fieldset>\n                    <legend>Aggregate and Compare</legend>\n\n                    <div id="container">\n                        <div id="step_1" class="container">\n                            <div class="title" id="step_1_head" >Set 1 &gt;</div>\n                            <div class="text">Label:</div>\n\n                            <select name="step_1_label" id="step_1_label" class="slct-label">\n')
        for label in c.labels:
            __M_writer(u'                                <option value="')
            __M_writer(escape(label))
            __M_writer(u'">')
            __M_writer(escape(label))
            __M_writer(u'</option>\n')
        __M_writer(u'                            </select>\n\n                            <div class="text">Start Time:</div>\n\n                            <select name="step_1_start_ts" id="step_1_start_ts" class="slct-start" >\n                            </select>\n\n                            <div class="text">End Time:</div>\n\n                            <select name="step_1_end_ts" id="step_1_end_ts" class="slct-end" >\n                            </select>\n\n                            <input id="step_1_add" type="image" src="/images/add_button.png"    class="image" />\n                            <input id="step_1_del" type="image" src="/images/remove_button.png" class="image" />\n                        </div>\n                    </div>\n\n                    <div>\n                        <input type="checkbox" class="checkbox" id="column" name="chart" value="column" checked="yes" /><span class="checkbox-text">Column Chart</span>\n                        <input type="checkbox" class="checkbox" id="spline" name="chart" value="spline" /><span class="checkbox-text">Spline Chart</span>\n                        <input type="checkbox" class="checkbox" name="table" value="true" checked="yes" /><span class="checkbox-text">Data Table</span><br />\n                        <input type="submit" class="submit" id="submit" value="View Result" />\n                    </div>\n                </fieldset>\n            </form>\n        </div>\n    </div>\n</center>\n')
        __M_writer(escape(jsloader.html()))
        __M_writer(u'\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"23": 3, "26": 4, "29": 1, "32": 2, "35": 0, "45": 1, "46": 2, "47": 3, "48": 4, "49": 6, "50": 6, "51": 7, "52": 7, "53": 27, "54": 28, "55": 28, "56": 28, "57": 28, "58": 28, "59": 30, "60": 58, "61": 58, "62": 59, "68": 62}, "uri": "/create/core.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/create/core.html"}
__M_END_METADATA
"""
