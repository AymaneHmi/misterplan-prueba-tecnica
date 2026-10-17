<?php

$server = $_ENV['DB_SERVER'];
$user = $_ENV['DB_USER'];
$password = $_ENV['DB_PASSWORD'];
$db_name = $_ENV['DB_NAME'];

$conn = mysqli_connect($server, $user, $password, $db_name, '3306');

if (!$conn) {
    die('Could not connect');
}