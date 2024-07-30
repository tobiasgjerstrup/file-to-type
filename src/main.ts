import fs from "fs/promises";
import { api } from "./config.js";
import axios from "axios";
import { Agent } from "https";

export class System {
    private types: { [key: string]: string } = {};
    private data: object = {};
    private stringSeperator = ".";
    private arrayKeyName = "<ARRAY>";

    public async main() {
        await this.createInputAndOutputFiles();


        if (api.url) {
            this.data = await GET();
        } else {
            const file = await fs.readFile("./input/input.json", "utf8");
            this.data = JSON.parse(file);
        }

        this.objectLookup(this.data);
        fs.writeFile("./output/output.json", JSON.stringify(this.types, null, 2));
    }

    private async createInputAndOutputFiles() {
        try {
            await fs.access("input");
        } catch {
            await fs.mkdir("input");
        }
        try {
            await fs.access("input/input.json");
        } catch {
            await fs.writeFile("input/input.json", '{"input": "goes in this file"}');
        }

        try {
            await fs.access("output");
        } catch {
            await fs.mkdir("output");
        }
    }

    private objectLookup(data: object, keysString = "", isArray = false) {
        for (const key in data) {
            let keyFullName = keysString + key;
            if (isArray) {
                keyFullName = keysString + this.arrayKeyName;
            }

            if (typeof data[key] !== "object" || data[key] === null) {
                if (isArray) {
                    keyFullName = keysString + this.stringSeperator + this.arrayKeyName;
                } else {
                    keyFullName = keysString + this.stringSeperator + key;
                }

                let type: string = typeof data[key];

                if (data[key] === null) {
                    type = "null";
                }

                if (this.types[keyFullName] !== undefined) {
                    if (!this.types[keyFullName].includes(type)) {
                        this.types[keyFullName] += " | " + type;
                    }
                } else {
                    this.types[keyFullName] = type;
                }
            } else if (Array.isArray(data[key])) {
                this.objectLookup(data[key], keyFullName, true);
            } else {
                this.objectLookup(data[key], keyFullName);
            }
        }
    }
}

async function GET() {
    console.log('getting data from url');
    const data = (
        await axios.get(api.url, {
            auth: {
                username: api.basicAuth.username,
                password: api.basicAuth.password,
            },
            httpsAgent: new Agent({
                rejectUnauthorized: false,
            }),
        })
    ).data;
    console.log('got data from url');
    return data;
}

const system = new System();
system.main();
