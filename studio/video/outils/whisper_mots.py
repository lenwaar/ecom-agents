"""Temps de chaque mot avec faster-whisper (local, modèle large-v3, licence MIT vérifiée en T49).

  py outils/whisper_mots.py <voix.wav> <sortie.json>
"""
import json, os, sys
os.environ.setdefault("HF_HOME", os.path.abspath(".cache/hf"))
os.environ.setdefault("HF_HUB_DISABLE_TELEMETRY", "1")
from faster_whisper import WhisperModel
m = WhisperModel("large-v3", device="cpu", compute_type="int8")
segs, info = m.transcribe(sys.argv[1], language="fr", word_timestamps=True, vad_filter=False, beam_size=5,
    initial_prompt="De la planche à l'objet. Rouage et Laiton.")
mots = []
for s in segs:
    for w in s.words:
        mots.append({"mot": w.word.strip(), "debut": round(w.start, 3), "fin": round(w.end, 3), "proba": round(w.probability, 3)})
json.dump(mots, open(sys.argv[2], "w", encoding="utf-8"), ensure_ascii=False, indent=1)
print(len(mots), "mots")
for w in mots: print(w)
