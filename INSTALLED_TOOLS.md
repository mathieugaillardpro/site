# Outils Claude Code installés sur le projet

Installés le 29/09/2026, tous au niveau du projet (`~/site`).
Config : `.claude/settings.json` (plugins + hooks) et `.mcp.json` (serveurs MCP).
Ces fichiers renvoient une 404 en ligne grâce aux règles ajoutées dans `.htaccess`.

## Prérequis Windows (à faire une fois)

```powershell
# uv (nécessaire pour GSC MCP et geo optimizer)
powershell -ExecutionPolicy ByPass -c "irm https://astral.sh/uv/install.ps1 | iex"
# graphify (nécessaire, sinon ses hooks échouent)
uv tool install graphifyy
# vérifications
uvx --version
graphify --version
```

Au premier lancement de `claude` dans `~/site`, accepter les marketplaces, les plugins et les serveurs MCP du projet. Vérifier avec `/plugin` et `/mcp`.

---

## 1. ponytail (plugin)
Source : https://github.com/DietrichGebert/ponytail (v4.10.0)
Rôle : force Claude à écrire le code le plus simple possible. Actif automatiquement.

| Commande | Usage |
|---|---|
| `/ponytail-audit` | Liste le code inutile ou trop complexe dans le site (JS, CSS) |
| `/ponytail-review` | Relit les modifications en cours avant un commit |
| `/ponytail-help` | Aide et niveaux (lite, full) |

## 2. graphify (skill + CLI + hooks)
Source : https://github.com/Graphify-Labs/graphify (PyPI : `graphifyy`)
Rôle : graphe de connaissances du site pour que Claude comprenne sa structure.

| Commande | Usage |
|---|---|
| `/graphify .` | Construit le graphe complet (dans Claude Code) |
| `graphify update .` | Met à jour après modification (terminal, gratuit) |
| `graphify query "quelles pages parlent de mariage ?"` | Question sur le site |
| `graphify path "index.html" "contact.html"` | Liens entre deux pages |
| Ouvrir `graphify-out/graph.html` | Visualisation interactive |

Désinstaller : `graphify claude uninstall`

## 3. agent skills (2 plugins)
- `agent-skills@addy-agent-skills` : https://github.com/addyosmani/agent-skills
- `example-skills@anthropic-agent-skills` : https://github.com/anthropics/skills

| Commande | Usage |
|---|---|
| `/webperf` | Audit performance (Core Web Vitals, poids des images et vidéos) |
| `/review` | Revue qualité d'une modification |
| `/spec` puis `/plan` | Cadrer une nouvelle page avant de la coder |
| `/ship` | Checklist avant mise en ligne |
| « utilise le skill frontend-design pour refaire la section X » | Design front (Anthropic) |

## 4. GSC MCP (serveur MCP `gsc`)
Source : https://github.com/AminForou/mcp-gsc (PyPI `mcp-search-console` 0.4.1)
Identifiant OAuth : `C:\Users\matga\.config\mcp-gsc\client_secrets.json` (jamais dans le site).
Suppression de site ou de sitemap désactivée (`GSC_ALLOW_DESTRUCTIVE=false`).

Exemples de demandes dans Claude Code :
- « Liste mes propriétés Search Console »
- « Top 20 requêtes des 28 derniers jours pour mathieugaillardpro.fr, avec position et CTR »
- « Quelles requêtes locales (Montpellier, Sète, Hérault) ont des impressions mais un CTR sous 2 % ? »
- « Inspecte l'indexation de toutes les URL du sitemap »
- « Compare les 3 derniers mois aux 3 précédents, page par page »
- « Soumets le sitemap https://mathieugaillardpro.fr/sitemap.xml »

Reconnexion Google : demander « reauthenticate » à Claude.

## 5. geo optimizer (serveur MCP `geo-optimizer` + CLI)
Source : https://github.com/Auriti-Labs/geo-optimizer-skill (v4.18.3, épinglé avec `mcp<2` pour éviter un bug du SDK MCP 2.0)

Terminal :
```powershell
uvx --from geo-optimizer-skill==4.18.3 geo audit --url https://mathieugaillardpro.fr
uvx --from geo-optimizer-skill==4.18.3 geo audit --sitemap https://mathieugaillardpro.fr/sitemap.xml --format html --output geo-report.html
uvx --from geo-optimizer-skill==4.18.3 geo llms --help
uvx --from geo-optimizer-skill==4.18.3 geo schema --help
```

Dans Claude Code :
- « Lance geo_audit sur mathieugaillardpro.fr et classe les correctifs par impact »
- « Vérifie avec geo_check_bots que GPTBot, PerplexityBot, ClaudeBot et Google-Extended peuvent crawler le site »
- « Propose un schema JSON-LD LocalBusiness + Person pour la page d'accueil et valide-le avec geo_schema_validate »

Conseil : prioriser robots.txt, schema JSON-LD et contenu. `/ai/summary.json` et `ai.txt` ne sont pas des standards reconnus. Toujours relire les fichiers générés par `geo fix` avant de les publier.

## 6. claude-code-setup (plugin officiel Anthropic)
Source : https://github.com/anthropics/claude-plugins-official
Lecture seule. Demander : « recommande des automatisations Claude Code pour ce projet ».

## 7. task observer (plugin)
Source : https://github.com/rebelytics/one-skill-to-rule-them-all (v3.4.0)
Se déclenche seul en début de session. Journal dans `~/.claude/projects/<projet>/skill-observations/`.
Demander : « montre-moi le journal d'observations » ou « fais la revue hebdo des observations ».

---

## Outils ignorés
- **omniroute** : proxy qui réutilise le login de l'abonnement Claude (risque de suspension du compte), historique de CVE, aucun gain SEO.
- **openseo** : sérieux mais payant (10 $/mois ou clé DataForSEO). À reconsidérer pour la recherche de mots-clés.
- **claudemem** : claude-mem trop lourd (service permanent, consomme des tokens, jeton crypto associé) ; mnemex peu adopté et nécessite une clé OpenRouter. La mémoire native de Claude Code suffit.
- **headroom** : proxy sur tout le trafic Claude, télémétrie par défaut, gain faible sur un petit projet.

## Désinstaller un plugin
`/plugin` > onglet Installed > désactiver, ou retirer la ligne dans `enabledPlugins` de `.claude/settings.json`.
Pour un serveur MCP : retirer son bloc dans `.mcp.json`.

## Dépannage Windows

**Plugin en échec « Host key verification failed »** (agent-skills, task-observer, et leurs mises à jour) : ces plugins se téléchargent via SSH. Dans PowerShell, forcer HTTPS pour la session puis relancer l'installation ou la mise à jour :
```powershell
$env:GIT_CONFIG_COUNT=3; $env:GIT_CONFIG_KEY_0="url.https://github.com/.insteadOf"; $env:GIT_CONFIG_VALUE_0="git@github.com:"; $env:GIT_CONFIG_KEY_1="url.https://github.com/.insteadOf"; $env:GIT_CONFIG_VALUE_1="ssh://git@github.com/"; $env:GIT_CONFIG_KEY_2="core.symlinks"; $env:GIT_CONFIG_VALUE_2="false"
claude plugin install agent-skills@addy-agent-skills --scope project
claude plugin install task-observer@one-skill-to-rule-them-all --scope project
```

**Identifiant Google** : `C:\Users\matga\.config\mcp-gsc\client_secrets.json` (vérifier avec `Test-Path`).
