export const allTools = [
    {
        "type": "function",
        "name": "getBalance",
        "description": "Get the account balance of the user or the provided address",
        "parameters": {
            "type": "object",
            "properties": {
                "address": {
                    "type": "string",
                    "description": "The address provided for the balance request"
                }
            },
            "required": ["address"]
        }
    },
    {
        "type": "function",
        "name": "executeTransfer",
        "description": "Transfer from sender address to another address",
        "parameters": {
            "type": "object",
            "properties": {
                "fromAddress": {
                    "type": "string",
                    "description": "The address provided to transfer the coin from"
                },
                "toAddress": {
                    "type": "string",
                    "description": "The address provided to receive the coin"
                },
                "amount": {
                    "type": "number",
                    "description": "The amount to be transferred"
                },
                "encryptedPrivateKey": {
                    "type": "string",
                    "description": "The private key of the sender"
                }
            },
            "required": ["fromAddress", "toAddress", "amount", "encryptedPrivateKey"]
        }
    },
    {
        "type": "function",
        "name": "AptosGetTokenPriceTool",
        "description": "Show the current price chart for Aptos coin for the last 90 days.",
        "parameters": {
            "type": "object",
            "properties": {
                "timeframe": {
                    "type": "string",
                    "enum": ["hourly", "5-minutely", "daily"],
                    "default": "daily",
                    "description": "Price resolution interval"
                }
            },
            "required": []
        }
    }
]