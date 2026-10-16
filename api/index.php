<?php

require_once './HttpException.php';
require_once './helpers/ResponseHelper.php';

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

if (!file_exists('./config/db.php')) {
    throw new HttpException('Internal Server Error', 500);
}

include './config/db.php';

$requestUri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);

if (str_contains($requestUri, '/reservations')) {
    include './reservations.php';
} else {
    throw new HttpException('Route not found', 404);
}