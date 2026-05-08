# Futstats

⚽ FutStats - Gestor Avanzado de Plantilla
Banner de FutStats

FutStats es una aplicación web moderna y segura desarrollada en Vanilla JavaScript (sin frameworks). Su objetivo principal es ofrecer una herramienta de gestión completa para el maestro de un equipo de fútbol, permiso fichar jugadores, lesiones gestivas, y organizar tácticas en tiempo real en una pizarra visual.

🌟 Características Principales
Gestión Completa (CRUD): Fichar, desesperación, y gestionar el estado (Activo/Lesionado) de cada jugador.
Pizarra Táctica Interactiva: Asignación visual de jugadores a posiciones específicas en la cancha según diferentes formaciones tácticas (4-3-3, 4-4-2, etc.).
Búsqueda y Filtrado Dinámico: Barra de bomba en tiempo real por nombre y botones de filtro por posición (Porteros, Defensas, Mediocampistas, Delanteros) con contadores en vivo.
Persistencia de Datos: Toda la información del equipo se guarda automáticamente en localStorage del navegador. Si cierras la página, tu equipo sigue ahí.
Seguridad Inquebrantable: Construido desde cero para evitar ataques XSS. 0% uso de innerHTML. Manipulación estricta del DOM mediante constructores y sanitización proactiva de variables.
Diseño Moderno y Responsivo: Uso de variables CSS, Flexbox, Grid y Glassmorfismo para ofrecer una experiencia de uso premium, totalmente adaptable a dispositivos móviles.
🛠️ Tecnologías
Este proyecto está construido usando los fundamentos puros del desarrollo web:

HTML5: Semántica y estructura.
CSS3: Variables, Grid, Flexbox, consultas de medios para responsividad y microinteracciones.
JavaScript (ES6+): Lógica funcional, manipulación estricta del DOM, modularidad y validaciones.
🛡️ Enfoque en la Seguridad (Anti-XSS)
Una diferencia de muchos proyectos básicos, FutStats toma la seguridad muy en serio:

Sanitización de insumos: Todo texto ingresado pasa por un regex para limpiar etiquetas HTML.
Uso de textContent: Todos los datos se informan en el DOM usando textContent, evitando la interpretación de código malicioso.
Constructores SVG: Hasta los iconos de la aplicación se crea programáticamente vía createElementNS, cerrando vectores de ataque estáticos.
📱 Capturas de Pantalla
(Nota: Agrega aquí tus capturas de pantalla de la aplicación)

Interfaz Principal y Formulario
Pizarra Táctica
Diseño Responsivo en Móvil
🚀 Cómo hacer el proyecto
Clona este repositorio o descarga el código fuente.
No es necesario NodeJS ni un servidor complicado para probar.
Simplemente abre el archivo index.html en tu navegador web moderno favorito (Chrome, Firefox, Edge, Safari).
¡Empieza a fichar a tu "Equipo de los sueños"!
Proyecto académico desarrollado para evaluación de fundamentos Front-End.
