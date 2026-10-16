<?php

include './config/db.php';

class ReservationController
{

    private $db;

    public function __construct($database_connection)
    {
        $this->db = $database_connection;
    }

    private function is_reservation_found(int $reserva_id): bool
    {
        $query = "SELECT id FROM reservas WHERE id = ? LIMIT 1";
        $stmt = $this->db->prepare($query);
        $stmt->bind_param("i", $reserva_id);

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(array('error' => 'Database error'));
            exit;
        }

        $result = $stmt->get_result();
        $found = $result->num_rows > 0;
        $stmt->close();

        return $found;
    }

    public function get_reservations($state = null, $start_date = null, $end_date = null, $guest_name = null)
    {
        $query = "SELECT * FROM reservas";
        $conditions = [];
        $types = "";
        $params = [];

        if (!empty($state)) {
            $conditions[] = "estado = ?";
            $types .= "s";
            $params[] = $state;
        }

        if (!empty($start_date)) {
            $conditions[] = "fecha_entrada >= ?";
            $types .= "s";
            $params[] = $start_date;
        }

        if (!empty($end_date)) {
            $conditions[] = "fecha_salida <= ?";
            $types .= "s";
            $params[] = $end_date;
        }

        if (!empty($guest_name)) {
            $conditions[] = "nombre_huesped LIKE ?";
            $types .= "s";
            $params[] = "%" . $guest_name . "%";
        }

        if (count($conditions) > 0) {
            $query .= " WHERE " . implode(" AND ", $conditions);
        }

        $stmt = $this->db->prepare($query);

        if (count($params) > 0) {
            $stmt->bind_param($types, ...$params);
        }

        if (!$stmt->execute()) {
            http_response_code(500);
            echo json_encode(['error' => 'Could not fetch reservations']);
            return;
        }

        $result = $stmt->get_result();
        $reservations = [];

        while ($row = $result->fetch_assoc()) {
            $reservations[] = $row;
        }

        $stmt->close();

        http_response_code(200);
        echo json_encode(['reservations' => $reservations]);
    }

    public function get_reservation(int $reserva_id)
    {
        if (!$this->is_reservation_found($reserva_id)) {
            http_response_code(404);
            echo json_encode(array('error' => 'Reservation not found'));
            return;
        }

        $reserva_query = "SELECT * FROM reservas WHERE id = ?";
        $stmt = $this->db->prepare($reserva_query);
        $stmt->bind_param("i", $reserva_id);
        $stmt->execute();
        $reserva = $stmt->get_result()->fetch_assoc();
        $stmt->close();

        $eventos_query = "SELECT * FROM reservas_evento WHERE reserva_id = ?";
        $stmt = $this->db->prepare($eventos_query);
        $stmt->bind_param("i", $reserva_id);
        $stmt->execute();

        $result = $stmt->get_result();
        $eventos = [];

        while ($row = $result->fetch_assoc()) {
            $eventos[] = $row;
        }

        $stmt->close();

        http_response_code(200);
        echo json_encode([
            'reserva' => $reserva,
            'eventos' => $eventos,
        ]);
    }

    private function create_reservation_event($reserva_id, $type, $description)
    {

        $query = "INSERT INTO reservas_evento (reserva_id, tipo, descripcion) VALUES (?, ?, ?)";
        $stmt = $this->db->prepare($query);

        $stmt->bind_param("iss", $reserva_id, $type, $description);

        if (!$stmt->execute()) {
            throw new HttpException('Could not create reservation', 500);
        }
    }

    public function create_reservation($guest_name, $guest_email, $place_name, $start_date, $end_date, $price, $notes)
    {
        $query = "INSERT INTO reservas (nombre_huesped, email_huesped, nombre_alojamiento, fecha_entrada, fecha_salida, estado, importe, notas) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
        $stmt = $this->db->prepare($query);

        $estado = 'pendiente';

        $price = (int) $price;

        $stmt->bind_param("ssssssis", $guest_name, $guest_email, $place_name, $start_date, $end_date, $estado, $price, $notes);

        if ($stmt->execute()) {

            $this->create_reservation_event($stmt->insert_id, "crear", "una reserva esta creada");

            http_response_code(201);
            echo json_encode(array('success' => 'Reservation created', 'id' => $stmt->insert_id));
        } else {
            throw new HttpException('Could not create reservation', 500);
        }
        $stmt->close();
    }

    public function update_reservation($reserva_id, $state)
    {

    }

}
?>