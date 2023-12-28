import fs from "fs";
import yaml from "js-yaml";
import type { CurriculumVitae } from "./resume-schema";

const cvYaml = fs.readFileSync("cv.yml", "utf8");
export const data = yaml.load(cvYaml) as CurriculumVitae;
