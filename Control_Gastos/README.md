Control de Gastos

En este proyecto se estara realizando una aplicacion web sobre un Control de Gastos personales donde el usuario podra ingresar sus diferentes tipos de ingresos y egresos donde la aplicacion web le dara estadisticas y recomendaciones de que deberia de hacer con cierta cantidad junto que avisara a cada cierto tiempo los pagos que debe de hacer.

Pasos a ejecutar:
Base de datos (PostgreSQL):
   1. Crea o selecciona la base de datos `control_gastos`.
   2. Copia y ejecuta todo el contenido de `database/init.sql` en PostgreSQL.

Backend: 
   1. `npm install`
   2. `npm run dev`

Frontend: 
   1. `npm install`
   2. `ng serve`

Login con Google:
   1. En Google Cloud Console, crea un cliente OAuth 2.0 de tipo Aplicación web.
   2. Abre la aplicación usando exactamente `http://localhost:4200` en el navegador. No uses `127.0.0.1`, `file:///` ni otro puerto.
   3. En "Orígenes autorizados de JavaScript", añade exactamente este origen, sin `/` final:
      - `http://localhost:4200`
      No añadas `/login`, `/api`, una ruta de callback ni `z`.
   4. Copia el Client ID en `frontend/src/environments/environment.ts` como `googleClientId`.
   5. Define el mismo valor en el archivo `.env` del backend como `GOOGLE_CLIENT_ID`.
   6. Reinicia backend y frontend.

Si aparece `The given origin is not allowed for the given client ID`, el Client ID configurado no tiene registrado `http://localhost:4200` en Google Cloud. Ese error ocurre en Google antes de que el backend reciba la credencial.

Las cuentas nuevas que entren con Google se crean siempre con el rol normal (`user`).
El rol administrador se asigna únicamente desde la gestión de usuarios.

Usuario:
   Administrador - admin@email.com contraseña: 123456
   User - user@email.com contraseña: 123456
