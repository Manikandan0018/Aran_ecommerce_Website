import express from "express";
import {
  migrateProducts
} from "../Migration/Migration"

const router = express.Router();


router.get("/migrate-products", migrateProducts);
export default router;




