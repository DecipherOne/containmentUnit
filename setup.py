from setuptools import setup, find_packages

setup(
    name='containmentUnit',
    version='1.0.14',
    description='A collection of front end performance measurement tools.',
    long_description="Web Interfaces and unification of Wraith Image Regression,Har Storage, and running casperjs scripts",
    author='Will Canada',
    author_email='willc@decipherone.com',
    url='https://github.com/DecipherOne/containmentUnit',
    license='BSD, see LICENSE.txt for details',
    platforms=['Linux', 'Windows'],
    dependency_links=['http://ftp.gnome.org/pub/GNOME/binaries/win32/pygtk/2.22/pygtk-all-in-one-2.22.5.win32-py2.7.msi'],
    setup_requires=['pylons==1.0','webob==0.9.8','browsermob-proxy==0.7.1','webtest==1.3.3'],
    install_requires=[],
    packages=find_packages(),
    include_package_data=True,
    test_suite='nose.collector',
    package_data={'containmentUnit': ['*.*'], 'EGG-INFO':['*.*']},
    zip_safe=False,
    paster_plugins=['PasteScript', 'Pylons'],
    entry_points="""
    [paste.app_factory]
    main = containmentUnit.config.middleware:make_app
    [paste.app_install]
    main = pylons.util:PylonsInstaller
    """,
    classifiers=[
    # How mature is this project? Common values are
    #   3 - Alpha
    #   4 - Beta
    #   5 - Production/Stable
    'Development Status :: 4 - Beta',
    # Indicate who your project is intended for
    'Intended Audience :: Developers',
    'Intended Audience :: Information Technology',
    'Topic :: Software Development :: Testing',
    # Pick your license as you wish (should match "license" above)
     'License :: OSI Approved :: BSD License',

    # Specify the Python versions you support here. 
    'Programming Language :: Python :: 2.7',
    
],
)