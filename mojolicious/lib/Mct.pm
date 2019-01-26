package Mct;
use Mojo::Base 'Mojolicious';
use Mojolicious::Sessions;

sub startup {
  my $self = shift;

  my $sessions = Mojolicious::Sessions->new;
  $sessions->cookie_name('mct_mojo');
  $sessions->default_expiration(86400);

  $self->secrets(['mct_sapporo']);

  # Router
  my $r = $self->routes;

  # Normal route to controller
  $r->get('/')->to('member#info');

  # $r->get('/login')->to('auth#login');
  # $r->post('/login')->to('auth#login_action');

  # $r->get('/member/info')->to('member#info');
  # $r->get('/member/regist')->to('member#regist');
  # $r->post('/member/regist')->to('member#regist_action');
  # $r->get('/member/edit')->to('member#edit');
  # $r->post('/member/edit')->to('member#edit_action');

  # $r->get('/mission/info')->to('mission#info');
  # $r->get('/mission/regist')->to('mission#regist');
  # $r->post('/mission/regist')->to('mission#regist_action');
  # $r->get('/mission/edit')->to('mission#edit');
  # $r->post('/mission/edit')->to('mission#edit_action');
}

1;
