import fs from "fs";
import path from "path";

const ABI_DIR = path.join(__dirname, "../abis");

function generateTypedAbi(abiPath: string) {
  const fileName = path.basename(abiPath, ".abi.json");
  const outputPath = path.join(ABI_DIR, `${fileName}.abi.ts`);

  // Read the ABI JSON
  const abiContent = fs.readFileSync(abiPath, "utf-8");
  const abi = JSON.parse(abiContent);

  // Generate TypeScript content
  const tsContent = `export const ${fileName} = ${JSON.stringify(abi, null, 2)} as const;

// Export the type
export type ${fileName}Type = typeof ${fileName};
`;

  // Write the TypeScript file
  fs.writeFileSync(outputPath, tsContent);
  console.log(`Generated ${outputPath}`);
}

// Get all .json files in the ABI directory
const abiFiles = fs
  .readdirSync(ABI_DIR)
  .filter((file) => file.endsWith(".abi.json"));

// Process each ABI file
abiFiles.forEach((file) => {
  generateTypedAbi(path.join(ABI_DIR, file));
});
