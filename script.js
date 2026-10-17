
const apiUrl = "http://127.0.0.1/.../api";

const urlParams = new URLSearchParams(window.location.search);
const reservaId = urlParams.get('reserva_id');

const reservationsStatusMessage = document.getElementById('reservationsStatusMessage');

const reservationStatusMessage = document.getElementById('reservationStatusMessage');

const formStatusMessage = document.getElementById('formStatusMessage');

const createReservationBtn = document.getElementById('createReservationBtn');
const createReservationForm = document.getElementById('createReservationForm');
const cancelReservationFormBtn = document.getElementById('cancelReservationFormBtn');

const cancelReseravtionBtn = document.getElementById('cancelReseravtionBtn');

const fechaEntrada = document.getElementById('fechaEntrada');
const fechaSalida = document.getElementById('fechaSalida');

const stateFilter = document.getElementById('stateFilter');
const startDateFilter = document.getElementById('startDateFilter');
const endDateFilter = document.getElementById('endDateFilter');
const guestNameFilter = document.getElementById('guestNameFilter');
const filterBtn = document.getElementById('filterBtn');

createReservationBtn?.addEventListener('click', () => {
    createReservationForm.classList.remove('hidden');
});

cancelReservationFormBtn?.addEventListener('click', () => {
    clearCreateReservationForm();
});

createReservationForm?.addEventListener('submit', (event) => {
    event.preventDefault();

    const formData = new FormData(createReservationForm);
    const data = Object.fromEntries(formData.entries());

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    if (!emailRegex.test(data.emailHuesped)) {
        alert('Por favor, introduce un correo electrónico válido.');
        return;
    }

    if (new Date(data.fechaEntrada).getTime() < new Date().getTime()) {
        alert('Por favor, introduce un valido dia.');
        return;
    }

    if (new Date(data.fechaEntrada).getTime() > new Date(data.fechaSalida).getTime()) {
        alert('Por favor, introduce un valido rango.');
        return;
    }

    if (data.importe <= 0) {
        alert('Por favor, introduce importe válido.');
        return;
    }

    createReservation(data.nombreHuesped, data.emailHuesped, data.nombreAlojamiento, data.fechaEntrada, data.fechaSalida, data.importe, data.notas)
});

startDateFilter?.addEventListener('change', (e) => {
    const selectedStartDate = e.target.value;
    endDateFilter.min = selectedStartDate;
});

fechaEntrada?.addEventListener('change', (e) => {
    const selectedStartDate = e.target.value;
    fechaSalida.min = selectedStartDate;
});

filterBtn?.addEventListener('click', (e) => {

    e.preventDefault();

    const stateVal = stateFilter.value.trim();
    const startVal = startDateFilter.value;
    const endVal = endDateFilter.value;
    const guestVal = guestNameFilter.value.trim();

    if (!stateVal && !startVal && !endVal && !guestVal) {
        alert("Por favor, introduce al menos un criterio para filtrar.");
        return;
    }

    if (startVal && !endVal) {
        alert("Por favor, selecciona una fecha de fin.");
        return;
    }

    if (endVal && !startVal) {
        alert("Por favor, selecciona una fecha de inicio.");
        return;
    }

    filterReservations(stateVal, startVal, endVal, guestVal);

})

if (reservaId) {
    fetchReservation(reservaId)
} else {
    fetchReservations();
}

function clearCreateReservationForm() {
    createReservationForm.classList.add('hidden');
    createReservationForm.reset();
}

function formatDate(date) {
    return new Intl.DateTimeFormat('es-SP', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(new Date(date));
}

function renderReservationsRows(reservations) {
    let content = '';
    reservations.forEach(reservation => {

        const fecha_entrada = formatDate(reservation.fecha_entrada)
        const fecha_salida = formatDate(reservation.fecha_salida)
        const fecha_creacion = formatDate(reservation.fecha_creacion)

        content += `<tr>
                <td>${reservation.id}</td>
                <td>${reservation.nombre_huesped}</td>
                <td>${reservation.email_huesped}</td>
                <td>${reservation.nombre_alojamiento}</td>
                <td>${fecha_entrada}</td>
                <td>${fecha_salida}</td>
                <td>${reservation.estado}</td>
                <td>€${reservation.importe}</td>
                <td>${reservation.notas}</td>
                <td>${fecha_creacion}</td>
                <td>
                    <a href="?reserva_id=${reservation.id}"><button>Ver</button></a>
                    <button id="cancelReseravtionBtn" onclick="cancelReservation(${reservation.id})">Cancelar</button>
                </td>
            </tr>`;
    });

    return content;
}

function fetchReservations() {
    const url = `${apiUrl}/reservations`;

    reservationsStatusMessage.textContent = 'cargando reservas..';
    reservationsStatusMessage.classList.remove('hidden');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            const reservations = data.reservations;

            if (reservations.length === 0) {
                reservationsStatusMessage.textContent = 'no reservas..';
                reservationsStatusMessage.classList.remove('hidden');
            } else {
                reservationsStatusMessage.classList.add('hidden');
            }

            const content = renderReservationsRows(reservations);
            document.getElementById('reservations_table').innerHTML = content;
        })
        .catch(error => {
            reservationsStatusMessage.textContent = error.message;
            reservationsStatusMessage.classList.remove('hidden');
            reservationsStatusMessage.classList.add('error');
        })
        .finally(() => {
        });
}


function filterReservations(state, startDate, endDate, guestName) {

    const payload = {
        state: state,
        start_date: startDate,
        end_date: endDate,
        guest_name: guestName
    };

    const queryString = new URLSearchParams(payload).toString();

    const url = `${apiUrl}/reservations?${queryString}`;

    reservationsStatusMessage.textContent = 'cargando reservas..';
    reservationsStatusMessage.classList.remove('hidden');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            const reservations = data.reservations;
            if (reservations.length === 0) {
                reservationsStatusMessage.textContent = 'no reservas..';
                reservationsStatusMessage.classList.remove('hidden');
            } else {
                reservationsStatusMessage.classList.add('hidden');
            }

            const content = renderReservationsRows(reservations);
            document.getElementById('reservations_table').innerHTML = content;
        })
        .catch(error => {
            reservationsStatusMessage.textContent = error.message;
            reservationsStatusMessage.classList.remove('hidden');
            reservationsStatusMessage.classList.add('error');
        })
        .finally(() => {
        });
}

function fetchReservation(reservaId) {
    const url = `${apiUrl}/reservations?reserva_id=${reservaId}`;

    reservationStatusMessage.textContent = "Cargando Reserva.."
    reservationStatusMessage.classList.remove('hidden');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            const reserva = data.reserva;
            const eventos = data.eventos;

            reservationStatusMessage.classList.add('hidden');

            let eventosContent = '';

            eventos.forEach(evento => {
                const fecha_creacion = formatDate(evento.fecha_creacion)

                eventosContent += `
                <div class="timeline-item">
                    Reserva <strong>${evento.tipo}</strong>: ${evento.descripcion} 
                    <span style="display:block; font-size:0.75rem; color:#888;">${fecha_creacion}</span>
                </div>
                `;
            })

            const fecha_entrada = formatDate(reserva.fecha_entrada)
            const fecha_salida = formatDate(reserva.fecha_salida)
            const fecha_creacion = formatDate(reserva.fecha_creacion)

            document.getElementById('reserva_detalle_content').innerHTML = `

                ${reserva.estado !== "cancelada" ? `<button id="cancelReseravtionBtn" onclick="cancelReservation(${reserva.id})">Cancelar</button>` : ""}

                <div class="detail-grid" style="margin-top: 1.5rem;">
                    <h3>ID: <strong>${reserva.id}</strong></h3>
                    <h3>Huésped: <strong>${reserva.nombre_huesped}</strong></h3>
                    <h3>Email: <strong>${reserva.email_huesped}</strong></h3>
                    <h3>Alojamiento: <strong>${reserva.nombre_alojamiento}</strong></h3>
                    <h3>Entrada: <strong>${fecha_entrada}</strong></h3>
                    <h3>Salida: <strong>${fecha_salida}</strong></h3>
                    <h3>Estado: <strong>${reserva.estado}</strong></h3>
                    <h3>Importe: <strong>€${reserva.importe}</strong></h3>
                    <h3>Notas: <strong>${reserva.notas || '—'}</strong></h3>
                    <h3>Creado el: <strong>${fecha_creacion}</strong></h3>
                </div>

                <h2>Historial de eventos</h2>

                <div class="timeline-list">
                    ${eventosContent || '<p style="color:#666; font-size:0.85rem;">No hay eventos registrados.</p>'}
                </div>

            `;
        })
        .catch(error => {
            reservationStatusMessage.textContent = error.message
            reservationStatusMessage.classList.remove('hidden');
            reservationStatusMessage.classList.add('error');
        })
        .finally(() => {
        });
}


function createReservation(guest_name, guest_email, place_name, start_date, end_date, price, notes) {

    const url = `${apiUrl}/reservations`;

    formStatusMessage.textContent = "crearando reserva..";
    formStatusMessage.classList.remove('hidden');

    fetch(url, {
        method: "POST",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            guest_name,
            guest_email,
            place_name,
            start_date,
            end_date,
            price,
            notes,
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            clearCreateReservationForm();
            fetchReservations();
            formStatusMessage.classList.add('hidden');
        })
        .catch(error => {
            formStatusMessage.textContent = error.message;
            formStatusMessage.classList.remove('hidden');
            formStatusMessage.classList.add('error');
        })
        .finally(() => {
        });

}

function cancelReservation(reserva_id) {

    if (confirm("Estas Seguro!") == false) return;

    const url = `${apiUrl}/reservations`;

    fetch(url, {
        method: "PATCH",
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            reserva_id,
            estado: "cancelada",
        })
    })
        .then(response => {
            if (!response.ok) {
                return response.json().then(errData => {
                    throw new Error(errData.error || `HTTP error! Status: ${response.status}`);
                });
            }
            return response.json();
        })
        .then(data => {
            if (!reservaId) {
                fetchReservations();
            }
        })
        .catch(error => {
            alert(`Error Cancelar Reserva: ${error.message}`);
        })
        .finally(() => {
        });

}