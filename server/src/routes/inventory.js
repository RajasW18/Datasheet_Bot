import { Router } from "express";

const router = Router();

/**
 * POST /api/inventory/search
 * Search for component availability and pricing.
 * Phase 4 — Currently returns a placeholder.
 */
router.post("/search", async (req, res) => {
  const { partNumber, description } = req.body;

  if (!partNumber && !description) {
    return res.status(400).json({
      error: "No search query",
      message: "Please provide a part number or description.",
    });
  }

  // Phase 4: Will integrate with DigiKey/Mouser/Octopart APIs
  res.json({
    query: partNumber || description,
    results: [],
    message:
      "🔧 Inventory lookup will be available in Phase 4. For now, you can search manually at digikey.com or mouser.com.",
    links: {
      digikey: `https://www.digikey.com/en/products/result?keywords=${encodeURIComponent(partNumber || description)}`,
      mouser: `https://www.mouser.com/Search/Refine?Keyword=${encodeURIComponent(partNumber || description)}`,
    },
  });
});

export default router;
