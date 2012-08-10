#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from django.db import models
from django.contrib import admin
from django.contrib.auth.models import User
from taggit.managers import TaggableManager

class Resource(models.Model):
    type = models.CharField(max_length = 100)
    name = models.CharField(max_length = 100)
    site_url = models.URLField()
    res_url = models.URLField()
    interval = models.IntegerField()#seconds
    descn = models.TextField(blank=True, default='')
    updated_on = models.DateTimeField(blank=True, null=True)
    feed_updated = models.DateTimeField(blank=True, null=True)
    order = models.IntegerField(default = 1000)
    #fans = models.ManyToManyField(User, through='Fanship')

    def __unicode__(self):
        return self.name
    class Meta:
        ordering = ['order', 'updated_on']

class ResourceAdmin(admin.ModelAdmin):
    list_display        = ('type', 'name', 'interval', 'updated_on', 'feed_updated',)

admin.site.register(Resource, ResourceAdmin)

class Topic(models.Model):
    res = models.ForeignKey(Resource)
    title = models.CharField(max_length=999)
    link = models.URLField()#idx
    author = models.CharField(max_length=64)
    date = models.DateTimeField(blank=True, null=True)
    descn = models.TextField(blank=True, default='')

    def __unicode__(self):
        return self.title

    class Meta:
        ordering = ['-date']

    def save(self, *args, **kwargs):
        super(Topic,self).save(self, *args, **kwargs)
        self.notify()

    def notify(self):
        watches = self.res.watch_set.all()
        for watch in watches:
            if watch.each:
                print 'notify for each:',self.title
                watch.email_user(self.title,self.link)
                continue
            for tag in watch.tags.all():
                if tag.name.lower() in self.title.lower():
                    print 'notify for keyword:', tag.name, self.title
                    watch.email_user(self.title,self.link)
                    break;

class TopicAdmin(admin.ModelAdmin):
    list_display        = ('res', 'title', 'link', 'author', 'date',)

admin.site.register(Topic, TopicAdmin)

class Watch(models.Model):
    user = models.ForeignKey(User)
    resource = models.ForeignKey(Resource)
    each = models.BooleanField(u'全部订阅',help_text=u'订阅此网站的所有文章')
    tags = TaggableManager(verbose_name=u'关键字订阅',help_text=u'关键字之间用英文逗号分隔',blank=True)
    created = models.DateTimeField(auto_now_add=True)
    updated = models.DateTimeField(auto_now=True)

    def email_user(self, subject, body):
        if not self.user.email:
            self.user.email = self.user.username + '@insigma.com.cn'
        self.user.email_user(subject, body)

admin.site.register(Watch)
