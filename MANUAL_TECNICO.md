# Manual Técnico — SapiensADS AI

Generador de anuncios publicitarios (banner + copy + spot de video) con IA.
El usuario escribe una idea de negocio y la app devuelve 9 variaciones de anuncio
(3 estrategias × 3 formatos) y, opcionalmente, un spot de video de 8 segundos.

---

## 1. Arquitectura

```
Navegador (React + Vite)
        │  HTTPS / JSON + multipart
        ▼
Backend (Node + Express)  ──►  MongoDB Atlas   (usuarios, créditos)
        ├──►  Gemini 2.5 Flash            (copy publicitario, guion de video)
        ├──►  Gemini 3.1 Flash Image      (imagen del anuncio, "Nano Banana 2")
        ├──►  fal.ai Veo 3.1 Lite         (video image-to-video, 8s)
        └──►  Resend                      (magic link + bienvenida)
        ▲
        │  webhook
   Hotmart (pagos)
```

Autenticación **sin contraseña**: magic link por correo → JWT de 7 días guardado en
`localStorage`. Monetización por **créditos**, activados desde webhooks de Hotmart.

---

## 2. Stack

| Capa       | Tecnología |
|------------|------------|
| Frontend   | React 19, Vite 8, React Router 7, Tailwind 4, Axios |
| Backend    | Node ≥22, Express 5 (CommonJS), Mongoose 9, Multer, JWT |
| IA         | `@google/generative-ai`, `@fal-ai/client` |
| Infra      | Vercel (frontend, SPA rewrites), MongoDB Atlas, Resend, Hotmart |

---

## 3. Estructura

```
SapiensADS/
├── adgen-backend/
│   ├── server.js              arranque, CORS, validación de env obligatorias
│   ├── config/db.js           conexión Mongo (fuerza DNS IPv4 + Google DNS)
│   ├── middleware/auth.js     valida JWT → req.user, bloquea cuentas inactivas
│   ├── models/                User.js, Ad.js
│   ├── routes/                generate.js, auth.js, hotmart.js
│   └── services/              geminiService, ideogramService, videoService, emailService
└── adgen-frontend/
    └── src/
        ├── main.jsx           router + splash screen
        ├── App.jsx            landing + generador
        ├── pages/             LoginPage, RegisterPage, AuthCallbackPage
        ├── components/        selectores, ResultCard, PricingModal, HistoryPanel…
        ├── hooks/             useAdGenerator (estado central), useAuth, useToast
        ├── services/          api.js (axios + interceptores), authService.js
        └── utils/             errorHandler.js (mapea status HTTP → mensaje/acción)
```

---

## 4. API

Base: `VITE_API_URL` (local: `http://localhost:3001`). 🔒 = requiere `Authorization: Bearer <jwt>`.

| Método | Ruta | Descripción |
|---|---|---|
| POST | `/api/auth/register` | Alta gratuita (3 créditos), envía bienvenida + magic link |
| POST | `/api/auth/magic-link` | Reenvía enlace de acceso (token válido 15 min) |
| GET  | `/api/auth/verify?token=` | Canjea el token y redirige a `APP_URL/auth/callback?token=<jwt>` |
| GET  | `/api/auth/me` 🔒 | Perfil: id, nombre, email, plan, créditos |
| POST | `/api/auth/dev-login` | Solo local, requiere `ENABLE_DEV_LOGIN=true`; devuelve 404 si no |
| POST | `/api/generate` 🔒 | 1 anuncio (multipart: `idea`, `format`, `strategy`, `language`, `visualStyle`, `logo?`) |
| POST | `/api/generate-variations` 🔒 | 9 variaciones — **es el que usa el frontend** |
| POST | `/api/generate-video` 🔒 | Spot de 8s a partir de la imagen generada (JSON con `imageBase64`) |
| POST | `/api/hotmart/webhook` | Alta/baja/renovación de planes. Valida cabecera `x-hotmart-hottok` |
| GET  | `/health` | `{ status: 'ok' }` |

Cada generación exitosa descuenta **1 crédito** y devuelve `creditsRemaining`.
Sin créditos → `403`, que el frontend traduce en la apertura del modal de precios.

---

## 5. Modelo de datos

**User** — `name`, `email` (único), `plan` (`free`/`pro`/`business`), `credits`,
`isActive`, `source` (`hotmart`/`manual`), `hotmartSubscriptionId`, `creditsResetAt`,
`magicToken` + `magicTokenExpires`.
Método `generateMagicToken()`: 32 bytes aleatorios con 15 min de vigencia.

**Ad** — esquema de anuncio definido pero **no utilizado**: hoy nada se persiste en la
base; el historial vive solo en memoria del frontend y se pierde al recargar.

Créditos por plan: `free` 3 (al registrarse) · `pro` 30 · `business` 100 (renovación a 30 días).

---

## 6. Flujos clave

**Acceso.** Registro o login → correo con enlace → `GET /api/auth/verify` limpia el token,
firma un JWT de 7 días y redirige a `/auth/callback`, que lo guarda en `localStorage`
(`sapiensads_token`, `sapiensads_user`). El interceptor de `api.js` adjunta el Bearer en cada
llamada y, ante un `401`, limpia la sesión y manda a `/login`.

**Generación de anuncios** (`generateAdVariations`):
1. Gemini 2.5 Flash genera copy en JSON para las 9 combinaciones **en paralelo**
   (estrategias `impact` / `solution` / `emotion` × formatos square, story, post).
2. `buildImagePrompt()` compone el prompt de imagen según el estilo visual elegido
   (`bold_product`, `lifestyle_clean`, `minimalist_studio`, `gradient_vivid`, `cinematic_dark`).
3. Gemini 3.1 Flash Image genera cada banner (hasta **3 reintentos** si responde texto en vez
   de imagen) y devuelve un data URI base64. Si se subió logo, va como parte inline del prompt.
4. Se usa `Promise.allSettled`: las variaciones fallidas se descartan y solo se falla la
   petición completa si **ninguna** salió.

**Spot de video** (`/api/generate-video`): Gemini redacta el guion (respeta el guion propio del
usuario si lo escribe) → la imagen se sube a `fal.storage` → Veo 3.1 Lite genera 8s a 720p,
`9:16` para story y `16:9` en el resto, con audio salvo `audioType: 'none'`.

**Hotmart.** `PURCHASE_COMPLETE`/`APPROVED` crea o actualiza el usuario, lo activa y le asigna
créditos; `CANCELED`/`REFUNDED`/`SUBSCRIPTION_CANCELLATION` ponen `isActive: false`;
`PURCHASE_RENEWED` recarga créditos. El plan se deduce del nombre del producto.

---

## 7. Variables de entorno

**Backend** (`adgen-backend/.env`) — el servidor **no arranca** si falta alguna de las obligatorias:

| Variable | Obligatoria | Uso |
|---|---|---|
| `MONGODB_URI` | sí | Conexión a Atlas |
| `JWT_SECRET` | sí | Firma de sesiones |
| `GEMINI_API_KEY` | sí | Copy e imágenes |
| `FAL_KEY` | sí | Video Veo 3.1 |
| `RESEND_API_KEY` | sí | Correos |
| `APP_URL` | sí | Origen permitido en CORS + destino del callback |
| `API_URL` | sí | Se inserta en el enlace del magic link |
| `HOTMART_WEBHOOK_TOKEN` | sí | Valida `x-hotmart-hottok` |
| `PORT` | no | Por defecto `3001` |
| `EMAIL_FROM` | no | Sin ella se usa `onboarding@resend.dev`, que **solo entrega correos a la cuenta dueña de Resend** |
| `ENABLE_DEV_LOGIN` | no | Nunca en producción: da sesión con solo el email |

**Frontend** (`adgen-frontend/.env`): `VITE_API_URL`, `VITE_HOTMART_PRO_URL`,
`VITE_HOTMART_BUSINESS_URL`.

---

## 8. Ejecución local

```bash
# Backend  → http://localhost:3001
cd SapiensADS/adgen-backend
npm install
npm start

# Frontend → http://localhost:5173
cd SapiensADS/adgen-frontend
npm install
npm run dev        # npm run build / npm run preview / npm run lint
```

Requiere Node ≥ 22 y un `.env` en cada carpeta. `APP_URL` debe coincidir con el origen del
frontend o CORS bloqueará las peticiones.

**Despliegue.** Frontend en Vercel (`vercel.json` reescribe todo a `index.html` para el
routing SPA). Backend en cualquier host Node con las variables cargadas, `NODE_ENV=production`
y la URL del webhook registrada en el panel de Hotmart.

---

## 9. Puntos de atención

- **Nada se persiste**: los anuncios generados no se guardan (`models/Ad.js` está sin usar) y
  el historial es solo estado de React.
- **Imágenes en base64** viajan dentro del JSON; por eso el límite de body es de 50 MB. Migrar
  a almacenamiento de objetos aliviaría memoria y ancho de banda.
- **`/api/generate`** (anuncio individual) sigue expuesto pero el frontend ya no lo llama.
- **`JSON.parse` sin try/catch** sobre `req.body.format` en `/api/generate` y sobre la
  respuesta del modelo en `geminiService`: un payload o una respuesta malformada devuelve 500.
- **El crédito se descuenta después** de la llamada a la IA, así que un fallo del proveedor no
  cobra al usuario — pero tampoco hay reintento ni reembolso parcial.
- **Sin rate limiting** en `/api/auth/magic-link`: es la ruta más expuesta a abuso.
