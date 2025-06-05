**Plan de Implementación para el Recurso "Portfolios"**
Este plan sigue las directrices de `api.rule.md` y las especificaciones de `portfolio.api.yaml`.

La carpeta de trabajo será `c0-express-api/src/app/resources/portfolios/`
Escribiré el código y los datos necesarios en inglés.

1.  **Configuración Inicial del Recurso:**

    - Crear el directorio principal para el nuevo recurso: `src/app/resources/portfolios`.
    - Dentro de `src/app/resources/portfolios/`, crear los siguientes archivos vacíos, siguiendo las convenciones de nombrado:
      - `portfolios.controller.ts`
      - `portfolios.application.ts`
      - `portfolios.service.ts`
      - `portfolios.service.test.ts`
      - `portfolios.repository.interface.ts`
      - `portfolios.in-memory.repository.ts`
      - `portfolio.type.ts` (para la entidad principal `Portfolio`)
      - `asset.type.ts` (para la entidad anidada `Asset`)
      - `transaction.type.ts` (para la entidad `Transaction`)
      - `create-portfolio.dto.ts` (basado en `PortfolioInput` del YAML)
      - `portfolio.response.dto.ts` (basado en `Portfolio` del YAML para respuestas)
      - `create-transaction.dto.ts` (basado en `TransactionInput` del YAML)
      - `transaction.response.dto.ts` (basado en `Transaction` del YAML para respuestas)

2.  **Definición de Tipos y DTOs (Data Transfer Objects):**

    - **`portfolio.type.ts`**: Definir el tipo `Portfolio` basándose en el schema `Portfolio` de `portfolio.api.yaml`. Incluir `id`, `user_id`, `name`, `initial_cash`, `cash`, `lastUpdated` y `assets` (que será un array de tipo `Asset`).
    - **`asset.type.ts`**: Definir el tipo `Asset` basándose en el schema `Asset` de `portfolio.api.yaml`. Incluir `asset_type`, `symbol`, `units`, `average_price` y `lastUpdated`.
    - **`transaction.type.ts`**: Definir el tipo `Transaction` basándose en el schema `Transaction` de `portfolio.api.yaml`. Incluir `id`, `portfolio_id`, `timestamp` y las propiedades de `TransactionInput` (`type`, `asset_type`, `symbol`, `units`, `price_per_unit`).
    - **`create-portfolio.dto.ts`**: Definir `CreatePortfolioDto` basado en `PortfolioInput` del `portfolio.api.yaml` (omitiendo `id`, `cash`, `lastUpdated`, `assets`).
    - **`portfolio.response.dto.ts`**: Definir `PortfolioResponseDto` para las respuestas, probablemente similar o idéntico al tipo `Portfolio`, seleccionando los campos necesarios para la respuesta al cliente.
    - **`create-transaction.dto.ts`**: Definir `CreateTransactionDto` basado en `TransactionInput` del `portfolio.api.yaml`.
    - **`transaction.response.dto.ts`**: Definir `TransactionResponseDto` para las respuestas de transacciones, probablemente similar o idéntico al tipo `Transaction`.

3.  **Capa de Repositorio (`portfolios.repository.interface.ts` y `portfolios.in-memory.repository.ts`):**

    - **`portfolios.repository.interface.ts`**:
      - Definir la interfaz `PortfolioRepository`.
      - Especificar métodos como:
        - `create(data: CreatePortfolioDto): Promise<Portfolio>` (adaptar DTO si el repo espera la entidad completa)
        - `findById(id: string): Promise<Portfolio | undefined>`
        - `findAll(): Promise<Portfolio[]>`
        - `update(id: string, data: Partial<Portfolio>): Promise<Portfolio | undefined>` (para actualizar `cash`, `assets`, `lastUpdated`)
        - `addTransaction(portfolioId: string, transactionData: CreateTransactionDto): Promise<Transaction>` (o el método podría estar en un `TransactionRepository` si se decide separar).
        - `findTransactionsByPortfolioId(portfolioId: string): Promise<Transaction[]>`
    - **`portfolios.in-memory.repository.ts`**:
      - Implementar `PortfolioInMemoryRepository` que cumpla con la interfaz `PortfolioRepository`.
      - Utilizar arrays en memoria para simular el almacenamiento de portfolios y transacciones.

4.  **Capa de Servicio (`portfolios.service.ts`):**

    - Definir `portfolioService`.
    - Implementar la lógica de negocio para las siguientes operaciones, aceptando un objeto `deps` con las dependencias (como `portfolioRepository`, `idUtils`):
      - `createPortfolio(createDto: CreatePortfolioDto, deps)`:
        - Validar `initial_cash`.
        - Crear un nuevo portfolio con `id` generado, `cash` inicializado a `initial_cash`, `assets` vacío, `lastUpdated` actual.
        - Guardar usando `deps.portfolioRepository.create()`.
      - `getPortfolioById(id: string, deps)`:
        - Obtener portfolio usando `deps.portfolioRepository.findById()`.
        - Lanzar error si no se encuentra.
      - `getAllPortfolios(deps)`:
        - Obtener todos los portfolios usando `deps.portfolioRepository.findAll()`.
      - `executeTransaction(portfolioId: string, transactionDto: CreateTransactionDto, deps)`:
        - Obtener el portfolio por `portfolioId`. Lanzar error si no existe.
        - Validar la transacción (e.g., para `buy`, verificar `cash` suficiente; para `sell`, verificar tenencia de `assets`).
        - Actualizar el `cash` del portfolio.
        - Actualizar los `assets` del portfolio (añadir, remover o actualizar unidades y precio promedio).
        - Registrar la transacción (usando `deps.portfolioRepository.addTransaction()` o similar).
        - Actualizar `lastUpdated` del portfolio.
        - Guardar los cambios en el portfolio.
      - `getTransactionsForPortfolio(portfolioId: string, deps)`:
        - Obtener el portfolio. Lanzar error si no existe.
        - Obtener transacciones usando `deps.portfolioRepository.findTransactionsByPortfolioId()`.

5.  **Capa de Aplicación (`portfolios.application.ts`):**

    - Exportar funciones que hagan de puente entre el controlador y el servicio.
    - Cada función construirá el objeto `deps` necesario y llamará al método correspondiente en `portfolioService`.
      - `createPortfolio(createDto: CreatePortfolioDto)`
      - `getPortfolioById(id: string)`
      - `getAllPortfolios()`
      - `executeTransaction(portfolioId: string, transactionDto: CreateTransactionDto)`
      - `getTransactionsForPortfolio(portfolioId: string)`
    - Inyectar `portfolioInMemoryRepository` (o el repositorio real en el futuro) en `deps`.

6.  **Capa de Controlador (`portfolios.controller.ts`):**

    - Crear un `Router` de Express.
    - Definir los siguientes endpoints basados en `portfolio.api.yaml`:
      - `POST /portfolios`:
        - Manejador para `createPortfolioHandler`.
        - Validar `req.body` (DTO `CreatePortfolioDto`).
        - Llamar a `portfoliosApplication.createPortfolio()`.
        - Enviar respuesta 201 con el portfolio creado o error.
      - `GET /portfolios`:
        - Manejador para `getAllPortfoliosHandler`.
        - Llamar a `portfoliosApplication.getAllPortfolios()`.
        - Enviar respuesta 200 con la lista de portfolios o error.
      - `GET /portfolios/:id`:
        - Manejador para `getPortfolioByIdHandler`.
        - Extraer `id` de `req.params`.
        - Llamar a `portfoliosApplication.getPortfolioById()`.
        - Enviar respuesta 200 con el portfolio o 404 si no se encuentra.
      - `POST /portfolios/:id/transactions`:
        - Manejador para `executeTransactionHandler`.
        - Extraer `id` (portfolioId) de `req.params`.
        - Validar `req.body` (DTO `CreateTransactionDto`).
        - Llamar a `portfoliosApplication.executeTransaction()`.
        - Enviar respuesta 201 con la transacción creada o errores (400, 404).
      - `GET /portfolios/:id/transactions`:
        - Manejador para `getPortfolioTransactionsHandler`.
        - Extraer `id` (portfolioId) de `req.params`.
        - Llamar a `portfoliosApplication.getTransactionsForPortfolio()`.
        - Enviar respuesta 200 con la lista de transacciones o error.
    - Utilizar `sendSuccess` y `sendError` para las respuestas.

7.  **Pruebas (`portfolios.service.test.ts`):**

    - Escribir tests unitarios para `portfolio.service.ts`.
    - Mockear las dependencias (`portfolioRepository`, `idUtils`, etc.).
    - Probar casos de éxito y de error para cada método del servicio:
      - Creación de portfolio (éxito, validaciones).
      - Obtención de portfolio (encontrado, no encontrado).
      - Ejecución de transacciones (compra exitosa, venta exitosa, fondos insuficientes, activos insuficientes).
      - Listado de transacciones.

8.  **Consideraciones Adicionales (Shared Utilities):**
    - Identificar si se necesitan nuevas utilidades compartidas (e.g., para cálculos financieros complejos si se añaden en el futuro) o si las existentes (`idUtils`, `hashUtils` si fueran necesarias para `user_id` o similar) son suficientes.
    - Para `lastUpdated`, se puede usar `new Date()`.

Este plan cubre la estructura y los componentes principales necesarios para implementar la API de portfolios siguiendo tus directrices. Cada paso implicaría escribir el código TypeScript correspondiente dentro de los archivos generados.
