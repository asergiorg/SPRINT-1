# Grand Aventures Web

> El servicio web que hemos diseñado en este Sprint 1 corresponde con un servicio web de una agencia de reserva de actividades turísticas. El objetivo es que el usuario pueda explorar las actividades ofertadas, registrarse, realizar reservas y gestionarlas.

---

## Miembros del Equipo
* Ubay Antonio Batista Santana
* Ángel Sergio Reyes Guedes
* Kilian Santana Delgado

---

## Requisitos y Funcionalidades

### De la página
* Mostrar información representativa de la empresa, el logo, nombre, redes sociales, etc.
* El sistema permitirá a los usuarios registrados acceder a la información sobre las diferentes actividades que han reservado, realizado y recomendaciones en base a sus reservas.
* El sistema debe incluir un catálogo de las actividades recomendadas del mes en la página principal.
* El sistema deberá permitir a sus usuarios, realizar la búsqueda de cualquier actividad que desee.

### Actividades
* El sistema debe permitir a cualquier usuario, registrado o no, navegar por las actividades. 
* El sistema ofrecerá a los usuarios la oportunidad de realizar búsquedas para las actividades, pudiendo filtrar por sus características (precio, duración, hora, lenguaje, valoración, y accesibilidad).
* Una actividad se ofertará con nombre, valoración e imagen.
* El sistema permitirá a los usuarios registrados valorar actividades que hayan realizado.
* Al acceder a la información de la actividad se ofrecerá una descripción más detallada de la misma (duración, idioma, accesibilidad, precio y reseñas).
* El sistema permitirá a los usuarios registrados realizar la reserva de la propia actividad en que se encuentre, determinando la fecha y el número de personas que participarán en dicha actividad.

### Sign Up
* Los usuarios deberán cumplimentar un formulario con su información pertinente (nombre completo, nombre de usuario, fecha de nacimiento, género, número de teléfono, correo electrónico y contraseña).
* La edad mínima del usuario deberá ser de 16 años.
* El sistema no deberá permitir que dos usuarios compartan el mismo correo electrónico ni el nombre de usuario.
* El nombre de usuario no podrá contener espacios o caracteres especiales.
* La contraseña tendrá que cumplir con los requisitos mínimos de seguridad.

### Reserva de actividades
* Durante la reserva, el usuario especificará la fecha y el número de personas para el que realiza la reserva, teniendo que garantizarse la disponibilidad de esta.
* El sistema no permitirá que un usuario realice una reserva para más de 20 personas en una actividad.
* El sistema no permitirá que un usuario reserve en más de una actividad para la misma fecha y hora.
* Para contratar actividades, se ofrecerán distintos métodos de pago online.
* Para completar la reserva, el usuario deberá estar registrado.

---

## Diseño y Prototipado

* **PDF Mockups:** `GrandAventures mockups.pdf` (Adjunto en el repositorio)
* **Storyboard:** [Ver diseño interactivo en Figma](https://www.figma.com/proto/tLkOYybRyv4sexzZ6YwQBl/Activity-Web?node-id=333-530&p=f&viewport=292%2C216%2C0.18&t=I3Xprb6hmbnbc88z-1&scaling=min-zoom&content-scaling=fixed&page-id=131%3A1061)

---

## Estructura del Proyecto

### Páginas HTML

| Archivo | Descripción |
| :--- | :--- |
| `index.html` | Home page |
| `activities.html` | Activities page |
| `activity-information.html` | Activity Information page |
| `reservation-information.html`| Reservation page |
| `login-modal.html` | Log in modal |
| `signup-modal.html` | Sign up modal |
| `user-activities.html` | User information page |

### Componentes / Templates

| Template | Usado en… |
| :--- | :--- |
| `header.html` | `index.html`, `activities.html`, `activity-information.html`, `reservation-information.html`, `user-activities.html` |
| `footer.html` | `index.html`, `activities.html`, `activity-information.html`, `reservation-information.html`, `user-activities.html` |
| `activity1.html` | `index.html` |
| `activity2.html` | `activities.html` |
| `activity3.html` | `user-activities.html` |
| `reservation-card.html` | `reservation-information.html` |
| `review.html` | `activity-information.html` |

