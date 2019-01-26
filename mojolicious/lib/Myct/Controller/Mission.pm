package Myct::Controller::Mission;
use Mojo::Base 'Mojolicious::Controller';
use Mojo::File;
use Mojo::JSON qw(encode_json decode_json);

sub info {
    my $self = shift;
    my $msg  = $self->flash('msg') or '';

    my $missions = [
        {
            id   => 1,
            text => '明石海峡大橋を通過しました。',
            time => '11:50',
            is_publish => '1',
        },
        {
            id   => 2,
            text => '瀬戸内海を通過中です',
            time => '13:50',
            is_publish => '0',
        },
    ];

    $self->render(template => 'mission/info', missions => $missions, msg => $msg );    
}

sub publish {
    my $self = shift;

    my $mission = $self->param('mission');

    my $path   = Mojo::File->new('../data.json');
    my $handle = $path->open('>>');
    my $bytes  = $path->slurp;
    my $data   = decode_json $bytes;

    my $missions       = $data->{missions};
    my @missions_array = @{$missions};
    push(@missions_array, {text => $mission});

    $data->{missions} = [@missions_array];

    my $json = encode_json $data;
    $path = $path->spurt($json);

    $self->flash(msg => "司令を配信しました");
    $self->redirect_to('/mission/info');
}

1;