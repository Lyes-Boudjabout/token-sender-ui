
export default function calculateTotalAmounts(value: string) : string {
    let sum: number = 0;
    if(value === "") {
        return "0";
    }
    if(!value.includes("\n") && !value.includes(",")) {
        const num = Number(value);
        if (isNaN(num)) {
            console.warn(`Invalid number detected: "${value}"`);
            return "0";
        }
        return value;
    }
    const result: string[] = value.split(/[\n,]+/).map(s => s.trim()).filter(Boolean);
    for (const element of result) {
        const num = Number(element);
        if (isNaN(num)) {
            console.warn(`Invalid number detected: "${element}"`);
            return "0";
        }
        sum += num;
    }
    return sum.toString();
}