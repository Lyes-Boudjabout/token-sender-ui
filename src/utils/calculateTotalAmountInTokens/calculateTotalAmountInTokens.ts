
export default function calculateTotalAmountInTokens(value: string, tokenName: string): string {
    let result: number;
    switch (tokenName) {
        case "MT":
            result = Number(value) / 1e18
            break;
        default:
            result = Number(value)
            break;
    }
    const output = result.toFixed(4)
    if(Number(value) !== 0 && output === "0.0000") {
        return "\u2248" + output
    }
    return output
}