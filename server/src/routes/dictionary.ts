import { Router } from "express";
import en from "dictionary-en";
import nspell from "nspell";

const router = Router();

const spell = nspell(en);

router.get("/word/:word", (req, res) => {
  const word = req.params.word?.trim().toLowerCase();

  if (!word || !/^[a-z]+$/.test(word)) {
    res.status(400).json({
      valid: false,
      error: "A word containing only letters is required.",
    });
    return;
  }

  res.json({
    valid: spell.correct(word),
  });
});

export default router;
