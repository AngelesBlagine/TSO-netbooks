<p align="center">
  <img src="./logoUNO/banner.svg" alt="Banner del Proyecto">
</p>

<h1 align="center">💻 Sistema de Gestión de Reparación de Netbooks</h1>

<p align="center">
  <i>Una aplicación web progresiva para el control, diagnóstico y seguimiento del taller de reparación de netbooks educativas.</i>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Estado-En%20Desarrollo-success?style=for-the-badge" alt="Estado">
  <img src="https://img.shields.io/badge/Versión-1.2-blue?style=for-the-badge" alt="Versión">
  <img src="https://img.shields.io/badge/Licencia-MIT-orange?style=for-the-badge" alt="Licencia">
</p>

---

> 🎓 **Proyecto Académico** 
> Este proyecto es desarrollado por estudiantes de la **Universidad Nacional del Oeste (UNO)**, ubicada en la Provincia de Buenos Aires, Argentina. Su propósito es facilitar la gestión técnica y operativa del taller de reparación, combinando prácticas de hardware con desarrollo de software.

---

## ✨ Funcionalidades Principales

* ⚡ **Registro Rápido Inteligente:** Asignación de equipos a responsables con validación en tiempo real para evitar la duplicidad de asignaciones.
* 🛠️ **Gestión de Diagnósticos:** Operaciones CRUD (Crear, Leer, Actualizar, Liberar) celda por celda para proteger la integridad estructural de la base de datos.
* 🔐 **Autenticación y Perfiles:** Sistema de login seguro con políticas de seguridad a nivel de fila (RLS) gestionado mediante Supabase.
* 🎨 **Personalización Dinámica de UI:** Soporte completo para Modo Claro/Oscuro y selector de temas de acento (Coral, Índigo, Borgoña) persistentes en el navegador.
* ⏱️ **Bitácora de Trabajo Local:** Tabla interactiva e independiente de control de horas y tareas, almacenada en el `localStorage` de cada usuario.
* 🔍 **Guía Visual y Botiquín Técnico:** Widget interactivo con el "Kit de Reparación", precauciones de seguridad y un visor de hardware para asistir en el proceso de desbloqueo de placas.

---

## 🚀 Tecnologías y Herramientas

El proyecto está construido bajo una arquitectura *Serverless*, priorizando la ligereza del frontend y delegando la lógica de datos a servicios en la nube.

### 💻 Frontend
* <img src="https://img.shields.io/badge/HTML5-E34F26?style=flat-square&logo=html5&logoColor=white" /> Estructura semántica.
* <img src="https://img.shields.io/badge/CSS3-1572B6?style=flat-square&logo=css3&logoColor=white" /> Variables CSS para la gestión dinámica de temas.
* <img src="https://img.shields.io/badge/JavaScript-F7DF1E?style=flat-square&logo=javascript&logoColor=black" /> **Vanilla JS (ES6+)** para el manejo del DOM, `fetch` API y control de estado local.

### ⚙️ Backend & Base de Datos
* <img src="https://img.shields.io/badge/Google_Apps_Script-4285F4?style=flat-square&logo=google&logoColor=white" /> API REST intermediaria (Web App) para ejecutar la lógica de negocio y actualizar el inventario.
* <img src="https://img.shields.io/badge/Google_Sheets-34A853?style=flat-square&logo=google-sheets&logoColor=white" /> Base de datos de alta integridad en formato de cuadrícula fija (protegiendo fórmulas lógicas como `=SEQUENCE()`).
* <img src="https://img.shields.io/badge/Supabase-3ECF8E?style=flat-square&logo=supabase&logoColor=white" /> Autenticación de usuarios y base de datos PostgreSQL con políticas RLS (Row Level Security) para la gestión de perfiles.

---

## 🧠 Arquitectura de Datos Destacada

Para garantizar que múltiples alumnos puedan operar el sistema simultáneamente sin corromper la base de datos de Google Sheets, se diseñó una lógica de escritura **Celda por Celda**.
En lugar de sobreescribir filas enteras (lo cual rompía las fórmulas matriciales automáticas de los IDs), el backend de *Google Apps Script* localiza dinámicamente las coordenadas exactas de las celdas a modificar, dejando intactas las columnas protegidas y asegurando la escalabilidad del inventario.

---

## 📸 Capturas de Pantalla
<p align="center">
  <img src="https://github.com/AngelesBlagine/TSO-netbooks/blob/0dc38c1fb389c2ddc53f3413c0a3cca6f7b273a4/Capturas/herramientas.png" alt="herramientas" />
  <img src="https://github.com/AngelesBlagine/TSO-netbooks/blob/810931a26405e51405f6e6ce34d37b0dbc8585a0/Capturas/registros.png" alt="registro" />
  <img src="https://github.com/AngelesBlagine/TSO-netbooks/blob/0dc38c1fb389c2ddc53f3413c0a3cca6f7b273a4/Capturas/bit%C3%A1cora.png" alt="bitacora" />
</p>
<div align="center">
  <table>
    <tr>
      <td><img src="https://github.com/AngelesBlagine/TSO-netbooks/blob/0dc38c1fb389c2ddc53f3413c0a3cca6f7b273a4/Capturas/ajustes.png" alt="tema_claro" width="800"></td>
      <td><img src="https://github.com/AngelesBlagine/TSO-netbooks/blob/6a4a2f25432d5315709f0d3542f4bd57f56ed2ab/Capturas/ajustes_oscuro.png" alt="tema_oscuro" width="800"></td>
    </tr>
  </table>
</div>

---

