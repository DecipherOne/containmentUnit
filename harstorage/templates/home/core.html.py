# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1434658114.903
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/core.html'
_template_uri = '/home/core.html'
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

    ns = runtime.TemplateNamespace(u'jsloader', context._clean_inheritance_tokens(), templateuri=u'/home/jsloader.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'jsloader')] = ns

    ns = runtime.TemplateNamespace(u'dochead', context._clean_inheritance_tokens(), templateuri=u'/home/dochead.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'dochead')] = ns

def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        header = _mako_get_namespace(context, 'header')
        footer = _mako_get_namespace(context, 'footer')
        jsloader = _mako_get_namespace(context, 'jsloader')
        dochead = _mako_get_namespace(context, 'dochead')
        __M_writer = context.writer()
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n\n\n')
        __M_writer(escape(dochead.html("CRT-HAR Storage")))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n\n<div id="mainContent" class="tabber" style="margin:16px auto 16px auto;">\n\t<div class="tabbertab ">\n\t\t<h3 style="display:none;">Results</h3>\n\t\t')
        runtime._include_file(context, u'/home/results.html', _template_uri)
        __M_writer(u'\n\t</div>\n\t<div class="tabbertab">\n\t\t<h3 style="display:none;">Ecto Cooler</h3>\n\t\t')
        runtime._include_file(context, u'/home/ectoCooler.html', _template_uri)
        __M_writer(u'\n\t</div>\n</div>\n\n')
        __M_writer(escape(jsloader.html()))
        __M_writer(u'\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 2, "58": 22, "35": 0, "64": 58, "55": 17, "44": 1, "45": 2, "46": 3, "47": 4, "48": 7, "49": 7, "50": 8, "51": 8, "52": 13, "53": 13, "54": 17, "23": 3, "56": 21, "57": 21, "26": 4, "29": 1}, "uri": "/home/core.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/home/core.html"}
__M_END_METADATA
"""
