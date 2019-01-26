package Myct::Controller::Member;
use Mojo::Base 'Mojolicious::Controller';

sub info {
    my $self = shift;

    my $users = [
        {
            id   => 1,
            name => 'user1',
            role => '警察',
            team => '警察',
            live => 1,
        },
        {
            id   => 2,
            name => 'user1',
            role => '泥棒',
            team => '泥棒',
            live => 1,
        },
    ];

    $self->render(template => 'member/info', users => $users );    
}

sub regist {
    my $self = shift;
    $self->render(template => 'member/regist');
}

sub regist_action {
    my $self = shift;
    $self->render(template => 'member/info');
}

1;
