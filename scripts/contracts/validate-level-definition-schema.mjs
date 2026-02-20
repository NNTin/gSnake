import { readFileSync } from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import Ajv2020 from "ajv/dist/2020.js";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const repoRoot = path.resolve(__dirname, "../..");

const schemaPath = path.join(repoRoot, "contracts", "level-definition.schema.json");
const fixturesDir = path.join(repoRoot, "contracts", "fixtures");

const fixtureCases = [
  {
    file: "level-definition.valid.json",
    expectedValid: true,
  },
  {
    file: "level-definition.valid-optionals.json",
    expectedValid: true,
  },
  {
    file: "level-definition.invalid-missing-total-food.json",
    expectedValid: false,
  },
  {
    file: "level-definition.invalid-optional-shape.json",
    expectedValid: false,
  },
  {
    file: "level-definition.invalid-empty-snake.json",
    expectedValid: false,
  },
  {
    file: "level-definition.invalid-negative-coordinate.json",
    expectedValid: false,
  },
  {
    file: "level-definition.invalid-difficulty-value.json",
    expectedValid: false,
  },
];

const schema = JSON.parse(readFileSync(schemaPath, "utf8"));
const ajv = new Ajv2020({ allErrors: true, strict: true });
const validate = ajv.compile(schema);

const failures = [];

for (const fixtureCase of fixtureCases) {
  const fixturePath = path.join(fixturesDir, fixtureCase.file);
  const fixture = JSON.parse(readFileSync(fixturePath, "utf8"));

  const actualValid = Boolean(validate(fixture));
  if (actualValid !== fixtureCase.expectedValid) {
    failures.push({
      fixture: fixtureCase.file,
      expectedValid: fixtureCase.expectedValid,
      actualValid,
      errors: validate.errors ?? [],
    });
  }
}

if (failures.length > 0) {
  console.error("LevelDefinition schema fixture validation failed.");
  for (const failure of failures) {
    console.error(`- ${failure.fixture}: expected valid=${failure.expectedValid}, actual valid=${failure.actualValid}`);
    if (failure.errors.length > 0) {
      console.error(`  errors: ${JSON.stringify(failure.errors)}`);
    }
  }
  process.exit(1);
}

console.log(`Validated ${fixtureCases.length} LevelDefinition schema fixture cases successfully.`);
