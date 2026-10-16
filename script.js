
const apiUrl = "http://127.0.0.1/preuba/api";

const urlParams = new URLSearchParams(window.location.search);
const reservaId = urlParams.get('reserva_id');

const loadingEl = document.getElementById('loading-indicator');
const errorEl = document.getElementById('error-indicator');
const emptyEl = document.getElementById('empty-indicator');

const createReservationBtn = document.getElementById('createReservationBtn');
const createReservationForm = document.getElementById('createReservationForm');
const cancelReservationFormBtn = document.getElementById('cancelReservationFormBtn');

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

function renderReservationsRows(reservations) {
    let content = '';
    reservations.forEach(reservation => {

        const fecha_entrada = new Intl.DateTimeFormat('es-SP', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(reservation.fecha_entrada));
        const fecha_salida = new Intl.DateTimeFormat('es-SP', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(reservation.fecha_salida));
        const fecha_creacion = new Intl.DateTimeFormat('es-SP', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        }).format(new Date(reservation.fecha_creacion));

        content += `<tr>
                <td>${reservation.id}</td>
                <td>${reservation.nombre_huesped}</td>
                <td>${reservation.email_huesped}</td>
                <td>${reservation.nombre_alojamiento}</td>
                <td>${fecha_entrada}</td>
                <td>${fecha_salida}</td>
                <td>${reservation.estado}</td>
                <td>$${reservation.importe}</td>
                <td>${reservation.notas}</td>
                <td>${fecha_creacion}</td>
                <td>
                    <a href="?reserva_id=${reservation.id}"><button>Ver</button></a>
                    <button onclick="cancelReservation(${reservation.id})">Cancelar</button>
                </td>
            </tr>`;
    });

    return content;
}

function fetchReservations() {
    const url = `${apiUrl}/reservations`;

    loadingEl?.classList?.remove('hidden');
    emptyEl.classList.add('hidden')

    fetch(url)
        .then(response => {
            if (!response.ok) {
                errorEl?.classList?.remove('hidden');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingEl?.classList?.add('hidden');
            const reservations = data.reservations;

            if (reservations.length === 0) {
                emptyEl.classList.remove('hidden')
            }
            const content = renderReservationsRows(reservations);
            document.getElementById('reservations_table').innerHTML = content;
        })
        .catch(error => {
            errorEl?.classList?.remove('hidden');
        })
        .finally(() => {
            loadingEl?.classList?.add('hidden');
        });
}

function fetchReservation(reservaId) {
    const url = `${apiUrl}/reservations?reserva_id=${reservaId}`;

    loadingEl?.classList?.remove('hidden');

    fetch(url)
        .then(response => {
            if (!response.ok) {
                errorEl?.classList?.remove('hidden');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            errorEl?.classList?.add('hidden');
            const reserva = data.reserva;
            const eventos = data.eventos;

            let eventosContent = '';

            eventos.forEach(evento => {
                eventosContent += `
                <div>
                    ${evento.descripcion} ${evento.fecha_creacion} ${evento.tipo}
                </div>
                `;
            })

            document.getElementById('reserva_detalle_content').innerHTML = `
            <h3>id : ${reserva.id} </h3>
            <h3>nombre_huesped : ${reserva.nombre_huesped} </h3>
            <h3>email_huesped : ${reserva.email_huesped} </h3>
            <h3>nombre_alojamiento : ${reserva.nombre_alojamiento} </h3>
            <h3>fecha_entrada : ${reserva.fecha_entrada} </h3>
            <h3>fecha_salida : ${reserva.fecha_salida} </h3>
            <h3>estado : ${reserva.estado} </h3>
            <h3>importe : ${reserva.importe} </h3>
            <h3>notas : ${reserva.notas} </h3>
            <h3>fecha_creacion : ${reserva.fecha_creacion} </h3>

            <h2>historial de evento</h2>

            ${eventosContent}

            `;
        })
        .catch(error => {
            errorEl?.classList?.remove('hidden');
        })
        .finally(() => {
            loadingEl?.classList?.add('hidden');
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

    loadingEl?.classList?.remove('hidden');
    emptyEl.classList.add('hidden')

    fetch(url)
        .then(response => {
            if (!response.ok) {
                errorEl?.classList?.remove('hidden');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            loadingEl?.classList?.add('hidden');
            const reservations = data.reservations;
            if (reservations.length === 0) {
                emptyEl.classList.remove('hidden')
            }
            const content = renderReservationsRows(reservations);
            document.getElementById('reservations_table').innerHTML = content;
        })
        .catch(error => {
            errorEl?.classList?.remove('hidden');
        })
        .finally(() => {
            loadingEl?.classList?.add('hidden');
        });
}


function createReservation(guest_name, guest_email, place_name, start_date, end_date, price, notes) {

    const url = `${apiUrl}/reservations`;

    loadingEl?.classList?.remove('hidden');
    emptyEl.classList.add('hidden')

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
                errorEl?.classList?.remove('hidden');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            clearCreateReservationForm();
            fetchReservations();
            loadingEl?.classList?.add('hidden');
        })
        .catch(error => {
            errorEl?.classList?.remove('hidden');
        })
        .finally(() => {
            loadingEl?.classList?.add('hidden');
        });

}

function cancelReservation(reserva_id) {
    const url = `${apiUrl}/reservations`;

    loadingEl?.classList?.remove('hidden');
    emptyEl.classList.add('hidden')

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
                errorEl?.classList?.remove('hidden');
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            fetchReservations();
            loadingEl?.classList?.add('hidden');
        })
        .catch(error => {
            errorEl?.classList?.remove('hidden');
        })
        .finally(() => {
            loadingEl?.classList?.add('hidden');
        });

}