# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431978730.396
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/core.html'
_template_uri = '/display/core.html'
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

    ns = runtime.TemplateNamespace(u'jsloader', context._clean_inheritance_tokens(), templateuri=u'/display/jsloader.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'jsloader')] = ns

    ns = runtime.TemplateNamespace(u'modules', context._clean_inheritance_tokens(), templateuri=u'/display/modules.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'modules')] = ns

    ns = runtime.TemplateNamespace(u'dochead', context._clean_inheritance_tokens(), templateuri=u'/display/dochead.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'dochead')] = ns

def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        c = context.get('c', UNDEFINED)
        jsloader = _mako_get_namespace(context, 'jsloader')
        footer = _mako_get_namespace(context, 'footer')
        modules = _mako_get_namespace(context, 'modules')
        header = _mako_get_namespace(context, 'header')
        dochead = _mako_get_namespace(context, 'dochead')
        __M_writer = context.writer()
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n\n')
        __M_writer(escape(dochead.html("Superposed Tests | " + c.agg_type)))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n<center>\n    <div class="sp-display">\n')
        if c.chart == "true":
            __M_writer(u'            ')
            __M_writer(escape(modules.chart()))
            __M_writer(u'\n')
        __M_writer(u'    \n        <p class="title">Aggregated Statistics</p>\n\n        <div class="selector">\n            <select id="metrics" class="chosen-select">\n                <option value="Average">Average</option>\n                <option value="Median">Median</option>\n                <option value="90th Percentile">90th Percentile</option>\n                <option value="Minimum">Minimum</option>\n                <option value="Maximum">Maximum</option>s\n            </select>\n        </div>\n\n')
        if c.table == "true":
            __M_writer(u'            ')
            __M_writer(escape(modules.table()))
            __M_writer(u'\n')
        __M_writer(u'    </div>\n</center>\n')
        __M_writer(escape(jsloader.html()))
        __M_writer(u'\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"23": 3, "26": 4, "29": 1, "32": 5, "35": 2, "38": 0, "49": 1, "50": 2, "51": 3, "52": 4, "53": 5, "54": 7, "55": 7, "56": 8, "57": 8, "58": 11, "59": 12, "60": 12, "61": 12, "62": 14, "63": 27, "64": 28, "65": 28, "66": 28, "67": 30, "68": 32, "69": 32, "70": 33, "76": 70}, "uri": "/display/core.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/display/core.html"}
__M_END_METADATA
"""
