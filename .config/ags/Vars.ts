import { readFile } from "ags/file";

function get_vars(): any {
    const colors = readFile('../.styles/colors');
    const variables = readFile('../.styles/variables');
    let vars: any = {};

    for (const c of colors.split('\n')) {
        if (c == "" || c == undefined) break;
        const [k, v] = c.split(':');
        vars[k] = "#" + v.trim();
    }
    for (const variable of variables.split('\n')) {
        if (variable == "" || variable == undefined) break;
        const [k, v] = variable.split(':');
        vars[k] = Number(v.trim());
    }

    return vars;
}

export default get_vars();
