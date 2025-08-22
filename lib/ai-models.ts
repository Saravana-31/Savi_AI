// import { spawn } from "child_process"
// import path from "path"

// export interface ModelConfig {
//   name: string
//   path: string
//   type: "llama" | "onnx" | "transformers"
//   maxTokens: number
//   temperature: number
// }

// export class AIModelManager {
//   private static models: Map<string, ModelConfig> = new Map([
//     [
//       "mistral-7b",
//       {
//         name: "Mistral 7B Instruct",
//         path: "./models/mistral-7b-instruct-v0.1.Q4_K_S.gguf",
//         type: "llama",
//         maxTokens: 2048,
//         temperature: 0.7,
//       },    
//     ],
//     [
//       "codellama",
//       {
//         name: "CodeLlama",
//         path: "./models/codellama-7b-instruct.Q4_K_M.gguf",
//         type: "llama",
//         maxTokens: 4096,
//         temperature: 0.3,
//       },
//     ],
//   ])

//   static async generateText(modelName: string, prompt: string): Promise<string> {
//     const model = this.models.get(modelName)
//     if (!model) {
//       throw new Error(`Model ${modelName} not found`)
//     }

//     try {
//       switch (model.type) {
//         case "llama":
//           return await this.runLlamaModel(model, prompt)
//         case "onnx":
//           return await this.runOnnxModel(model, prompt)
//         default:
//           throw new Error(`Unsupported model type: ${model.type}`)
//       }
//     } catch (error) {
//       console.error(`Error running model ${modelName}:`, error)
//       throw error
//     }
//   }

//   private static async runLlamaModel(model: ModelConfig, prompt: string): Promise<string> {
//     return new Promise((resolve, reject) => {
//       const llamaPath = path.join(process.cwd(), "bin", "llama-cpp.exe")

   
//     const args = [
//   "--temp",
//   model.temperature.toString(),
//   "--ngl",
//   "0",
//   model.path,
//   prompt,
// ]

//       const llamaProcess = spawn(llamaPath, args)
//       let output = ""
//       let error = ""

//       llamaProcess.stdout.on("data", (data) => {
//         output += data.toString()
//       })

//       llamaProcess.stderr.on("data", (data) => {
//         error += data.toString()
//       })

//       llamaProcess.on("close", (code) => {
//         if (code === 0) {
//           resolve(output.trim())
//         } else {
//           reject(new Error(`Llama process exited with code ${code}: ${error}`))
//         }
//       })

//       llamaProcess.on("error", (err) => {
//         reject(new Error(`Failed to start llama process: ${err.message}`))
//       })
//     })
//   }

//   private static async runOnnxModel(model: ModelConfig, prompt: string): Promise<string> {
//     // ONNX implementation would go here
//     // For now, return a placeholder
//     return "ONNX model response placeholder"
//   }

//   static getAvailableModels(): ModelConfig[] {
//     return Array.from(this.models.values())
//   }

//   static isModelAvailable(modelName: string): boolean {
//     const model = this.models.get(modelName)
//     if (!model) return false

//     const fs = require("fs")
//     return fs.existsSync(model.path)
//   }
// }
import { spawn } from "child_process";
import path from "path";
import fs from "fs";
import os from "os";

export interface ModelConfig {
  name: string;
  path: string;
  type: "llama";
  maxTokens: number;
  temperature: number;
  ngl?: number;
  threads?: number;
  promptTemplate?: string;
}

export class AIModelManager {
  private static models: Map<string, ModelConfig> = new Map([
    [
      "mistral-7b",
      {
        name: "Mistral 7B Instruct",
        path: path.join(process.cwd(), "models", "mistral-7b-instruct-v0.1.Q4_K_S.gguf"),
        type: "llama",
        maxTokens: 2048,
        temperature: 0.7,
        ngl: 0, // CPU-only for your Vivobook
        threads: Math.max(4, Math.floor(os.cpus().length / 2)), // Optimal for Ryzen 7 5800H
        promptTemplate: "[INST] {prompt} [/INST]"
      },
    ],
    [
      "codellama",
      {
        name: "CodeLlama 7B",
        path: path.join(process.cwd(), "models", "codellama-7b-instruct.Q4_K_M.gguf"),
        type: "llama",
        maxTokens: 2048,
        temperature: 0.3,
        ngl: 0,
        threads: Math.max(4, Math.floor(os.cpus().length / 2)),
        promptTemplate: "[INST] <<SYS>>\nYou are a coding assistant. Provide clean, efficient code.\n<</SYS>>\n\n{prompt} [/INST]"
      },
    ]
  ]);

  static async generateText(modelName: string, prompt: string): Promise<string> {
    const model = this.models.get(modelName);
    if (!model) {
      throw new Error(`Model ${modelName} not found`);
    }

    if (!this.isModelAvailable(modelName)) {
      throw new Error(`Model file not found at ${model.path}. Please download the GGUF file.`);
    }

    try {
      return await this.runLlamaModel(model, prompt);
    } catch (error) {
      console.error(`[AI] Generation error:`, error);
      throw new Error(`AI generation failed: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  private static async runLlamaModel(model: ModelConfig, prompt: string): Promise<string> {
  return new Promise((resolve, reject) => {
    const binaryName = process.platform === 'win32' ? 'llama-cpp.exe' : 'llama-cpp';
    const llamaPath = path.join(process.cwd(), "bin", binaryName);

    if (!fs.existsSync(llamaPath)) {
      throw new Error(`Llama binary not found at ${llamaPath}`);
    }

    // Format according to your specific binary's requirements
    const args = [
      model.path, // Model path MUST come first
      prompt,     // Prompt MUST come second
      "--temp", model.temperature.toString(),
      "--ctx-size", model.maxTokens.toString(),
      "--threads", (model.threads || 4).toString(),
      "--n-gpu-layers", (model.ngl || 0).toString()
    ];

    console.log(`[AI] Executing: ${llamaPath} ${args.join(' ')}`);

    const llamaProcess = spawn(llamaPath, args, {
      stdio: ['pipe', 'pipe', 'pipe'],
      windowsHide: true
    });

    let output = "";
    let errorOutput = "";

    llamaProcess.stdout.on("data", (data) => {
      const chunk = data.toString();
      process.stdout.write(chunk); // Real-time output
      output += chunk;
    });

    llamaProcess.stderr.on("data", (data) => {
      errorOutput += data.toString();
      console.error(`[AI Error] ${data.toString()}`);
    });

    llamaProcess.on("close", (code) => {
      if (code === 0) {
        resolve(output.trim());
      } else {
        reject(new Error(`Process failed (code ${code}): ${errorOutput || 'Unknown error'}`));
      }
    });

    llamaProcess.on("error", (err) => {
      reject(new Error(`Process error: ${err.message}`));
    });
  });
}

  static getAvailableModels(): ModelConfig[] {
    return Array.from(this.models.values());
  }

  static isModelAvailable(modelName: string): boolean {
    const model = this.models.get(modelName);
    if (!model) return false;
    
    try {
      return fs.existsSync(model.path);
    } catch {
      return false;
    }
  }

  // New: System compatibility check
  static checkSystemCompatibility(): { compatible: boolean; issues: string[] } {
    const issues: string[] = [];
    
    // Check CPU
    if (!os.cpus()[0].model.includes('AMD')) {
      issues.push('Non-AMD CPU detected - may need different thread count');
    }

    // Check RAM
    const gbRam = os.totalmem() / 1024 ** 3;
    if (gbRam < 8) {
      issues.push(`Only ${Math.round(gbRam)}GB RAM - 8GB+ recommended`);
    }

    return {
      compatible: issues.length === 0,
      issues
    };
  }
}