package Myct::Controller::Mission;
use Mojo::Base 'Mojolicious::Controller';

sub info {
    my $self = shift;

    my $missions = [
        {
            id   => 1,
            text => '明石海峡大橋を通過しました。',
            time => '12:50',
            is_publish => '1',
        },
        {
            id   => 2,
            text => '瀬戸内海を通過中です',
            time => '13:50',
            is_publish => '0',
        },
    ];

    $self->render(template => 'mission/info', missions => $missions );    
}

1;
