<?php

class Response
{
    public static function send(int $statusCode, array $data): void
    {
        if (defined('PHPUNIT_RUNNING') && PHPUNIT_RUNNING === true) {
            return;
        }

        header('Content-Type: application/json; charset=utf-8');
        http_response_code($statusCode);
        echo json_encode($data);
        exit;
    }

    public static function error(int $statusCode, string $message): void
    {
        self::send($statusCode, [
            'success' => false,
            'error' => $message
        ]);
    }
}