#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from django.conf.urls.defaults import patterns, url

urlpatterns = patterns('feeds.views',
    url(r'^$', 'index', name='index'),
    url(r'^(?P<pk>\d+)/$', 'detail', name='detail'),
)
