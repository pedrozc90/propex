const separator = ", ";

export function buildInsertQuery(table: string, data?: any): string[] {
    const query: string[] = [];
    if (data) {
        for (const obj of data) {
            const keys: string[] = [];
            const values: string [] = [];
            for (const k in obj) {
                keys.push(k);

                let v = obj[k];
                if (typeof v === "string") {
                    v = `'${v}'`;
                }
                values.push(v);
            }

            query.push(`INSERT INTO ${table} (${keys.join(separator)}) VALUES (${values.join(separator)})`);
        };
    }
    return query;
}
