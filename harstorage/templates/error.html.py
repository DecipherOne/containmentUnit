# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431971119.782
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/error.html'
_template_uri = '/error.html'
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

    ns = runtime.TemplateNamespace(u'dochead', context._clean_inheritance_tokens(), templateuri=u'/common/dochead.html', callables=None,  calling_uri=_template_uri)
    context.namespaces[(__name__, u'dochead')] = ns

def render_body(context,**pageargs):
    __M_caller = context.caller_stack._push_frame()
    try:
        __M_locals = __M_dict_builtin(pageargs=pageargs)
        header = _mako_get_namespace(context, 'header')
        c = context.get('c', UNDEFINED)
        footer = _mako_get_namespace(context, 'footer')
        dochead = _mako_get_namespace(context, 'dochead')
        __M_writer = context.writer()
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n\n')
        __M_writer(escape(dochead.html(c.message)))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n<p style="text-align:center;margin-top:150px;margin-bottom:150px;font-size:28px;color:#498a2d">\n    ')
        __M_writer(escape(c.message))
        __M_writer(u'\n</p>\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 0, "41": 1, "42": 2, "43": 3, "44": 5, "45": 5, "46": 6, "47": 6, "48": 8, "49": 8, "50": 10, "23": 2, "56": 50, "26": 3, "29": 1}, "uri": "/error.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/error.html"}
__M_END_METADATA
"""
