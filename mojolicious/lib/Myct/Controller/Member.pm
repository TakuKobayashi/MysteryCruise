package Myct::Controller::Member;
use Mojo::Base 'Mojolicious::Controller';
use Mojo::File;
use Mojo::JSON qw(encode_json decode_json);

sub info {
    my $self = shift;

    my $path   = Mojo::File->new('local.json');
    my $handle = $path->open('<');
    my $bytes  = $path->slurp;
    my $data   = decode_json $bytes;

    my $users  = $data->{users};
    my $msg    = $self->flash('msg') or '';

    $self->render(template => 'member/info', users => $users, msg => $msg );
}

sub regist {
    my $self = shift;
    $self->render(template => 'member/regist');
}

sub regist_action {
    my $self = shift;

    my $name = $self->param('name');
    my $role = $self->param('role');

    my $path   = Mojo::File->new('local.json');
    my $handle = $path->open('>>');
    my $bytes  = $path->slurp;
    my $data   = decode_json $bytes;

    my $users       = $data->{users};
    my @users_array = @{$users};
    my $id          = @users_array;
    $id+=1;

    push(@users_array, {
       id   => $id,
       name => $name,
       role => $role,
       live => 1,
    });

    $data->{users} = [@users_array];

    my $json = encode_json $data;
    $path = $path->spurt($json);

    $self->flash(msg => "ユーザを追加しました");
    $self->redirect_to('/member/info');
}

1;
