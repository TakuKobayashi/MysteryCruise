package Myct::Controller::Mission;
use Mojo::Base 'Mojolicious::Controller';
use Mojo::File;
use Mojo::JSON qw(encode_json decode_json);
use Mojo::UserAgent;

sub info {
    my $self = shift;
    my $msg  = $self->flash('msg') or '';

    my $missions = [
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

    my $id = @missions_array;
    $id += 1;

    push(@missions_array, {id => $id, text => $mission, is_published => 0});

    $data->{missions} = [@missions_array];

    my $json = encode_json $data;
    $path = $path->spurt($json);

    my $error = '';
    my $ua    = Mojo::UserAgent->new;
    my $res;
    eval {
        $res = $ua->get("http://localhost:8000/notice?missionId=$id")->result;
    };
    if ( $@ ) {
        $error = $@;
    } 
    elsif ( $res->is_success ) {
        $error = $res->body;
    }
    elsif ( $res->is_error ) {
        $error = $res->message;
    }

    $self->flash(msg => "指令を配信しました $error");
    $self->redirect_to('/mission/info');
}

1;
