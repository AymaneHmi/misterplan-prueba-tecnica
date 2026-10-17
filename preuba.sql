-- phpMyAdmin SQL Dump
-- version 5.1.2
-- https://www.phpmyadmin.net/
--
-- Host: localhost:3306
-- Generation Time: Oct 15, 2026 at 09:38 AM
-- Server version: 5.7.24
-- PHP Version: 8.3.1

SET SQL_MODE = "NO_AUTO_VALUE_ON_ZERO";
START TRANSACTION;
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8mb4 */;

-- --------------------------------------------------------

--
-- Table structure for table `reservas`
--

CREATE TABLE `reservas` (
  `id` int(11) NOT NULL,
  `nombre_huesped` varchar(255) NOT NULL,
  `email_huesped` varchar(255) NOT NULL,
  `nombre_alojamiento` varchar(255) NOT NULL,
  `fecha_entrada` datetime NOT NULL,
  `fecha_salida` datetime NOT NULL,
  `estado` enum('pendiente','confirmada','cancelada') NOT NULL DEFAULT 'pendiente',
  `importe` int(11) NOT NULL,
  `notas` text NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

-- --------------------------------------------------------

--
-- Table structure for table `reservas_evento`
--

CREATE TABLE `reservas_evento` (
  `id` int(11) NOT NULL,
  `reserva_id` int(11) NOT NULL,
  `tipo` varchar(255) NOT NULL,
  `descripcion` varchar(255) NOT NULL,
  `fecha_creacion` timestamp NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8;

--
-- Indexes for dumped tables
--

--
-- Indexes for table `reservas`
--
ALTER TABLE `reservas`
  ADD PRIMARY KEY (`id`);

--
-- Indexes for table `reservas_evento`
--
ALTER TABLE `reservas_evento`
  ADD PRIMARY KEY (`id`),
  ADD KEY `reserva_id_foreign` (`reserva_id`);

--
-- AUTO_INCREMENT for dumped tables
--

--
-- AUTO_INCREMENT for table `reservas`
--
ALTER TABLE `reservas`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- AUTO_INCREMENT for table `reservas_evento`
--
ALTER TABLE `reservas_evento`
  MODIFY `id` int(11) NOT NULL AUTO_INCREMENT;

--
-- Constraints for dumped tables
--

--
-- Constraints for table `reservas_evento`
--
ALTER TABLE `reservas_evento`
  ADD CONSTRAINT `reserva_id_foreign` FOREIGN KEY (`reserva_id`) REFERENCES `reservas` (`id`) ON DELETE CASCADE;
COMMIT;


INSERT INTO `reservas` (`id`, `nombre_huesped`, `email_huesped`, `nombre_alojamiento`, `fecha_entrada`, `fecha_salida`, `estado`, `importe`, `notas`, `fecha_creacion`) VALUES
(1, 'Alejandro Gómez', 'alejandro.gomez@email.com', 'Apartamento Centro Histórico', '2026-11-01 15:00:00', '2026-11-05 11:00:00', 'confirmada', 450, 'Solicita cuna para bebé.', '2026-10-10 09:30:00'),
(2, 'María Rodríguez', 'maria.rod@email.com', 'Villa del Mar', '2026-12-20 16:00:00', '2026-12-27 10:00:00', 'confirmada', 1200, 'Llegada tardía programada para las 22:00.', '2026-10-11 14:15:00'),
(3, 'Carlos Mendoza', 'carlos.m@email.com', 'Estudio Minimalista', '2026-10-25 14:00:00', '2026-10-28 12:00:00', 'cancelada', 180, 'Cancelado por motivos laborales.', '2026-10-12 11:00:00'),
(4, 'Laura Beltrán', 'laura.b@email.com', 'Ático con Vistas', '2026-11-15 15:00:00', '2026-11-18 11:00:00', 'pendiente', 320, 'Pregunta si se admiten mascotas.', '2026-10-13 16:45:00'),
(5, 'Javier López', 'javi.lopez@email.com', 'Apartamento Centro Histórico', '2026-12-05 15:00:00', '2026-12-08 11:00:00', 'confirmada', 290, 'Huésped frecuente.', '2026-10-14 10:20:00'),
(6, 'Elena Fuentes', 'elena.f@email.com', 'Cabaña Alpina', '2026-12-30 16:00:00', '2027-01-04 11:00:00', 'pendiente', 850, 'Reserva para año nuevo.', '2026-10-15 08:00:00'),
(7, 'Diego Torres', 'diego.t@email.com', 'Estudio Minimalista', '2026-11-02 14:00:00', '2026-11-04 12:00:00', 'cancelada', 130, 'El cliente no completó el pago del depósito.', '2026-10-15 12:10:00'),
(8, 'Sofía Castro', 'sofia.c@email.com', 'Villa del Mar', '2026-11-10 16:00:00', '2026-11-15 10:00:00', 'confirmada', 950, 'Requiere código de acceso anticipado.', '2026-10-16 09:00:00'),
(9, 'Ricardo Marín', 'ricardo.m@email.com', 'Ático con Vistas', '2026-11-22 15:00:00', '2026-11-25 11:00:00', 'pendiente', 350, 'Sin observaciones.', '2026-10-16 17:30:00'),
(10, 'Lucía Ortiz', 'lucia.o@email.com', 'Cabaña Alpina', '2026-11-08 16:00:00', '2026-11-12 11:00:00', 'confirmada', 640, 'Viaje de aniversario.', '2026-10-17 11:15:00');


INSERT INTO `reservas_evento` (`id`, `reserva_id`, `tipo`, `descripcion`, `fecha_creacion`) VALUES
-- History for Reservation 1 (4 events)
(1, 1, 'creacion', 'El huésped creó la solicitud de reserva desde la web.', '2026-10-10 09:30:00'),
(2, 1, 'actualizacion_notas', 'Se añadió una nota: Solicita cuna para bebé.', '2026-10-10 10:15:00'),
(3, 1, 'pago_recibido', 'Se recibió el pago de la seña por tarjeta de crédito.', '2026-10-11 08:00:00'),
(4, 1, 'cambio_estado', 'Reserva confirmada automáticamente tras el pago.', '2026-10-11 08:02:00'),

-- History for Reservation 2 (3 events)
(5, 2, 'creacion', 'Reserva registrada a través de la plataforma de sincronización.', '2026-10-11 14:15:00'),
(6, 2, 'actualizacion_notas', 'El administrador añadió la nota de llegada tardía.', '2026-10-11 16:00:00'),
(7, 2, 'cambio_estado', 'El administrador confirmó manualmente la reserva.', '2026-10-12 09:00:00'),

-- History for Reservation 3 (4 events)
(8, 3, 'creacion', 'Solicitud de reserva ingresada como pendiente.', '2026-10-12 11:00:00'),
(9, 3, 'notificacion_enviada', 'Correo electrónico de recordatorio de pago enviado al cliente.', '2026-10-13 11:00:00'),
(10, 3, 'solicitud_cancelacion', 'El cliente solicitó la cancelación mediante el portal.', '2026-10-14 15:30:00'),
(11, 3, 'cambio_estado', 'Estado de la reserva cambiado a cancelada.', '2026-10-14 15:35:00'),

-- History for Reservation 4 (3 events)
(12, 4, 'creacion', 'Reserva creada por el usuario.', '2026-10-13 16:45:00'),
(13, 4, 'consulta_mensaje', 'Mensaje del huésped: Pregunta si se admiten mascotas.', '2026-10-13 16:50:00'),
(14, 4, 'notificacion_enviada', 'Correo de pre-aprobación enviado esperando respuesta.', '2026-10-14 10:00:00'),

-- History for Reservation 5 (5 events)
(15, 5, 'creacion', 'Reserva creada internamente por la administración.', '2026-10-14 10:20:00'),
(16, 5, 'descuento_aplicado', 'Se aplicó un 10% de descuento por cliente recurrente.', '2026-10-14 10:22:00'),
(17, 5, 'notificacion_enviada', 'Presupuesto y enlace de pago enviado al huésped.', '2026-10-14 10:25:00'),
(18, 5, 'pago_recibido', 'Validación correcta de la transferencia bancaria.', '2026-10-15 14:00:00'),
(19, 5, 'cambio_estado', 'Reserva marcada como confirmada.', '2026-10-15 14:05:00'),

-- History for Reservation 6 (3 events)
(20, 6, 'creacion', 'El huésped inició el proceso de reserva en línea.', '2026-10-15 08:00:00'),
(21, 6, 'bloqueo_calendario', 'Fechas pre-bloqueadas temporalmente en el sistema.', '2026-10-15 08:01:00'),
(22, 6, 'notificacion_enviada', 'Pendiente de recibir comprobante de pago.', '2026-10-16 08:00:00'),

-- History for Reservation 7 (4 events)
(23, 7, 'creacion', 'Solicitud de reserva exprés creada.', '2026-10-15 12:10:00'),
(24, 7, 'notificacion_enviada', 'Primer aviso de vencimiento de pago enviado.', '2026-10-16 12:10:00'),
(25, 7, 'notificacion_enviada', 'Segundo aviso: Límite de tiempo expirado.', '2026-10-17 12:10:00'),
(26, 7, 'cambio_estado', 'Reserva cancelada automáticamente por falta de pago.', '2026-10-17 12:15:00'),

-- History for Reservation 8 (5 events)
(27, 8, 'creacion', 'Reserva registrada en el sistema corporativo.', '2026-10-16 09:00:00'),
(28, 8, 'pago_recibido', 'Pago total recibido vía pasarela digital.', '2026-10-16 09:05:00'),
(29, 8, 'cambio_estado', 'Reserva confirmada en el sistema.', '2026-10-16 09:06:00'),
(30, 8, 'actualizacion_notas', 'Cliente añade nota: Requiere código de acceso anticipado.', '2026-10-16 11:30:00'),
(31, 8, 'notificacion_enviada', 'Confirmación de acceso temprano enviado al correo.', '2026-10-16 14:00:00'),

-- History for Reservation 9 (3 events)
(32, 9, 'creacion', 'Reserva creada mediante integración API.', '2026-10-16 17:30:00'),
(33, 9, 'bloqueo_calendario', 'Fechas sincronizadas y bloqueadas en canales externos.', '2026-10-16 17:32:00'),
(34, 9, 'notificacion_enviada', 'Correo de bienvenida y solicitud de garantía enviado.', '2026-10-17 09:00:00'),

-- History for Reservation 10 (4 events)
(35, 10, 'creacion', 'Reserva telefónica introducida manualmente.', '2026-10-17 11:15:00'),
(36, 10, 'actualizacion_notas', 'Se añade nota: Viaje de aniversario.', '2026-10-17 11:20:00'),
(37, 10, 'pago_recibido', 'Depósito de seguridad cobrado en recepción.', '2026-10-17 11:45:00'),
(38, 10, 'cambio_estado', 'Reserva oficialmente confirmada.', '2026-10-17 11:50:00');


/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
