// Any other /api/* address: answer with a JSON 404 instead of falling through to the web page.
import { json } from "../../lib/counter.js";

export const onRequest = () => json({ error: "not found" }, 404);
