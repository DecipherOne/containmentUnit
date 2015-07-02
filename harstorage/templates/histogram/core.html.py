# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431979903.488
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/histogram/core.html'
_template_uri = '/histogram/core.html'
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

    ns = runtime.TemplateNamespace(u'jsloader', context._clean_inheritance_tokens(), templateuri=u'/histogram/jsloader.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'jsloader')] = ns

    ns = runtime.TemplateNamespace(u'dochead', context._clean_inheritance_tokens(), templateuri=u'/histogram/dochead.html', callables=None,  calling_uri=_template_uri)
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
        __M_writer(escape(dochead.html("Histogram | " + c.label)))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n<center>\n    <div class="sp-display">\n        <div id="chart"></div>\n        <p class="title">Histogram</p>\n\n        <div class="selector">\n            <select id="timings" class="chosen-select">\n')
        for metric, title in c.metrics:
            __M_writer(u'                <option value="')
            __M_writer(escape(metric))
            __M_writer(u'">')
            __M_writer(escape(title))
            __M_writer(u'</option>\n')
        __M_writer(u'            </select>\n        </div>\n    </div>\n</center>\n')
        __M_writer(escape(jsloader.html()))
        __M_writer(u'\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"23": 3, "26": 4, "29": 1, "32": 2, "35": 0, "45": 1, "46": 2, "47": 3, "48": 4, "49": 6, "50": 6, "51": 7, "52": 7, "53": 15, "54": 16, "55": 16, "56": 16, "57": 16, "58": 16, "59": 18, "60": 22, "61": 22, "62": 23, "68": 62}, "uri": "/histogram/core.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/histogram/core.html"}
__M_END_METADATA
"""
