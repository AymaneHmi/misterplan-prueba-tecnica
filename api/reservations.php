<?php

include './controllers/ReservationController.php';
include './helpers/InputDataHelper.php';

$helper = new InputDataHelper();
$controller = new ReservationController($conn);

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    Response::send(200, []);
    exit;
}

if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $reserva_id = $helper->sanitizeInput($_GET['reserva_id'] ?? '') ?? null;

    if ($reserva_id) {

        $controller->get_reservation($reserva_id);
        exit;

    } else {

        $state = $helper->sanitizeInput($_GET['state'] ?? '') ?? null;
        $start_date = $helper->sanitizeInput($_GET['start_date'] ?? '') ?? null;
        $end_date = $helper->sanitizeInput($_GET['end_date'] ?? '') ?? null;
        $guest_name = $helper->sanitizeInput($_GET['guest_name'] ?? '') ?? null;

        if ($start_date && $end_date) {
            if (!$helper->isValidDate($start_date)) {
                throw new HttpException('start date is not valid', 400);
            }

            if (!$helper->isValidDate($end_date)) {
                throw new HttpException('end date is not valid', 400);
            }

            if (!$helper->isDateRangeValid($start_date, $end_date)) {
                throw new HttpException('date range is not valid', 400);
            }
        }

        $controller->get_reservations($state, $start_date, $end_date, $guest_name);
        exit;

    }

}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $json = file_get_contents('php://input');
    $inputData = json_decode($json, true) ?? [];

    $guest_name = $helper->sanitizeInput($inputData['guest_name'] ?? '');
    $guest_email = $helper->sanitizeInput($inputData['guest_email'] ?? '');
    $place_name = $helper->sanitizeInput($inputData['place_name'] ?? '');
    $start_date = $helper->sanitizeInput($inputData['start_date'] ?? '');
    $end_date = $helper->sanitizeInput($inputData['end_date'] ?? '');
    $price = $helper->sanitizeInput($inputData['price'] ?? '');
    $notes = $helper->sanitizeInput($inputData['notes'] ?? '');

    if (!$guest_name) {
        throw new HttpException('guest name is required', 400);
    }
    if (!$guest_email) {
        throw new HttpException('guest email is required', 400);
    }
    if (!$place_name) {
        throw new HttpException('place name is required', 400);
    }
    if (!$start_date) {
        throw new HttpException('start date is required', 400);
    }
    if (!$end_date) {
        throw new HttpException('end date is required', 400);
    }
    if (!$price) {
        throw new HttpException('price is required', 400);
    }
    if (!$notes) {
        throw new HttpException('notes is required', 400);
    }

    if (!$helper->isValidEmail($guest_email)) {
        throw new HttpException('email is not valid', 400);
    }

    if (!$helper->isValidDate($start_date)) {
        throw new HttpException('start date is not valid', 400);
    }

    if (!$helper->isValidDate($end_date)) {
        throw new HttpException('end date is not valid', 400);
    }

    if (!$helper->isDateRangeValid($start_date, $end_date)) {
        throw new HttpException('date range is not valid', 400);
    }

    $controller->create_reservation($guest_name, $guest_email, $place_name, $start_date, $end_date, $price, $notes);
    exit;

}

if ($_SERVER['REQUEST_METHOD'] === 'PATCH' || $_SERVER['REQUEST_METHOD'] === 'PUT') {

    $json = file_get_contents('php://input');
    $inputData = json_decode($json, true) ?? [];

    $reserva_id = $helper->sanitizeInput($inputData['reserva_id'] ?? '');
    $estado = $helper->sanitizeInput($inputData['estado'] ?? '');

    $estados = ["pendiente", "confirmada", "cancelada"];

    if (!$reserva_id) {
        throw new HttpException('reserva id is required', 400);
    }

    if (!$estado) {
        throw new HttpException('estado id is required', 400);
    }
    
    if (!in_array($estado, $estados, true)) {
        throw new HttpException('estado correcta is required', 400);
    }

    $controller->update_reservation($reserva_id, $estado);

    exit;

}

throw new HttpException('Method Not Allowed', 405);
