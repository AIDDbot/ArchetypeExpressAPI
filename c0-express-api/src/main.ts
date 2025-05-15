import { bootstrap } from "./app/app.bootstrap.ts";

try {
  bootstrap();
} catch (error) {
  console.error(error);
}
