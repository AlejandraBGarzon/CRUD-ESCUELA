🛹 Escuela Patinaje ROLLER SKATE

Este proyecto es un sitio web para una escuela de patinaje llamado **ROLLER SKATE**. El objetivo principal es mostrar la integración de tecnologías **front-end** y **back-end** a través de un sistema **CRUD (Crear, Leer, Actualizar y Eliminar)**.

Se divide en dos partes principales: el cliente (frontend) y el servidor (backend), y demuestra cómo funciona la comunicación entre ambos para gestionar datos dinámicos con la conexión en Mongo.

---

## 🌐 Demo

🔗 [Repositorio en GitHub](https://github.com/CrisAlejo316/ESCUELA-PATINAJE)


---

## 🎯 Objetivos del Proyecto

- Aplicar conocimientos de desarrollo web completo (front + back)
- Implementar operaciones CRUD
- Simular una pequeña plataforma de gestión para una escuela de patinaje

---

## 🚀 Tecnologías Utilizadas

### Front-end

- HTML5  
- CSS3  
- JavaScript  

### Back-end

- Node.js  


---

## 📂 Estructura del Proyecto
```
📦 ESCUELA PATINAJE/
├── frontend/                     # Parte visual del sitio (cliente)
│   ├── images/                   # Imágenes del sitio web
│   ├── paginas/                  # HTML,CSS y JS
│   │   ├── animaciones.js
│   │   ├── pagina-inicio.css
│   │   └── pagina-inicio.html
│   └── service/                   
│       └── escuela-patinaje.js
│
├── backend/                      # Lógica del servidor y conexión a datos
│   ├── models/                   # Modelos de datos 
│   │   └── Deportista.js
│   ├── nodemodels/               # Modelos definidos con Node.js 
│   │   └── estudianteModel.js
│   └── routes/                   # Rutas del CRUD (API)
│       └── deportistas.js
│
└──README.md                     # Documentación del proyecto
