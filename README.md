# Manual de Implementación - Sistema de Agendamiento de Atención a Proveedores

## Descripción del Proyecto

Sistema frontend desarrollado en **Angular 20** para la gestión de agendamiento de atención a proveedores. Incluye módulos de administración de proveedores, productos, jaulas de recepción, reserva de turnos y ejecución de recepción.

## Prerrequisitos

Asegúrese de tener instalado:
- **Node.js** (versión 20 o superior)

## Pasos para el Despliegue

### 1. Clonar el repositorio
```bash
git clone https://github.com/juanacevedo68061/agenda.git
cd agenda
```
### 2. Actualizar npm
```bash
npm install -g npm@11.5.2 
```

### 3. Instalar dependencias locales
```bash
npm install
npm install -g @angular/cli
npm install -g json-server
```

### 4. Iniciar JSON Server
```bash
npm run json-server
```
Configurado para el puerto 3000

### 5. Iniciar la aplicación Angular (a la par de JSON Server)
```bash
ng serve
```
La aplicación estará disponible en: http://localhost:4200
