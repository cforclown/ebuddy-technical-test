import * as dotenv from "dotenv";
import app from "./core/app";

dotenv.config();

const PORT = process.env.BE_PORT || 3001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
