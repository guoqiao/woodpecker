#!ENV/bin/python
# -*- coding: utf-8 -*-

import os
import subprocess
from optparse import OptionParser

os.environ['DJANGO_SETTINGS_MODULE'] = "settings"
from django.conf import settings

HERE = os.path.abspath(os.path.dirname(__file__))
PYTHON = os.path.join(HERE,'ENV/bin/python')
MANAGE = os.path.join(HERE,'manage.py')
CONF = (
    ('wp','runwsgiserver host=0.0.0.0 port=8089'),
)

def render_conf(tmpl,args,dest):
    from django.template import Template, Context
    t = Template(tmpl)
    c = Context(args)
    r = t.render(c)

    f = open(dest, 'w')
    f.write(r)
    f.close()

    print 'conf save to %s:' % dest
    print r

SV_CONF_TMPL = """
[program:{{PROGRAM}}]
command = {{COMMAND}}
"""

def render_conf_sv(program,command):
    command = '%s %s %s' % (PYTHON,MANAGE,command)
    args = {'PROGRAM':program, 'COMMAND':command}
    dest = '/etc/supervisor/conf.d/%s.conf' % program

    render_conf(SV_CONF_TMPL,args,dest)

def svctrl(c):
    x = 'supervisorctl ' + c
    os.system(x)

def create_link(target, link_name):
    x = 'ln -s -f -T %s %s' % (target,link_name)
    print x
    subprocess.call(x.split(), cwd='/var/www/')

def init():
    for p,c in CONF:
        render_conf_sv(p,c)
    svctrl('update')

def ctrl(op):
    for p,c in CONF:
        svctrl('%s %s' % (op,p))

def start():
    ctrl('start')

def stop():
    ctrl('stop')

def restart():
    ctrl('restart')

def clean():
    b = False
    for root, dirs, files in os.walk(HERE):
        for f in files:
            if f.endswith(('.pyc', '.orig', '.log', '.swp', '~')):
                full = os.path.join(root, f)
                print 'rm', full
                os.remove(full)
                b = True
    if not b:
        print 'no file to clean'

def main():
    parser = OptionParser()
    parser.add_option("-i", "--init",
                      action="store_true", dest="init", default=False,
                      help="init config")
    parser.add_option("-s", "--start",
                      action="store_true", dest="start", default=False,
                      help="start service in daemon mode")
    parser.add_option("-t", "--stop",
                      action="store_true", dest="stop", default=False,
                      help="stop service")
    parser.add_option("-r", "--restart",
                      action="store_true", dest="restart", default=False,
                      help="restart service in daemon mode")
    parser.add_option("-c", "--clean",
                      action="store_true", dest="clean", default=False,
                      help="clean tmp files in this dir")

    (options, args) = parser.parse_args()

    if options.init:
        init()
    elif options.start:
        start()
    elif options.stop:
        stop()
    elif options.restart:
        restart()
    elif options.clean:
        clean()
    else:
        parser.print_help()

if __name__ == '__main__':
    main()
