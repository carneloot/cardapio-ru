import { PathLike } from "fs";
import { exec } from 'child_process';

export function recognize(filename: PathLike): Promise<string> {
    const options = ["-l por", "-psm 4"];
    const binary = "tesseract";

    const command = [binary, filename, "stdout", ...options].join(" ");

    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) reject(error);
            resolve(stdout);
        });
    });
}
