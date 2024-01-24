export default function mapType(name) {
    switch (name) {
        case 'string': {
            return String;
        }
        case 'number': {
            return Number;
        }
        case 'boolean': {
            return Boolean;
        }
        case 'bigint': {
            return BigInt;
        }
        case 'object': {
            return Object;
        }
        case 'symbol': {
            return Symbol;
        }
        case 'null': {
            return null;
        }
        case 'undefined': {
            return undefined;
        }
        case 'array': {
            return Array;
        }
        case 'guid': {
            return GUID;
        }
        case 'memberParameter': {
            return MemberParameter;
        }
        case 'function': {
            return Function;
        }
        default: {
            throw new Error('could not map type');
        }
    }
}