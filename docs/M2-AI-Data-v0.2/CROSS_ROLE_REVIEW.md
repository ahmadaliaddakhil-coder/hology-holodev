# Cross-role Alignment Review

## Dengan Full-stack

| Kebutuhan Full-stack | Output AI/Data | Status |
|---|---|---|
| canonical input/output | BMKG canonical example + reasoning I/O schema | Ready for review |
| BMKG field mapping | BMKG dictionary + canonical mapping | Ready for adapter review |
| Field Pulse enums | Field Pulse contract | Ready for joint lock |
| reasoning/failure semantics | baseline, ruleset, reference engine | Executable |
| action option IDs | JSON + documentation | Stable draft |
| fixtures/expected output | T1–T8 + separate expected results | Tests pass |
| cache/freshness | freshness policy | Needs implementation review |
| Land/Crop/Case | HOL-86 reconciliation proposal | Needs ERD review |

## Dengan PM / Tech Lead / UI-UX

| Kebutuhan PM/UX | Output AI/Data | Status |
|---|---|---|
| input user sederhana | label → enum Field Pulse mapping | Ready for copy validation |
| Ringkasan Kondisi | factor/missing/limitation codes | Ready for template mapping |
| human control | alternatives-only + null recommendation | Locked safety boundary |
| mock/live clarity | provenance + `is_mock` + delivery mode | Ready for component state |
| Decision Brief | structured explanation contract | Needs PM template review |

## Gate yang sengaja masih terbuka

Paket ini lengkap sebagai **AI/Data proposal dan reference implementation**,
tetapi belum boleh disebut contract final lintas sistem sebelum:

1. Full-stack mengonfirmasi adapter projection, persistence, cache, dan ERD;
2. PM/UX mengonfirmasi label/copy serta Decision Brief template;
3. hasil review dicatat dan breaking changes diselesaikan.

AI/Data tidak mengambil alih implementation task, product decision, atau final
UI copy milik role lain.
