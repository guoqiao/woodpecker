#!/usr/bin/env python
# -*- coding: UTF-8 -*-
from django.shortcuts import render,redirect
from django.contrib import messages
from models import Resource,Watch
from forms import WatchForm

def index(request):
    objs = Resource.objects.all()
    return render(request, 'feeds/index.html', {'objs': objs})

def detail(request, pk):
    obj = Resource.objects.get(pk=pk)
    form = WatchForm()
    if request.user.is_authenticated():
        watches = obj.watch_set.filter(user=request.user)
        if watches:
            watch = watches[0]
        else:
            watch = Watch(user=request.user,resource=obj)

        if request.method == 'GET':
            form = WatchForm(instance=watch)
        else:
            form = WatchForm(request.POST,instance=watch)
            if form.is_valid():
                form.save()
                messages.success(request, u'你的订阅信息已保存.')
                return redirect('feeds:detail',pk=pk)

    return render(request, 'feeds/detail.html', {'r': obj,'form': form})

