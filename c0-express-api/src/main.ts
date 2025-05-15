import { bootstrapApp } from "./app/app.bootstrap.ts";

try {
  bootstrapApp();
} catch (error) {
  console.error(error);
}
