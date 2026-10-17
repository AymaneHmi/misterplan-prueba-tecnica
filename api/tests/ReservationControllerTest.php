<?php

if (!defined('PHPUNIT_RUNNING')) {
    define('PHPUNIT_RUNNING', true);
}

use PHPUnit\Framework\TestCase;

require_once __DIR__ . '/../controllers/ReservationController.php';
require_once __DIR__ . '/../helpers/ResponseHelper.php';
require_once __DIR__ . '/../HttpException.php';

class ReservationControllerTest extends TestCase
{
    private $db;
    private $controller;

    protected function setUp(): void
    {
        $this->db = new mysqli('127.0.0.1', 'root', 'root', 'preuba');

        if ($this->db->connect_error) {
            $this->fail("Database connection failed: " . $this->db->connect_error);
        }

        $this->db->begin_transaction();

        $this->controller = new ReservationController($this->db);
    }

    protected function tearDown(): void
    {
        if ($this->db) {
            $this->db->rollback();
            $this->db->close();
        }
    }

    public function testCreateReservationSuccessfullyInsertsData()
    {
        $guestName = "John Doe";
        $guestEmail = "john@example.com";
        $placeName = "Beachside Apartment";
        $startDate = "2026-06-01";
        $endDate = "2026-06-07";
        $price = 600;
        $notes = "Needs extra towels";

        $this->controller->create_reservation(
            $guestName,
            $guestEmail,
            $placeName,
            $startDate,
            $endDate,
            $price,
            $notes
        );

        $resResult = $this->db->query("SELECT * FROM reservas WHERE email_huesped = 'john@example.com'");
        $this->assertEquals(1, $resResult->num_rows, "The reservation should be inserted into the database.");

        $reservation = $resResult->fetch_assoc();
        $reservationId = $reservation['id'];

        $this->assertEquals('pendiente', $reservation['estado']);
        $this->assertEquals(600, $reservation['importe']);

        $eventResult = $this->db->query("SELECT * FROM reservas_evento WHERE reserva_id = $reservationId");
        $this->assertEquals(1, $eventResult->num_rows, "An event logging the creation should exist.");

        $event = $eventResult->fetch_assoc();
        $this->assertEquals('creacion', $event['tipo']);
    }

    public function testCreateReservationThrowsExceptionOnDatabaseFailure()
    {
        $brokenDb = $this->getMockBuilder(mysqli::class)
            ->disableOriginalConstructor()
            ->getMock();

        $brokenDb->method('prepare')->willReturn(false);

        $failedController = new ReservationController($brokenDb);

        $this->expectException(HttpException::class);

        $failedController->create_reservation("Jane", "jane@ex.com", "Room", "2026-01-01", "2026-01-02", 100, "");
    }
}
