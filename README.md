# PetControl 

Carnet digital de salud para mascotas — Aplicación móvil híbrida desarrollada con Ionic + Angular.

Proyecto de la asignatura **Programación de Aplicaciones Móviles **.
Autor: Andres Barra.

---

## Descripción

PetControl permite centralizar en un solo lugar la ficha de salud de cada mascota: sus datos, vacunas,
enfermedades e historial. Funciona como un carnet digital que el dueño siempre lleva consigo, con
recordatorios, información en línea y respaldo local.

---

##  Tecnologías utilizadas

- Ionic Framework + Angular (app híbrida, NgModules)
- Ionic Storage — persistencia de datos en memoria interna
- HttpClient — consumo de API REST (dog.ceo)
- Angular Route Guards — seguridad de las rutas
- Capacitor Geolocation — plugin de GPS
- Karma + Jasmine — pruebas unitarias
- Cypress — pruebas E2E

---

##  Instalación

Requisitos: Node.js y Ionic CLI (`npm install -g @ionic/cli`).


# 1. Instalar las dependencias
npm install

# 2. Ejecutar la aplicación en el navegador
ionic serve
```

**Usuario de prueba:** `demo@petcontrol.cl` / `123456`

---

##  Ejecución de las pruebas

### Pruebas unitarias (Karma + Jasmine)
```bash
ng test
```
Verifican el servicio de mascotas (crear, listar, agregar, login) y el guard de seguridad.

### Pruebas E2E (Cypress)

# En una terminal, con la app corriendo:
ionic serve

# En otra terminal:
npx cypress open

Simulan a un usuario real: abren la app, verifican el login, la navegación y la protección de rutas.

---

##  Generación del APK y del Bundle


# 1. Compilar la app
ionic build

# 2. Agregar la plataforma Android
ionic cap add android

# 3. Sincronizar
ionic cap sync

# 4. Abrir en Android Studio
ionic cap open android
```

En Android Studio:
- APK sin firmar: `Build → Generate App Bundles or APKs → Generate APKs`
- Bundle (.aab): `Build → Generate App Bundles or APKs → Generate Bundles`

---

  Firma de la aplicación (Keytool)


# 1. Generar la llave (key)
keytool -genkey -v -keystore petcontrol.keystore -alias petcontrol -keyalg RSA -keysize 2048 -validity 10000

# 2. Firmar el APK release (desde Android Studio):
#    Build → Generate Signed App Bundle or APK → APK → seleccionar la keystore → release → Create
```

El resultado es `app-release.apk`, el APK firmado y listo para publicar.

---

##  Ficha de Play Store

El proyecto incluye el formulario de publicación (Ficha de Play Store) con los datos y validaciones
requeridos: nombre, descripciones, ícono, capturas, categoría, correo de contacto, política de
privacidad y clasificación de contenido.

---

##  Estructura del proyecto