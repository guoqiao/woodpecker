#!/usr/bin/env python
# -*- coding: UTF-8 -*-

from django import forms
from .models import Resource,Topic,Watch

class WatchForm(forms.ModelForm):
    class Meta:
        model = Watch
        fields = ('each','tags',)
