import fs from "fs/promises";

export class System {
    private types: { [key: string]: string } = {};
    private data: object = {};
    private stringSeperator = ".";
    private arrayKeyName = "<ARRAY>";

    public async main() {
        const file = await fs.readFile("./input/input.json", "utf8");
        this.data = JSON.parse(file);

        this.objectLookup(this.data);
        fs.writeFile("./output/output.json", JSON.stringify(this.types, null, 2));
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

const system = new System();
system.main();