import { execSync } from "child_process";
import { join } from "path";
import { existsSync, mkdirSync } from "fs";

// Define paths
const specsDir = join(__dirname, "../specs");
const outputDir = join(__dirname, "../api");

// Ensure the output directory exists
if (!existsSync(outputDir)) {
  mkdirSync(outputDir, { recursive: true });
}

// Generate TypeScript types
const specFiles = ["v1.json"];

specFiles.forEach((spec) => {
  const inputPath = join(specsDir, spec);
  const outputPath = join(outputDir, spec.replace(".json", ".d.ts"));

  console.log(`Generating types for ${spec}...`);
  execSync(`npx openapi-typescript ${inputPath} -o ${outputPath}`, {
    stdio: "inherit",
  });
});

console.log("OpenAPI types generated successfully.");
