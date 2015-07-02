# -*- coding:utf-8 -*-
from mako import runtime, filters, cache
UNDEFINED = runtime.UNDEFINED
__M_dict_builtin = dict
__M_locals_builtin = locals
_magic_number = 10
_modified_time = 1431976332.254
_enable_loop = True
_template_filename = 'C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/migration.html'
_template_uri = '/migration.html'
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
        footer = _mako_get_namespace(context, 'footer')
        dochead = _mako_get_namespace(context, 'dochead')
        __M_writer = context.writer()
        __M_writer(u'\n')
        __M_writer(u'\n')
        __M_writer(u'\n\n')
        __M_writer(escape(dochead.html("Data Migration")))
        __M_writer(u'\n')
        __M_writer(escape(header.html()))
        __M_writer(u'\n<p style="text-align:center;margin-top:150px;margin-bottom:150px;font-size:28px;color:#498a2d">\n    Data migration started.<br />Please do not close browser window!\n</p>\n  \n<script type=\'text/javascript\'>\n    setTimeout(function() {window.location = "/migration/migration";}, 4000);\n</script>\n')
        __M_writer(escape(footer.html()))
        return ''
    finally:
        context.caller_stack._pop_frame()


"""
__M_BEGIN_METADATA
{"source_encoding": "utf-8", "line_map": {"32": 0, "40": 1, "41": 2, "42": 3, "43": 5, "44": 5, "45": 6, "46": 6, "47": 14, "53": 47, "23": 2, "26": 3, "29": 1}, "uri": "/migration.html", "filename": "C:\\Python27\\lib\\site-packages\\harstorage-1.0-py2.7.egg\\harstorage\\templates/migration.html"}
__M_END_METADATA
"""
