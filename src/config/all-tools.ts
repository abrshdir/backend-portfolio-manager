export const allTools = [
    {
        "type": "function",
        "name": "getBalance",
        "description": "Get the account balance of the authenticated user",
        "parameters": {
            "type": "object",
            "properties": {},
        }
    },
    {
        "type": "function",
        "name": "executeTransfer",
        "description": "Transfer APT coins from authenticated user to another address",
        "parameters": {
            "type": "object",
            "properties": {
                "userId": {
                    "type": "string",
                    "description": "The user's unique identifier from the session"
                },
                "toAddress": {
                    "type": "string",
                    "description": "The destination address for the transfer"
                },
                "amount": {
                    "type": "number",
                    "description": "The amount of APT coins to transfer"
                }
            },
            "required": ["userId", "toAddress", "amount"]
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