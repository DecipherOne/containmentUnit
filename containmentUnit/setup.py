from setuptools import setup, find_packages

setup(
    name='containmentUnit',
    version='1.0',
    description='A collection of front end performance measurement tools.',
    long_description="Web Interfaces and unification of Wraith Image Regression,Har Storage, and running casperjs scripts",
    author='Will Canada',
    author_email='willc@decpherone.com',
    url='https://github.com/DecipherOne/crtHarstorage/tree/Containment-Unit---Performance-Tools',
    license='BSD, see LICENSE.txt for details',
    platforms=['Linux', 'Windows'],
    setup_requires=[],
    install_requires=[],
    packages=find_packages(),
    include_package_data=True,
    test_suite='nose.collector',
    package_data={'containmentUnit': ['i18n/*/LC_MESSAGES/*.mo']},
    zip_safe=False,
    paster_plugins=['PasteScript', 'Pylons'],
    entry_points="""
    [paste.app_factory]
    main = containmentUnit.config.middleware:make_app
    [paste.app_install]
    main = pylons.util:PylonsInstaller
    """,
)