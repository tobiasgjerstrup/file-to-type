import fs from "fs/promises";

export class System {
  private types = {};
  private data = {};

  public async main() {
    const file = await fs.readFile("./input/input.json", "utf8");
    this.data = JSON.parse(file);

    this.types = this.objectLookup(this.data);

    fs.writeFile("./output/output.json", JSON.stringify(this.types));

    console.log(this.types);
  }

  private objectLookup(data: any) {
    let object = {};
    for (const key in data) {
      if (typeof data[key] !== "object") {
        object[key] = typeof data[key];
      } /* else if (Array.isArray(data[key])) {
      } */ else {
        object[key] = this.objectLookup(data[key]);
      }
    }
    return object;
  }
}

const system = new System();
system.main();

/* {
  "data": [
    {
      "name": 123,
      "id": "123",
      "types": {
        "name": "another test",
        "key": 2
      }
    },
    {
      "name": "123",
      "id": "123",
      "types": {
        "name": "test",
        "key": 1
      }
    }
  ],
  "count": 100
}
 */