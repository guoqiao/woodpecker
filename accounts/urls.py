from django.conf.urls import patterns, url


urlpatterns = patterns('',
    url(r'^$', 'accounts.views.index', name='index'),
    url(r'^register/$', 'accounts.views.register', name='register'),
    url(r'^logout/$', 'accounts.views.logout_user', name='logout'),
    url(r'^login/$', 'django.contrib.auth.views.login',{'template_name': 'accounts/login.html'}, name='login'),
)

