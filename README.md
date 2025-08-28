# Flag Guessing Game

## Arquitectura Refactorizada

### Estructura del Proyecto

```
flags/
├── src/
│   ├── models/
│   │   ├── Country.js          # Modelo de datos de país
│   │   └── GameState.js        # Estado del juego
│   ├── services/
│   │   ├── CountryService.js   # Servicio de datos de países
│   │   └── GameService.js      # Lógica del juego
│   ├── views/
│   │   └── GameView.js         # Manipulación del DOM
│   ├── controllers/
│   │   └── GameController.js   # Controlador principal
│   ├── utils/                  # Utilidades
│   └── main.js                 # Punto de entrada
├── assets/
│   ├── data/
│   │   └── flags.json          # Datos de países
│   └── styles/
│       └── styles.css          # Estilos CSS
├── bk/
│   ├── code/
│   │   └── script-legacy.js    # Código original (respaldo)
│   └── refactor/               # Documentación de refactoring
├── index.html                  # Página principal
└── README.md                   # Documentación
```

### Patrones Implementados

- **MVC (Model-View-Controller)**: Separación clara de responsabilidades
- **Service Layer**: Servicios para lógica de negocio
- **ES6 Modules**: Modularización del código
- **Dependency Injection**: Inyección de dependencias entre clases

### Mejoras Implementadas

1. **Nombres Descriptivos**: Variables y métodos con nombres claros
2. **Separación de Responsabilidades**: Cada clase tiene una función específica
3. **Encapsulación**: Datos y métodos organizados en clases
4. **Mantenibilidad**: Código más fácil de mantener y extender
5. **Testabilidad**: Estructura que facilita las pruebas unitarias

## Instalación y Uso

1. Clonar el repositorio
2. Abrir `index.html` en un navegador moderno que soporte ES6 modules
3. ¡Comenzar a jugar!

## Características

- Juego de adivinanza de banderas interactivo
- Interfaz responsive
- Arquitectura modular MVC
- Código ES6+ moderno

## Tecnologías

- HTML5
- CSS3
- JavaScript ES6+
- Módulos ES6