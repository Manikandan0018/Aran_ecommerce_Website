export const maintenanceMode = (req, res, next) => {
  const isMaintenance = process.env.MAINTENANCE_MODE === "true";

  if (!isMaintenance) return next();

  // Allow admin bypass
  if (req.headers.authorization) return next();

  return res.status(503).json({
    message: "Site under maintenance",
  });
};
