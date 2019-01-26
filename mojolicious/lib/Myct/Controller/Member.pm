package Myct::Controller::Member;
use Mojo::Base 'Mojolicious::Controller';

sub info {
    my $self = shift;

    # Render template "example/welcome.html.ep" with message
    $self->render(template => 'member/info', msg => 'test');    
}

1;
