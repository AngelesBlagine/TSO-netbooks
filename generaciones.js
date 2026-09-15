// LISTA DE GENERACIONES, ojala se cambie el tema de las imagenes en el deply
export const generaciones = [
  {
    id: "G1",
    nombre: "Generación 1",
    marcas: ["EXO"],
    caracteristicas: "Robusta. Plástico blanco/gris claro duro y macizo...",
    indicadores: ["Estructura rígida blanco/gris", "Decorado estilo cuero"],
    imagenes: [
      "generacion/g1.1.png",
      "generacion/g1.2.png",
      "generacion/g1.3.png",
      "generacion/g1.png",
    ],
    procedimiento: [
      "Quitar resistencia R223.",
      "Quitar resistencia R280.",
      "Puentear con estaño la resistencia R283.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G1.png",
        detalle:
          "Ubicación: Resistencia R223 cerca del dispositivo marcado como ICB-IND. Viéndola de frente, se encuentra a la izquierda del cuadrado, justo en el medio, con cuatro resistencias alrededor.",
      },
      {
        img: "desbloqueo/p2G1.png",
        detalle:
          "Ubicación: Resistencia R280 próxima al dispositivo con marca ITE. Viéndola de frente, está en la parte superior, tercera resistencia contando desde la derecha, debajo de un bloque naranja más grande. En la foto ya aparece retirada.",
      },
      {
        img: "desbloqueo/p3G1.png",
        detalle:
          "Ubicación: Espacio vacío de R283 en la misma sección donde se quitó la resistencia anterior, hacia la izquierda. Se debe hacer un puente de estaño uniendo las dos puntas con soldador, rellenando el espacio.",
      },
    ],
  },
  {
    id: "G2",
    nombre: "Generación 2",
    marcas: ["Samsung"],
    caracteristicas: "Marca Samsung. Cámara frontal alargada...",
    indicadores: ["Marca Samsung", "Salida VGA"],
    imagenes: ["generacion/g2.1.png", "generacion/g2.png"],
    procedimiento: ["Realizar puente de estaño en pin 21 y 22."],
    desbloqueo: [
      {
        img: "desbloqueo/pinesG2.png",
        detalle:
          "Ubicación: Lado trasero de la placa madre. Puente de estaño en los pines 21 y 22 del chip TPM (también llamados 7 y 8). Raspar el plástico protector si lo cubre antes de soldar.",
      },
    ],
  },
  {
    id: "G3",
    nombre: "Generación 3",
    marcas: ["CDR", "DEPOT"],
    caracteristicas:
      "Bordes redondeados, manija fija (CDR) o sin manija (DEPOT).",
    indicadores: ["Manija fija o sin manija", "Carcasa robusta"],
    imagenes: [
      "generacion/g3.1.png",
      "generacion/g3.2.png",
      "generacion/g3.png",
    ],
    procedimiento: [
      "Quitar resistencia R180.",
      "Quitar resistencia R289.",
      "Quitar capacitor C146.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G3.png",
        detalle:
          "Ubicación: Resistencia R180 en el lado trasero, cerca del dispositivo ITE. Viéndolo de frente, está en la parte superior, sobre el borde superior derecho de un círculo en la placa.",
      },
      {
        img: "desbloqueo/p2G3.png",
        detalle:
          "Ubicación: Resistencia R289 en el lado trasero, próxima a la pila. Cerca del dispositivo ICS, lado izquierdo, segunda resistencia leyendo de abajo hacia arriba.",
      },
      {
        img: "desbloqueo/p3G3.png",
        detalle:
          "Ubicación: Capacitor C146 en el lado frontal, debajo del hueco de la RAM. Cerca de un objeto ovalado, rodeado por cuatro componentes grandes.",
      },
    ],
  },
  {
    id: "G4",
    nombre: "Generación 4",
    marcas: ["EXO", "CDR"],
    caracteristicas: "Manija plegable, posible entrada TDT.",
    indicadores: ["Manija plegable", "Entrada TDT"],
    imagenes: [
      "generacion/g4.1.png",
      "generacion/g4.2.png",
      "generacion/g4.png",
    ],
    procedimiento: [
      "Quitar resistencia R177 y capacitor C185.",
      "Quitar resistencia R307.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G4.png",
        detalle:
          "Ubicación: Resistencias R177 y C185 en el lado frontal, juntas una debajo de la otra. Están cerca de un dispositivo rectangular alargado y dos conectores, en la parte inferior derecha con la RAM arriba.",
      },
      {
        img: "desbloqueo/p2G4.png",
        detalle:
          "Ubicación: Resistencia R307 en el lado trasero, próxima al dispositivo ITE. Se encuentra en la parte superior del mismo, hacia el lado contrario del hueco del cooler.",
      },
    ],
  },
  {
    id: "G4.1",
    nombre: "Generación 4.1",
    marcas: ["EXO", "CDR"],
    caracteristicas: "Variante con desbloqueo por puente en chip TPM.",
    indicadores: ["Chip TPM visible", "Puente en pines "],
    imagenes: [
      "generacion/g41.png",
      "generacion/g41.2.png",
      "generacion/g41.3.png",
      "generacion/g414.png",
    ],
    procedimiento: ["Realizar puente de estaño en pin 21 y 22."],
    desbloqueo: [
      {
        img: "desbloqueo/puenteG4.1.png",
        detalle:
          "Ubicación: Lado trasero de la placa madre, cerca del cooler. Puente de estaño en los pines 21 y 22 del chip TPM (también llamados 7 y 8). Raspar el plástico protector si lo cubre antes de soldar.",
      },
    ],
  },
  {
    id: "G5/G6",
    nombre: "Generación 5 y 6",
    marcas: ["Noblex"],
    caracteristicas: "Cámara giratoria.",
    indicadores: ["Cámara giratoria", "Diseño moderno"],
    imagenes: [
      "generacion/g56x.png",
      "generacion/g56.1.png",
      "generacion/g56.2.png",
      "generacion/g56.png",
    ],
    procedimiento: [
      "Quitar resistencia R273.",
      "Quitar resistencia R114.",
      "Puentear con estaño la resistencia R112.",
    ],
    desbloqueo: [
      {
        img: "desbloqueo/p1G56.png",
        detalle:
          "Ubicación: Resistencia R273 en el lado frontal, cerca del procesador. Se encuentra en el medio de la fila de resistencias.",
      },
      {
        img: "desbloqueo/p2G56.png",
        detalle:
          "Ubicación: Resistencia R114 en el lado trasero de la placa madre.",
      },
      {
        img: "desbloqueo/p3G56.png",
        detalle:
          "Ubicación: Espacio vacío de R112 en el lado trasero de la placa madre. Se debe hacer un puente de estaño uniendo las dos puntas con soldador, rellenando el espacio.",
      },
    ],
  },
];

// CUESTIONARIO REDUCIDO A Exactamente 4 PREGUNTAS
export const wizardQuestions = [
  {
    key: "marca",
    title: "1. ¿Qué marca figura en la carcasa de la netbook?",
    options: [
      { label: "EXO", value: "EXO" },
      { label: "Banghó", value: "Bangho" },
      { label: "Positivo BGH", value: "BGH" },
      { label: "Samsung", value: "Samsung" },
      { label: "CDR / DEPOT", value: "CDR_DEPOT" },
      { label: "Noblex / Otra", value: "Noblex" },
    ],
  },
  {
    key: "camara",
    title: "2. ¿Cómo es la cámara web (webcam)?",
    options: [
      { label: "Giratoria / Rotativa (180°)", value: "giratoria" },
      { label: "Alargada y Horizontal", value: "horizontal" },
      { label: "Fija / Estándar", value: "fija" },
    ],
  },
  {
    key: "manija",
    title: "3. ¿Cuenta con manija de transporte integrada?",
    options: [
      { label: "Manija Plegable (se oculta)", value: "plegable" },
      { label: "Manija Fija (rígida)", value: "fija" },
      { label: "No tiene manija", value: "ninguna" },
    ],
  },
  {
    key: "bateria",
    title: "4. ¿Cómo es la batería del equipo?",
    options: [
      { label: "Extraíble (con trabas externas)", value: "extraible" },
      { label: "Interna (requiere desarme)", value: "interna" },
    ],
  },
];
