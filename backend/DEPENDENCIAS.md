Inicializar el proyecto y dependencias

Este bloque instala Express, Prisma y las herramientas de seguridad que necesitas (JWT y Bcrypt).
Bash

# Inicializar el package.json

`npm init -y`

# Instalar Express y utilidades básicas

`npm install express cors dotenv`

# Instalar seguridad (JWT y encriptación)

`npm install jsonwebtoken bcryptjs`

# Instalar Prisma como dependencia de desarrollo

`npm install -D prisma`

# Instalar el Cliente de Prisma (para hacer consultas)

`npm install @prisma/client`

2. Inicializar Prisma

Este comando crea la carpeta /prisma y el archivo .env donde configurarás la conexión a tu base de datos.
Bash

`npx prisma init`
