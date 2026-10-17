<?php

require_once __DIR__ . '/../vendor/autoload.php';
require_once __DIR__ . '/HttpException.php';
require_once __DIR__ . '/helpers/ResponseHelper.php';

$dotenv = Dotenv\Dotenv::createImmutable(__DIR__ . "/..");
$dotenv->load();

include __DIR__ . '/config/db.php';

set_error_handler(function ($severity, $message, $file, $line) {
    if (!(error_reporting() & $severity)) {
        return;
    }
    throw new ErrorException($message, 0, $severity, $file, $line);
});

set_exception_handler(function (Throwable $exception) {
    error_log($exception->getMessage() . " in " . $exception->getFile() . " on line " . $exception->getLine());

    $statusCode = method_exists($exception, 'getStatusCode') ? $exception->getStatusCode() : 500;
    $message = $statusCode === 500 ? 'An internal server error occurred' : $exception->getMessage();

    Response::error($statusCode, $message);
});

header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, PATCH, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (str_contains($requestUri, '/reservations')) {
    include './reservations.php';
} else {
    throw new HttpException('Route not found', 404);
}