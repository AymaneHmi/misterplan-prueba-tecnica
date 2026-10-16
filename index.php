<?php

require_once './vendor/autoload.php';

$loader = new \Twig\Loader\FilesystemLoader('./templates');
$twig = new \Twig\Environment($loader);

$reserva_id = $_GET['reserva_id'] ?? null;

if($reserva_id) {
    echo $twig->render('reserva.html.twig');
} else {

    echo $twig->render('reservas.html.twig');
}

