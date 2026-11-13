"""Journal en direct de Claude Code, pour que Cowork suive ce qu'il fait.

Appelé par les hooks de Claude Code (.claude/settings.json). Lit l'événement
sur l'entrée standard et ajoute une ligne dans coordination/journal-direct.md.
Ces fichiers ne sont pas commités (voir .gitignore) : Cowork et le tableau du studio les lisent sur le PC.
Aucune donnée secrète n'est écrite : les contenus longs sont coupés.

Champ « agent_id » du JSONL : identifiant de l'agent concerné. Au lancement (outil Agent),
c'est l'agent lancé (lu dans la réponse de l'outil) ; à l'arrêt (SubagentStop), l'agent qui
s'arrête ; sinon, l'agent qui agit. Vide quand Claude Code ne le donne pas.
Variable facultative JOURNAL_DIRECT_DOSSIER : dossier où écrire les deux journaux (tests).
"""
import json
import os
import re
import sys
from datetime import datetime

RACINE = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DOSSIER = os.environ.get("JOURNAL_DIRECT_DOSSIER") or os.path.join(RACINE, "coordination")
JOURNAL = os.path.join(DOSSIER, "journal-direct.md")
JSONL = os.path.join(DOSSIER, "journal-direct.jsonl")  # lu par le tableau du studio
MAX_LIGNES = 2000


def court(texte, n=220):
    texte = " ".join(str(texte).split())
    return texte if len(texte) <= n else texte[: n - 1] + "…"


def dernier_message(chemin):
    """Dernier texte écrit par Claude dans la transcription de la session."""
    try:
        with open(chemin, encoding="utf-8") as f:
            lignes = f.readlines()[-200:]
    except OSError:
        return ""
    for ligne in reversed(lignes):
        try:
            e = json.loads(ligne)
        except ValueError:
            continue
        msg = e.get("message") or {}
        if msg.get("role") != "assistant":
            continue
        contenu = msg.get("content")
        if isinstance(contenu, str):
            return contenu
        for bloc in contenu or []:
            if isinstance(bloc, dict) and bloc.get("type") == "text" and bloc.get("text", "").strip():
                return bloc["text"]
    return ""


def id_agent_lance(reponse):
    """Identifiant de l'agent lancé, lu dans la réponse de l'outil Agent (« agentId »)."""
    if isinstance(reponse, dict):
        for cle in ("agentId", "agent_id", "agentID"):
            if reponse.get(cle):
                return str(reponse[cle])
    texte = reponse if isinstance(reponse, str) else json.dumps(reponse, ensure_ascii=False, default=str)
    m = re.search(r"agent_?[iI][dD]\W{1,4}([A-Za-z0-9_-]{4,64})", texte or "")
    return m.group(1) if m else ""


def resume_outil(nom, entree):
    entree = entree or {}
    if nom in ("Read", "Write", "Edit"):
        return f"{nom} {entree.get('file_path', '')}"
    if nom == "Bash":
        return f"Bash : {court(entree.get('command', ''), 160)}"
    if nom in ("Task", "Agent"):
        agent = entree.get("subagent_type") or entree.get("description", "")
        return f"Lance l'agent {agent} : {court(entree.get('prompt', ''), 140)}"
    if nom in ("Glob", "Grep"):
        return f"{nom} {court(entree.get('pattern', ''), 80)}"
    if nom in ("WebSearch", "WebFetch"):
        return f"{nom} {court(entree.get('query') or entree.get('url', ''), 120)}"
    return nom


def main():
    try:
        ev = json.load(sys.stdin)
    except ValueError:
        return
    nom_ev = ev.get("hook_event_name", "")
    heure = datetime.now().strftime("%H:%M:%S")
    if nom_ev == "UserPromptSubmit":
        ligne = f"- {heure} · DEMANDE · {court(ev.get('prompt', ''), 400)}"
    elif nom_ev == "PostToolUse":
        ligne = f"- {heure} · {resume_outil(ev.get('tool_name', ''), ev.get('tool_input'))}"
    elif nom_ev in ("Stop", "SubagentStop"):
        qui = "AGENT TERMINÉ" if nom_ev == "SubagentStop" else "CLAUDE CODE A RÉPONDU"
        # Pour un agent, sa propre transcription (agent_transcript_path) ; sinon celle de la session.
        chemin = (ev.get("agent_transcript_path") if nom_ev == "SubagentStop" else "") or ev.get("transcript_path", "")
        ligne = f"- {heure} · {qui} · {court(dernier_message(chemin), 600)}"
    elif nom_ev == "Notification":
        ligne = f"- {heure} · ATTEND L'HUMAIN · {court(ev.get('message', ''), 300)}"
    else:
        return

    # Qui agit : l'agent (sous-agent) si Claude Code le précise, sinon la session principale.
    qui = ev.get("agent_type") or ev.get("subagent_type") or ""
    agent_id = str(ev.get("agent_id") or "")
    if nom_ev == "PostToolUse" and ev.get("tool_name") in ("Task", "Agent"):
        cible = (ev.get("tool_input") or {}).get("subagent_type", "")
        agent_id = id_agent_lance(ev.get("tool_response"))
    else:
        cible = ""
    if qui:
        ligne = ligne.replace(" · ", f" · [{qui}] ", 1)
    evenement = {"heure": heure, "type": nom_ev, "agent": qui, "outil": ev.get("tool_name", ""),
                 "cible": cible, "agent_id": agent_id, "texte": ligne.split(" · ", 1)[-1]}
    os.makedirs(os.path.dirname(JSONL), exist_ok=True)
    try:
        with open(JSONL, "a", encoding="utf-8") as f:
            f.write(json.dumps(evenement, ensure_ascii=False) + "\n")
    except OSError:
        pass

    os.makedirs(os.path.dirname(JOURNAL), exist_ok=True)
    try:
        with open(JOURNAL, encoding="utf-8") as f:
            anciennes = f.read().splitlines()
    except OSError:
        anciennes = ["# Journal en direct de Claude Code (non commité, lu par Cowork)", ""]
    anciennes.append(ligne)
    if len(anciennes) > MAX_LIGNES:
        anciennes = anciennes[:2] + anciennes[-(MAX_LIGNES - 2):]
    with open(JOURNAL, "w", encoding="utf-8") as f:
        f.write("\n".join(anciennes) + "\n")


if __name__ == "__main__":
    try:
        main()
    except Exception:
        pass  # le journal ne doit jamais bloquer Claude Code
