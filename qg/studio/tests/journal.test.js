// T57, point 4 : tools/journal_claude.py écrit « agent_id » dans le JSONL (lancement et arrêt)
// sans changer le format du journal .md. Journaux écrits dans un dossier temporaire (JOURNAL_DIRECT_DOSSIER).
"use strict";
const test = require("node:test");
const assert = require("node:assert");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const SCRIPT = path.resolve(__dirname, "..", "..", "..", "tools", "journal_claude.py");
const PYTHON = ["py", "python3", "python"].find(c => spawnSync(c, ["--version"], { encoding: "utf8" }).status === 0);

function hook(dossier, evenement) {
  const r = spawnSync(PYTHON, ["-X", "utf8", SCRIPT], { input: JSON.stringify(evenement), encoding: "utf8", env: { ...process.env, JOURNAL_DIRECT_DOSSIER: dossier, PYTHONIOENCODING: "utf-8" } });
  assert.strictEqual(r.status, 0, r.stderr);
}

test("T57-4 : agent_id écrit au lancement (réponse de l'outil Agent) et à l'arrêt (SubagentStop)", { skip: !PYTHON && "Python introuvable" }, () => {
  const d = fs.mkdtempSync(path.join(os.tmpdir(), "studio-journal-test-"));
  try {
    const transcription = path.join(d, "agent.jsonl");
    fs.writeFileSync(transcription, JSON.stringify({ message: { role: "assistant", content: [{ type: "text", text: "Vidéo rendue." }] } }) + "\n");
    hook(d, { hook_event_name: "PostToolUse", tool_name: "Agent", tool_input: { subagent_type: "studio-video", prompt: "Tâche T60" },
      tool_response: { isAsync: true, status: "async_launched", agentId: "a00b47850a12c1c7c", description: "T60" } });
    hook(d, { hook_event_name: "PostToolUse", tool_name: "Agent", tool_input: { subagent_type: "conformite-qa", prompt: "Audit" },
      tool_response: "Async agent launched successfully.\nagentId: a28435d273daf8838 (internal ID)" });
    hook(d, { hook_event_name: "PostToolUse", agent_id: "a00b47850a12c1c7c", agent_type: "studio-video", tool_name: "Read", tool_input: { file_path: "docs/studio/BRIEF-STUDIO.md" } });
    hook(d, { hook_event_name: "SubagentStop", agent_id: "a00b47850a12c1c7c", agent_type: "studio-video", agent_transcript_path: transcription, transcript_path: "" });
    hook(d, { hook_event_name: "Stop", transcript_path: "" });                       // ancien format : pas d'agent_id

    const lignes = fs.readFileSync(path.join(d, "journal-direct.jsonl"), "utf8").trim().split("\n").map(l => JSON.parse(l));
    assert.deepStrictEqual(lignes.map(l => l.agent_id), ["a00b47850a12c1c7c", "a28435d273daf8838", "a00b47850a12c1c7c", "a00b47850a12c1c7c", ""]);
    assert.deepStrictEqual(lignes.map(l => l.cible), ["studio-video", "conformite-qa", "", "", ""]);
    for (const l of lignes) for (const cle of ["heure", "type", "agent", "outil", "cible", "texte"]) assert.ok(cle in l, `champ ${cle} conservé`);
    assert.strictEqual(lignes[3].texte, "[studio-video] AGENT TERMINÉ · Vidéo rendue.", "le texte d'arrêt vient de la transcription de l'agent");

    const md = fs.readFileSync(path.join(d, "journal-direct.md"), "utf8").trim().split(/\r?\n/);
    assert.match(md[0], /^# Journal en direct/);
    assert.match(md[2], /^- \d\d:\d\d:\d\d · Lance l'agent studio-video : Tâche T60$/);
    assert.match(md[5], /^- \d\d:\d\d:\d\d · \[studio-video\] AGENT TERMINÉ · Vidéo rendue\.$/);
    assert.ok(!md.join("\n").includes("agent_id"), "le journal .md garde son format");
  } finally { fs.rmSync(d, { recursive: true, force: true }); }
});
